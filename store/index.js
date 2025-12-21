import Vuex from "vuex";
import { db, firebase } from "@/plugins/firebase";
import "firebase/storage";
const createStore = () => {
  return new Vuex.Store({
    state: {
      products: [],
      categories: [],
      bodegas: [],
      filteredProducts: [],
      product: {},
      cart: {
        items: [],
      },
    },
    mutations: {
      setProducts(state, products) {
        state.products = products;
      },
      setFilteredProducts(state, filteredProducts) {
        state.filteredProducts = filteredProducts;
      },
      setCategories(state, categories) {
        state.categories = categories;
      },
      setBodegas(state, bodegas) {
        state.bodegas = bodegas;
      },
      setProduct(state, product) {
        state.product = product;
      },
      addItemToCart(state, item) {
        console.log(item)
        const existingItem = state.cart.items.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          existingItem.qty += item.qty;
          existingItem.price = (
            Number(existingItem.price.replace('.', '')) +
            Number(item.price.replace('.', ''))
          )
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        } else {
          state.cart.items.push(item);
        }
      },
      removeItem(state, payload) {
        const index = state.cart.items.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          state.cart.items.splice(index, 1);
        }
      },
      UPDATE_PRODUCT_IMAGE(state, { productId, imageIndex, newImageUrl }) {
        const product = state.products.find((p) => p.id === productId);
        if (product) {
          product.main_variant_image[imageIndex] = newImageUrl;
        }
      },
    },
    getters: {
      cartTotal(state) {
        return state.cart.items
          .reduce((acc, item) => acc + Number(item.price), 0);
      },
      cartItems(state) {
        return state.cart.items;
      },
    },
    actions: {
      enviarOrden({ getters }) {
        const number = "+573150361379";
        const pedido = getters.cartItems
          .map((item) => `x${item.qty} ${item.name}`)
          .join(" || ");
        const total = getters.cartTotal;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(
          `Pedido: ${pedido}. **SUBTOTAL: ${total}**`
        )}`;
        window.open(whatsappUrl);
      },

      addToCart({ commit }, { product, quantity }) {
        console.log(product)
        const formattedPrice = Number(product.variant_price).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const totalPrice = (Number(product.variant_price) * quantity).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        commit("addItemToCart", {
          id: product.id,
          name: product.product_name,
          image: product.main_variant_image[0],
          qty: quantity,
          category: product.product_categories,
          price: totalPrice,
        });
      },
      async fetchProducts({ commit }) {
        try {
          const response = await db.collection("Vinos").get();
          const products = response.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          commit("setProducts", products);
          commit("setFilteredProducts", products);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      },
      async fetchCategories({ commit }) {
        try {
          const response = await db.collection("categories").get();
          const categories = response.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          commit("setCategories", categories);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      },
      async addCategory({ dispatch }, category) {
        try {
          const payload = {
            name: category.name?.trim() || "",
            description: category.description?.trim() || "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          };

          if (!payload.name) {
            throw new Error("El nombre de la categoría es obligatorio");
          }

          const docRef = await db.collection("categories").add(payload);
          await db.collection("categories").doc(docRef.id).update({ id: docRef.id });
          await dispatch("fetchCategories");
          return docRef.id;
        } catch (error) {
          console.error("Error al crear la categoría:", error);
          throw error;
        }
      },
      async updateCategory({ dispatch }, category) {
        try {
          if (!category?.id) {
            throw new Error("Categoría sin identificador");
          }

          const payload = {
            name: category.name?.trim() || "",
            description: category.description?.trim() || "",
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          };

          if (!payload.name) {
            throw new Error("El nombre de la categoría es obligatorio");
          }

          await db.collection("categories").doc(category.id).update(payload);
          await dispatch("fetchCategories");
        } catch (error) {
          console.error("Error al actualizar la categoría:", error);
          throw error;
        }
      },
      async deleteCategory({ dispatch }, categoryId) {
        try {
          if (!categoryId) {
            throw new Error("Identificador de categoría requerido");
          }

          await db.collection("categories").doc(categoryId).delete();
          await dispatch("fetchCategories");
        } catch (error) {
          console.error("Error al eliminar la categoría:", error);
          throw error;
        }
      },
      async fetchBodegas({ commit }) {
        try {
          const response = await db.collection("bodegas").get();
          const bodegas = response.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          commit("setBodegas", bodegas);
        } catch (error) {
          console.error("Error fetching bodegas:", error);
        }
      },
      async addBodega({ dispatch }, bodega) {
        try {
          const payload = {
            name: bodega.name?.trim() || "",
            description: bodega.description?.trim() || "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          };

          if (!payload.name) {
            throw new Error("El nombre de la bodega es obligatorio");
          }

          const docRef = await db.collection("bodegas").add(payload);
          await db.collection("bodegas").doc(docRef.id).update({ id: docRef.id });
          await dispatch("fetchBodegas");
          return docRef.id;
        } catch (error) {
          console.error("Error al crear la bodega:", error);
          throw error;
        }
      },
      async updateBodega({ dispatch }, bodega) {
        try {
          if (!bodega?.id) {
            throw new Error("Bodega sin identificador");
          }

          const payload = {
            name: bodega.name?.trim() || "",
            description: bodega.description?.trim() || "",
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          };

          if (!payload.name) {
            throw new Error("El nombre de la bodega es obligatorio");
          }

          await db.collection("bodegas").doc(bodega.id).update(payload);
          await dispatch("fetchBodegas");
        } catch (error) {
          console.error("Error al actualizar la bodega:", error);
          throw error;
        }
      },
      async deleteBodega({ dispatch }, bodegaId) {
        try {
          if (!bodegaId) {
            throw new Error("Identificador de bodega requerido");
          }

          await db.collection("bodegas").doc(bodegaId).delete();
          await dispatch("fetchBodegas");
        } catch (error) {
          console.error("Error al eliminar la bodega:", error);
          throw error;
        }
      },
      async fetchProductBySlug({ commit }, slug) {
        try {
          const ref = db
            .collection("Vinos")
            .where("product_handle", "==", slug)
            .limit(1);
          const snapshot = await ref.get();

          if (snapshot.empty) {
            commit("setProduct", {});
            return null;
          }

          const doc = snapshot.docs[0];
          const product = { id: doc.id, ...doc.data() };
          commit("setProduct", product);
          return product;
        } catch (error) {
          console.error("Error fetching product:", error);
          commit("setProduct", {});
          throw error;
        }
      },
      async fetchProductById({ commit }, id) {
        try {
          if (!id) {
            throw new Error("Identificador de producto requerido");
          }

          const doc = await db.collection("Vinos").doc(id).get();

          if (!doc.exists) {
            commit("setProduct", {});
            return null;
          }

          const product = { id: doc.id, ...doc.data() };
          commit("setProduct", product);
          return product;
        } catch (error) {
          console.error("Error fetching product by id:", error);
          commit("setProduct", {});
          throw error;
        }
      },
      async filterProducts({ commit }, category) {
        try {
          let query = db.collection("Vinos");

          // Si se ha seleccionado una categoría específica, hacer la consulta filtrada
          if (category !== "") {
            query = query.where("product_categories", "==", category);
          }

          const snapshot = await query.get();
          const filteredProducts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          commit("setFilteredProducts", filteredProducts);
        } catch (error) {
          console.error("Error filtering products:", error);
        }
      },
      async updateProduct({ commit }, product) {
        try {
          if (!product?.id) {
            throw new Error("Producto sin identificador");
          }

          const productRef = db.collection("Vinos").doc(product.id);

          const payload = {
            product_name: product.product_name ?? "",
            product_handle: product.product_handle ?? "",
            product_categories: product.product_categories ?? "",
            variant_price: product.variant_price ?? "",
            product_description: product.product_description ?? "",
            main_variant_image: Array.isArray(product.main_variant_image)
              ? product.main_variant_image
              : [],
            product_bodega: product.product_bodega ?? "",
            product_cantidad:
              product.product_cantidad !== undefined
                ? product.product_cantidad
                : null,
            product_year:
              product.product_year !== undefined ? product.product_year : null,
            stock:
              typeof product.stock === "boolean"
                ? product.stock
                : Boolean(product.stock),
          };

          await productRef.update(payload);

          // Opcional: Vuelve a obtener los productos y actualiza el estado del store
          const response = await db.collection("Vinos").get();
          const products = response.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          commit("setProducts", products);
        } catch (error) {
          console.error("Error al actualizar el producto:", error);
          throw error;
        }
      },

      async uploadImage({ commit }, { file, oldImageUrl, productId, productName }) {
        try {
          const storageRef = firebase.storage().ref();

          // Preferimos el ID del producto como nombre de carpeta; caemos al nombre si no existe
          const folderName = productId || productName || "unknown-product";
          const fileRef = storageRef.child(`products/${folderName}/${file.name}`);

          // Subir la nueva imagen
          const snapshot = await fileRef.put(file);
          const downloadURL = await snapshot.ref.getDownloadURL();

          // Eliminar la imagen anterior si existe
          if (oldImageUrl) {
            const oldFileRef = firebase.storage().refFromURL(oldImageUrl);
            await oldFileRef.delete();
          }

          return downloadURL;
        } catch (error) {
          console.error("Error al manejar la imagen:", error);
          throw error;
        }
      },
      async updateProductImage({ commit }, { productId, imageIndex, newImageUrl }) {
        try {
          const productRef = firebase.firestore().collection("Vinos").doc(productId);

          // Obtener el producto actual
          const productDoc = await productRef.get();
          if (!productDoc.exists) throw new Error("Producto no encontrado");

          const productData = productDoc.data();
          console.log(productData)
          const updatedImages = [...productData.main_variant_image];
          updatedImages[imageIndex] = newImageUrl;

          // Actualizar el array de imágenes en Firestore
          await productRef.update({ main_variant_image: updatedImages });

          // Opcional: actualizar el store localmente
          commit("UPDATE_PRODUCT_IMAGE", { productId, imageIndex, newImageUrl });
        } catch (error) {
          console.error("Error al actualizar la imagen en el producto:", error);
          throw error;
        }
      },

      async addProduct({ commit }, product) {
        try {
          const storageRef = firebase.storage().ref();
          const imageFiles = Array.isArray(product?.main_variant_image)
            ? product.main_variant_image
            : [];

          // Creamos el documento primero (sin imágenes) para obtener el ID y usarlo como carpeta
          const { main_variant_image, ...productPayload } = product || {};
          const docRef = await db.collection("Vinos").add({
            ...productPayload,
            stock:
              typeof productPayload?.stock === "boolean"
                ? productPayload.stock
                : Boolean(productPayload?.stock),
            main_variant_image: [],
          });
          const productId = docRef.id;

          // Subir todas las imágenes seleccionadas usando el ID como carpeta
          const imageUrls = [];
          for (const image of imageFiles) {
            const imageRef = storageRef.child(`products/${productId}/${image.name}`);
            const snapshot = await imageRef.put(image);
            const downloadURL = await snapshot.ref.getDownloadURL();
            imageUrls.push(downloadURL);
          }

          // Guardar ID y URLs finales en el documento
          await docRef.update({ id: productId, main_variant_image: imageUrls });

          // Refrescar productos después de agregar uno nuevo
          const response = await db.collection("Vinos").get();
          const products = response.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          commit("setProducts", products);
        } catch (error) {
          console.error("Error adding product:", error);
        }
      },

      async deleteProduct({ commit, dispatch }, id) {
        try {
          const ref = db.collection("Vinos").doc(id);
          const doc = await ref.get();

          if (!doc.exists) {
            throw new Error("Producto no encontrado");
          }

          const data = doc.data();
          const mainImages = Array.isArray(data.main_variant_image)
            ? data.main_variant_image.filter(Boolean)
            : data.main_variant_image
            ? [data.main_variant_image]
            : [];
          const legacyImageUrl = data.image;

          // Intentamos eliminar todas las imágenes asociadas (array y legacy)
          const deleteTargets = [...mainImages, legacyImageUrl].filter(Boolean);
          await Promise.allSettled(
            deleteTargets.map(async (url) => {
              const storageRef = firebase.storage().refFromURL(url);
              await storageRef.delete();
            })
          );

          // Limpia la carpeta basada en ID por si quedan archivos sueltos
          try {
            const folderRef = firebase.storage().ref().child(`products/${id}`);
            const { items } = await folderRef.listAll();
            if (items.length) {
              await Promise.allSettled(items.map((itemRef) => itemRef.delete()));
            }
          } catch (cleanupError) {
            console.warn("No se pudo limpiar la carpeta del producto:", cleanupError);
          }

          await ref.delete();
          console.log("Documento eliminado correctamente");

          // Refresca los productos después de eliminar uno
          await dispatch("fetchProducts");
        } catch (error) {
          console.error("Error al eliminar el producto:", error);
          throw error;
        }
      },
    },
  });
};

export default createStore;
