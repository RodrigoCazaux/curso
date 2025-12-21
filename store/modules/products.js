// store/modules/products.js

import { db, firebase } from "@/plugins/firebase";

const state = {
  loading: false,
};

const mutations = {
  SET_LOADING(state, value) {
    state.loading = value;
  },
};

const actions = {
  async createProduct({ commit }, productData) {
    commit("SET_LOADING", true);

    const storageRef = firebase.storage().ref();
    const { main_variant_image, ...productPayload } = productData || {};
    const docRef = await db.collection("Vinos").add({
      ...productPayload,
      stock:
        typeof productPayload?.stock === "boolean"
          ? productPayload.stock
          : Boolean(productPayload?.stock),
      main_variant_image: [],
    });
    const productId = docRef.id;

    if (main_variant_image) {
      const imageRef = storageRef.child(`products/${productId}/${main_variant_image.name}`);
      const snapshot = await imageRef.put(main_variant_image);
      const downloadURL = await snapshot.ref.getDownloadURL();
      await docRef.update({ id: productId, main_variant_image: [downloadURL] });
    } else {
      await docRef.update({ id: productId });
    }

    commit("SET_LOADING", false);
    // Puedes devolver algún valor si es necesario
  },
};

export default {
  state,
  mutations,
  actions,
};
