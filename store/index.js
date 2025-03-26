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
      async fetchProductBySlug({ commit }, slug) {
        try {
          const ref = db.collection("Vinos").where("product_handle", "==", slug);
          const snapshot = await ref.get();
          const product = snapshot.docs.shift().data();
          commit("setProduct", product);
        } catch (error) {
          console.error("Error fetching product:", error);
          commit("setProduct", {});
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
          const productQuery = await db
            .collection("Vinos")
            .where("product_handle", "==", product.product_handle)
            .get();

          if (productQuery.empty) {
            throw new Error("Producto no encontrado");
          }

          const productId = productQuery.docs[0].id;
          const productRef = db.collection("Vinos").doc(productId);

          // Asegúrate de incluir todas las propiedades que quieres actualizar, incluyendo 'images'
          await productRef.update({
            product_name: product.product_name,
            product_handle: product.product_handle,
            product_categories: product.product_categories,
            variant_price: product.variant_price,
            product_description: product.product_description,
            main_variant_image: product.main_variant_image, // Agregar el array de imágenes actualizado
            product_bodega: product.product_bodega,
            product_cantidad: product.product_cantidad,
            product_year: product.product_year,
            stock: product.stock
          });

          console.log("Producto actualizado correctamente");

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

      async uploadImage({ commit }, { file, oldImageUrl, productName }) {
        try {
          const storageRef = firebase.storage().ref();

          // Ruta específica para la imagen del producto
          const fileRef = storageRef.child(`products/${productName}/${file.name}`);

          // Subir la nueva imagen
          const snapshot = await fileRef.put(file);
          const downloadURL = await snapshot.ref.getDownloadURL();

          // Eliminar la imagen anterior si existe
          if (oldImageUrl) {
            const oldFileRef = storageRef.storage.refFromURL(oldImageUrl);
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
          const imageUrls = [];

          // Subir todas las imágenes seleccionadas
          for (const image of product.main_variant_image) {
            const imageRef = storageRef.child(`products/${product.product_name}/${image.name}`);
            const snapshot = await imageRef.put(image);
            const downloadURL = await snapshot.ref.getDownloadURL();
            imageUrls.push(downloadURL);
          }

          // Agregar las URLs de las imágenes al producto
          product.main_variant_image = imageUrls;

          // Crear el documento en Firestore y obtener el ID
          const docRef = await db.collection("Vinos").add(product);
          const productId = docRef.id;

          // Actualizar el producto en Firestore con su ID
          await db.collection("Vinos").doc(productId).update({ id: productId });

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
          const imageUrl = data.image;

          await ref.delete();
          console.log("Documento eliminado correctamente");

          if (imageUrl) {
            const storageRef = firebase.storage().refFromURL(imageUrl);
            await storageRef.delete();
            console.log("Imagen eliminada de Firebase Storage.");
          }

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
