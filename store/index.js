import Vuex from 'vuex';

const store = () => {
  return new Vuex.Store({
    state: {
      cart: {
        items: [
        ],
      },
    },
    mutations: {
      addItem(state, payload) {
        // Agregamos un item al carrito
        state.cart.items.push(payload);
      },
      removeItem(state, payload) {
        // Removemos un item del carrito
        const index = state.cart.items.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          state.cart.items.splice(index, 1);
        }
      },
    },
  });
};

export default store;
