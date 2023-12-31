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
    const imageRef = storageRef.child(`products/${productData.name}/${productData.main_variant_image.name}`);
    const snapshot = await imageRef.put(productData.main_variant_image);
    const downloadURL = await snapshot.ref.getDownloadURL();
    productData.main_variant_image = downloadURL;

    await db.collection("Vinos").add(productData);

    commit("SET_LOADING", false);
    // Puedes devolver algún valor si es necesario
  },
};

export default {
  state,
  mutations,
  actions,
};
