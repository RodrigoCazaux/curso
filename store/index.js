import { createStore } from 'vuex';
import { numericPrice, productPayload, validateImage, isAvailable, whatsappUrl, MAX_IMAGES } from '../lib/wines.js';

export default function createWineStore({ db, firebase, config }) {
  const timestamp = () => firebase.firestore.FieldValue.serverTimestamp();
  const localTimestamp = () => firebase.firestore.Timestamp?.now?.() || timestamp();
  const fromDoc = doc => ({ ...doc.data(), id: doc.id });
  const sort = items => [...items].sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  const requireAdmin = async () => {
    if (!firebase.auth().currentUser) throw new Error('Inicia sesión para gestionar el catálogo.');
  };
  const cleanup = async urls => {
    const results = await Promise.allSettled([...new Set(urls)].map(url => firebase.storage().refFromURL(url).delete()));
    if (results.some(result => result.status === 'rejected')) console.warn('Quedaron fotos sin usar por limpiar en Storage.');
  };
  const taxonomy = (collection, stateKey, label, field, idField) => ({
    async fetch({ commit }) {
      const response = await db.collection(collection).get();
      commit(`set${stateKey}`, response.docs.map(fromDoc));
    },
    async add({ dispatch }, value) {
      await requireAdmin();
      const name = String(value.name || '').trim();
      if (!name || name.length > 200) throw new Error(`El nombre de ${label} es obligatorio (máximo 200 caracteres).`);
      if (!(await db.collection(collection).where('name', '==', name).limit(1).get()).empty) throw new Error('Ya existe un elemento con ese nombre.');
      const ref = db.collection(collection).doc();
      await ref.set({ name, description: String(value.description || '').trim(), createdAt: timestamp(), updatedAt: timestamp() });
      await dispatch(`fetch${stateKey}`);
      return ref.id;
    },
    async update({ dispatch }, value) {
      await requireAdmin();
      const ref = db.collection(collection).doc(value.id);
      const old = await ref.get();
      if (!old.exists) throw new Error('El elemento ya no existe.');
      const name = String(value.name || '').trim();
      if (!name || name.length > 200) throw new Error(`El nombre de ${label} es obligatorio (máximo 200 caracteres).`);
      const duplicates = await db.collection(collection).where('name', '==', name).get();
      if (duplicates.docs.some(doc => doc.id !== value.id)) throw new Error('Ya existe un elemento con ese nombre.');
      const wines = await db.collection('Vinos').get();
      const affected = wines.docs.filter(doc => doc.data()[idField] === value.id || (!doc.data()[idField] && (doc.data()[field] === old.data().name || (Array.isArray(doc.data()[field]) && doc.data()[field].includes(old.data().name)))));
      if (affected.length > 400) throw new Error('Hay más de 400 vinos asociados. Usa una migración por lotes antes de renombrar.');
      const batch = db.batch();
      batch.update(ref, { name, description: String(value.description || '').trim(), updatedAt: timestamp() });
      affected.forEach(doc => {
        const existing = doc.data()[field];
        const changes = { [field]: Array.isArray(existing) ? existing.map(item => item === old.data().name ? name : item) : name, updatedAt: timestamp() };
        if (!Array.isArray(existing)) changes[idField] = value.id;
        batch.update(doc.ref, changes);
      });
      await batch.commit();
      await Promise.all([dispatch(`fetch${stateKey}`), dispatch('fetchProducts')]);
    },
    async remove({ dispatch }, id) {
      await requireAdmin();
      const ref = db.collection(collection).doc(id);
      const item = await ref.get();
      if (!item.exists) throw new Error('El elemento ya no existe.');
      const wines = await db.collection('Vinos').get();
      if (wines.docs.some(doc => doc.data()[idField] === id || doc.data()[field] === item.data().name || (Array.isArray(doc.data()[field]) && doc.data()[field].includes(item.data().name)))) throw new Error('Hay vinos asociados, incluso archivados. Reasígnalos antes de eliminar.');
      await ref.delete();
      await dispatch(`fetch${stateKey}`);
    },
  });
  const categories = taxonomy('categories', 'Categories', 'la categoría', 'product_categories', 'category_id');
  const bodegas = taxonomy('bodegas', 'Bodegas', 'la bodega', 'product_bodega', 'bodega_id');

  return createStore({
    state: () => ({ products: [], filteredProducts: [], categories: [], bodegas: [], product: {}, cart: { items: [] } }),
    mutations: {
      setProducts(state, products) { state.products = sort(products); state.filteredProducts = state.products; },
      setFilteredProducts(state, products) { state.filteredProducts = products; },
      setCategories(state, items) { state.categories = items; },
      setBodegas(state, items) { state.bodegas = items; },
      setProduct(state, product) { state.product = product; },
      upsertProduct(state, product) {
        const items = state.products.filter(item => item.id !== product.id);
        state.products = sort([...items, product]); state.filteredProducts = state.products;
        if (state.product.id === product.id) state.product = product;
      },
      addItemToCart(state, item) {
        const existing = state.cart.items.find(product => product.id === item.id);
        if (existing) { existing.qty += item.qty; existing.unitPrice = item.unitPrice; }
        else state.cart.items.push(item);
      },
      removeItem(state, item) { state.cart.items = state.cart.items.filter(product => product.id !== item.id); },
      setCartQuantity(state, { id, qty }) {
        const item = state.cart.items.find(product => product.id === id);
        if (item && Number.isSafeInteger(qty) && qty > 0) item.qty = qty;
      },
      clearCart(state) { state.cart.items = []; },
    },
    getters: {
      cartTotal: state => Math.round(state.cart.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0) * 100) / 100,
      cartItems: state => state.cart.items,
    },
    actions: {
      async fetchProducts({ commit }) { commit('setProducts', (await db.collection('Vinos').get()).docs.map(fromDoc)); },
      fetchCategories: categories.fetch, addCategory: categories.add, updateCategory: categories.update, deleteCategory: categories.remove,
      fetchBodegas: bodegas.fetch, addBodega: bodegas.add, updateBodega: bodegas.update, deleteBodega: bodegas.remove,
      async fetchProductById({ commit }, id) {
        commit('setProduct', {});
        const doc = await db.collection('Vinos').doc(id).get();
        const product = doc.exists ? fromDoc(doc) : null;
        commit('setProduct', product || {});
        return product;
      },
      async addToCart({ commit, state }, { product, quantity }) {
        if (!isAvailable(product)) throw new Error('Este vino no está disponible.');
        if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 1000000) throw new Error('La cantidad debe ser un número entero mayor que cero.');
        const existing = state.cart.items.find(item => item.id === product.id);
        const qty = quantity + (existing?.qty || 0);
        if (product.inventory_units != null && qty > product.inventory_units) throw new Error('La cantidad supera las unidades disponibles.');
        commit('addItemToCart', { id: product.id, name: product.product_name, image: product.main_variant_image?.[0] || '/wine-placeholder.svg', qty: quantity, unitPrice: numericPrice(product.variant_price), category: product.product_categories, maxQty: product.inventory_units ?? null });
      },
      async enviarOrden({ state, commit }) {
        if (!state.cart.items.length) throw new Error('Añade un vino antes de enviar el pedido.');
        // Recheck live prices and availability before generating the WhatsApp message.
        const docs = await Promise.all(state.cart.items.map(item => db.collection('Vinos').doc(item.id).get()));
        const updated = docs.map((doc, index) => {
          const item = state.cart.items[index]; const product = doc.exists ? fromDoc(doc) : null;
          if (!isAvailable(product) || (product.inventory_units != null && item.qty > product.inventory_units)) throw new Error(`${item.name} ya no tiene esa disponibilidad. Ajusta tu pedido.`);
          return { ...item, unitPrice: numericPrice(product.variant_price), name: product.product_name };
        });
        const changed = updated.some((item, index) => item.unitPrice !== state.cart.items[index].unitPrice);
        updated.forEach(item => { const current = state.cart.items.find(existing => existing.id === item.id); current.unitPrice = item.unitPrice; current.name = item.name; });
        if (changed) throw new Error('Se actualizaron los precios del pedido. Revisa el subtotal y vuelve a enviarlo.');
        return whatsappUrl(updated, config.whatsappNumber, config.currency);
      },
      async addProduct({ commit, state }, product) {
        await requireAdmin();
        const files = product.main_variant_image || [];
        if (!Array.isArray(files) || files.length > MAX_IMAGES) throw new Error('Puedes añadir hasta 8 fotos.');
        files.forEach(validateImage);
        const payload = productPayload({ ...product, main_variant_image: [] }, { ...state, allowLocalImages: config.firebaseEmulators });
        const ref = db.collection('Vinos').doc();
        const uploaded = [];
        try {
          for (const file of files) {
            const imageRef = firebase.storage().ref().child(`products/${ref.id}/${crypto.randomUUID()}.${file.type.split('/')[1]}`);
            uploaded.push(imageRef);
            await imageRef.put(file, { contentType: file.type });
            payload.main_variant_image.push(await imageRef.getDownloadURL());
          }
          const saved = { ...payload, createdAt: timestamp(), updatedAt: timestamp() };
          await ref.set(saved);
          commit('upsertProduct', { ...saved, createdAt: localTimestamp(), updatedAt: localTimestamp(), id: ref.id });
          return ref.id;
        } catch (error) {
          await Promise.allSettled(uploaded.map(ref => ref.delete()));
          throw error;
        }
      },
      async duplicateProduct({ dispatch }, id) {
        await requireAdmin();
        const doc = await db.collection('Vinos').doc(id).get();
        if (!doc.exists) throw new Error('El vino ya no existe.');
        const original = fromDoc(doc);
        const files = [];
        const originalImages = Array.isArray(original.main_variant_image) ? original.main_variant_image : original.main_variant_image ? [original.main_variant_image] : [];
        for (const url of originalImages) {
          // Only copy objects belonging to this project's Storage bucket.
          const ref = firebase.storage().refFromURL(url);
          if (ref.bucket !== config.firebase.storageBucket) throw new Error('La foto está en otro almacenamiento. Añádela manualmente al nuevo vino.');
          const response = await fetch(url);
          if (!response.ok) throw new Error('No se pudo copiar una foto. Inténtalo otra vez.');
          const blob = await response.blob();
          const file = new File([blob], 'copia', { type: blob.type }); validateImage(file); files.push(file);
        }
        return dispatch('addProduct', { ...original, product_name: `${original.product_name.slice(0, 190)} (copia)`, product_handle: '', main_variant_image: files, archived: false, stock: false, inventory_units: null });
      },
      async updateProduct({ commit, state }, product) {
        await requireAdmin();
        if (!product.id) throw new Error('Producto sin identificador.');
        const payload = productPayload(product, { ...state, allowLocalImages: config.firebaseEmulators });
        const ref = db.collection('Vinos').doc(product.id);
        const existing = await ref.get();
        if (!existing.exists) throw new Error('El vino ya no existe.');
        await ref.update({ ...payload, updatedAt: timestamp() });
        commit('upsertProduct', { ...existing.data(), ...payload, id: ref.id });
      },
      async saveProductImages({ dispatch }, { product, changes = [], addedFiles = [] }) {
        await requireAdmin();
        const images = [...(product.main_variant_image || [])];
        if (images.length + addedFiles.length > MAX_IMAGES) throw new Error('Puedes añadir hasta 8 fotos.');
        [...changes.map(change => change.file), ...addedFiles].forEach(validateImage);
        const uploaded = []; const replaced = [];
        try {
          const upload = async file => {
            const ref = firebase.storage().ref().child(`products/${product.id}/${crypto.randomUUID()}.${file.type.split('/')[1]}`);
            uploaded.push(ref); await ref.put(file, { contentType: file.type }); return ref.getDownloadURL();
          };
          for (const change of changes) {
            if (!Number.isInteger(change.index) || change.index < 0 || change.index >= images.length) throw new Error('Selecciona una foto existente.');
            replaced.push(images[change.index]); images[change.index] = await upload(change.file);
          }
          for (const file of addedFiles) images.push(await upload(file));
          await dispatch('updateProduct', { ...product, main_variant_image: images });
        } catch (error) {
          await Promise.allSettled(uploaded.map(ref => ref.delete())); throw error;
        }
        await cleanup(replaced.filter(url => !images.includes(url)));
        return images;
      },
      async setArchived({ commit }, { id, archived }) {
        await requireAdmin();
        const ref = db.collection('Vinos').doc(id); const doc = await ref.get();
        if (!doc.exists) throw new Error('El vino ya no existe.');
        await ref.update({ archived: Boolean(archived), updatedAt: timestamp() });
        commit('upsertProduct', { ...fromDoc(doc), archived: Boolean(archived) });
      },
      async quickUpdate({ commit }, { id, variant_price, stock }) {
        await requireAdmin();
        const ref = db.collection('Vinos').doc(id); const doc = await ref.get();
        if (!doc.exists) throw new Error('El vino ya no existe.');
        const data = fromDoc(doc);
        if (stock === true && data.inventory_units === 0) throw new Error('Actualiza las unidades disponibles antes de activar este vino.');
        const changes = { updatedAt: timestamp() };
        if (variant_price !== undefined) changes.variant_price = numericPrice(variant_price);
        if (typeof stock === 'boolean') changes.stock = stock;
        await ref.update(changes); commit('upsertProduct', { ...data, ...changes });
      },
      async deleteProduct({ commit, state }, id) {
        await requireAdmin();
        const ref = db.collection('Vinos').doc(id); const doc = await ref.get();
        if (!doc.exists) throw new Error('El vino ya no existe.');
        if (doc.data().archived !== true) throw new Error('Archiva el vino antes de eliminarlo definitivamente.');
        const data = doc.data();
        await ref.delete();
        commit('setProducts', state.products.filter(product => product.id !== id));
        const images = data.main_variant_image;
        await cleanup((Array.isArray(images) ? images : [images]).filter(Boolean));
      },
      async exportBackup() {
        await requireAdmin();
        const entries = await Promise.all(['Vinos', 'categories', 'bodegas'].map(async collection => [collection, (await db.collection(collection).get()).docs.map(fromDoc)]));
        const serialize = value => {
          if (value?.toDate) return { __type: 'timestamp', value: value.toDate().toISOString() };
          if (Array.isArray(value)) return value.map(serialize);
          if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serialize(item)]));
          return value;
        };
        return { version: 1, project: config.firebase.projectId, exportedAt: new Date().toISOString(), collections: serialize(Object.fromEntries(entries)) };
      },
      async planReferenceMigration({ dispatch, state }) {
        await requireAdmin();
        await Promise.all([dispatch('fetchProducts'), dispatch('fetchCategories'), dispatch('fetchBodegas')]);
        const changes = []; const unresolved = [];
        state.products.forEach(product => {
          const category = state.categories.filter(item => item.id === product.category_id || (!product.category_id && item.name === product.product_categories));
          const bodega = state.bodegas.filter(item => item.id === product.bodega_id || (!product.bodega_id && item.name === product.product_bodega));
          if (category.length !== 1 || bodega.length !== 1) { unresolved.push({ id: product.id, name: product.product_name }); return; }
          const patch = { category_id: category[0].id, bodega_id: bodega[0].id, product_categories: category[0].name, product_bodega: bodega[0].name, archived: product.archived === true };
          if (Object.entries(patch).some(([key, value]) => product[key] !== value)) changes.push({ id: product.id, patch });
        });
        return { changes, unresolved };
      },
      async migrateReferences({ dispatch }) {
        await requireAdmin();
        const plan = await dispatch('planReferenceMigration');
        for (let offset = 0; offset < plan.changes.length; offset += 400) {
          const batch = db.batch();
          plan.changes.slice(offset, offset + 400).forEach(({ id, patch }) => batch.update(db.collection('Vinos').doc(id), { ...patch, updatedAt: timestamp() }));
          await batch.commit();
        }
        await dispatch('fetchProducts');
        return { updated: plan.changes.length, unresolved: plan.unresolved };
      },
    },
  });
}
