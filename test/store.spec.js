import { describe, test, expect, vi, beforeEach } from 'vitest';
import createWineStore from '../store/index.js';
import { fakeFirebase, product, photo } from './helpers/firebase.js';
let fake; let store;
beforeEach(() => { fake = fakeFirebase(); store = createWineStore(fake); store.commit('setCategories', [{ id: 'red', name: 'Tintos' }]); store.commit('setBodegas', [{ id: 'estate', name: 'Bodega' }]); });
describe('carrito', () => {
  test('mantiene precios numéricos al añadir repetidamente y al quitar', async () => {
    await store.dispatch('addToCart', { product: { ...product, id: 'wine' }, quantity: 1 });
    expect(store.getters.cartTotal).toBe(1500);
    await store.dispatch('addToCart', { product: { ...product, id: 'wine' }, quantity: 2 });
    expect(store.getters.cartTotal).toBe(4500); expect(store.getters.cartItems[0].qty).toBe(3);
    store.commit('removeItem', { id: 'wine' }); expect(store.getters.cartTotal).toBe(0);
  });
  test('rechaza cantidades fraccionarias, stock insuficiente y archivados', async () => {
    await expect(store.dispatch('addToCart', { product: { ...product, id: 'wine' }, quantity: 1.5 })).rejects.toThrow('entero');
    await expect(store.dispatch('addToCart', { product: { ...product, id: 'wine', inventory_units: 1 }, quantity: 2 })).rejects.toThrow('disponibles');
    await expect(store.dispatch('addToCart', { product: { ...product, id: 'wine', archived: true }, quantity: 1 })).rejects.toThrow('disponible');
  });
  test('revisa precios y disponibilidad antes de enviar', async () => {
    fake.data.Vinos.wine = { ...product, variant_price: 1500 };
    await store.dispatch('addToCart', { product: { ...product, id: 'wine' }, quantity: 1 });
    fake.data.Vinos.wine.variant_price = 2000;
    await expect(store.dispatch('enviarOrden')).rejects.toThrow('actualizaron'); expect(store.getters.cartTotal).toBe(2000);
    expect(await store.dispatch('enviarOrden')).toMatch(/^https:\/\/wa.me\/59896260462\?text=/);
    fake.data.Vinos.wine.archived = true; await expect(store.dispatch('enviarOrden')).rejects.toThrow('disponibilidad');
  });
});
describe('guardado seguro', () => {
  test('no permite crear sin sesión', async () => {
    fake.auth.currentUser = null; await expect(store.dispatch('addProduct', product)).rejects.toThrow('Inicia sesión'); expect(fake.data.Vinos).toEqual({});
  });
  test('cualquier cuenta autenticada puede crear sin rol adicional', async () => {
    fake.auth.currentUser.uid = 'another-account';
    await store.dispatch('addProduct', product);
    expect(Object.keys(fake.data.Vinos)).toHaveLength(1);
  });
  test('propaga fallo de creación y limpia las fotos ya subidas', async () => {
    const original = fake.db.collection;
    fake.db.collection = name => { const c = original(name); if (name === 'Vinos') { const doc = c.doc; c.doc = id => { const result = doc(id); result.set = async () => { throw new Error('offline'); }; return result; }; } return c; };
    await expect(store.dispatch('addProduct', { ...product, main_variant_image: [photo()] })).rejects.toThrow('offline');
    expect(fake.objects.size).toBe(0); expect(fake.data.Vinos).toEqual({});
  });
  test('usa rutas únicas para fotos con igual nombre y borra la vieja después de guardar', async () => {
    const oldUrl = 'https://storage.test/products/wine/bottle.jpg';
    fake.objects.set('products/wine/bottle.jpg', photo()); fake.data.Vinos.wine = { ...product, main_variant_image: [oldUrl] };
    const images = await store.dispatch('saveProductImages', { product: { ...product, id: 'wine', main_variant_image: [oldUrl] }, changes: [{ index: 0, file: photo() }] });
    expect(images[0]).not.toBe(oldUrl); expect(fake.objects.size).toBe(1);
    expect(fake.events.indexOf('update:Vinos/wine')).toBeLessThan(fake.events.indexOf('delete-image:products/wine/bottle.jpg'));
    expect(store.state.products[0].main_variant_image).toEqual(images); expect(store.state.filteredProducts[0].main_variant_image).toEqual(images);
  });
  test('conserva foto anterior si Firestore rechaza el cambio', async () => {
    const oldUrl = 'https://storage.test/products/wine/bottle.jpg'; fake.objects.set('products/wine/bottle.jpg', photo());
    fake.data.Vinos.wine = { ...product, main_variant_image: [oldUrl] };
    await expect(store.dispatch('saveProductImages', { product: { ...product, id: 'wine', main_variant_image: [oldUrl], variant_price: '-1' }, changes: [{ index: 0, file: photo() }] })).rejects.toThrow('precio');
    expect([...fake.objects.keys()]).toEqual(['products/wine/bottle.jpg']); expect(fake.data.Vinos.wine.main_variant_image).toEqual([oldUrl]);
  });
  test('valida antes de escribir y propaga fallos de lectura', async () => {
    await expect(store.dispatch('addProduct', { ...product, product_name: '' })).rejects.toThrow('nombre'); expect(fake.data.Vinos).toEqual({});
    const original = fake.db.collection; fake.db.collection = name => name === 'Vinos' ? { get: async () => { throw new Error('offline'); } } : original(name);
    await expect(store.dispatch('fetchProducts')).rejects.toThrow('offline');
  });
});
describe('gestión', () => {
  test('archiva, restaura y exige archivar antes de borrar', async () => {
    fake.data.Vinos.wine = { ...product };
    await expect(store.dispatch('deleteProduct', 'wine')).rejects.toThrow('Archiva');
    await store.dispatch('setArchived', { id: 'wine', archived: true }); expect(fake.data.Vinos.wine.archived).toBe(true);
    await store.dispatch('setArchived', { id: 'wine', archived: false }); expect(fake.data.Vinos.wine.archived).toBe(false);
    await store.dispatch('setArchived', { id: 'wine', archived: true }); await store.dispatch('deleteProduct', 'wine'); expect(fake.data.Vinos.wine).toBeUndefined();
  });
  test('renombra referencias antiguas y bloquea eliminación de categorías usadas', async () => {
    fake.data.Vinos.wine = { ...product };
    await store.dispatch('updateCategory', { id: 'red', name: 'Tintos nuevos', description: '' });
    expect(fake.data.Vinos.wine.product_categories).toBe('Tintos nuevos'); expect(fake.data.Vinos.wine.category_id).toBe('red');
    await expect(store.dispatch('deleteCategory', 'red')).rejects.toThrow('asociados');
  });
  test('migración repetible conserva IDs y deja referencias ambiguas pendientes', async () => {
    fake.data.Vinos.wine = { ...product }; fake.data.Vinos.unknown = { ...product, product_bodega: 'Desconocida' };
    const plan = await store.dispatch('planReferenceMigration'); expect(plan.changes.map(change => change.id)).toEqual(['wine']); expect(plan.unresolved[0].id).toBe('unknown');
    await store.dispatch('migrateReferences'); expect(fake.data.Vinos.wine.category_id).toBe('red'); expect((await store.dispatch('planReferenceMigration')).changes).toHaveLength(0);
    const backup = await store.dispatch('exportBackup'); expect(backup.collections.Vinos.map(item => item.id)).toContain('wine'); expect(backup.collections.categories).toHaveLength(1);
  });
});
