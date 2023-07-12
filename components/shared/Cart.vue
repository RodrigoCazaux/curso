<template>
  <section
    v-if="showCart"
    class="fixed flex justify-end w-full min-h-screen bg-secondary z-10 top-0 bg-opacity-40"
  >
    <div
      class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl min-h-screen"
    >
      <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div class="flex items-start justify-between">
          <h4 id="slide-over-title">Tu pedido</h4>
          <div class="ml-3 flex h-7 items-center">
            <button
              @click="close"
              type="button"
              class="-m-2 p-2 text-gray-400 hover:text-gray-500"
            >
              <span @click="close" class="sr-only">Close panel</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="mt-8">
          <div class="flow-root">
            <ul role="list" class="-my-6 divide-y divide-gray-200">
              <li v-for="item in items" :key="item.id" class="flex py-6">
                <div
                  class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
                >
                  <img
                    :src="item.image"
                    alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                    class="h-full w-full object-cover object-center"
                  />
                </div>

                <div class="ml-4 flex flex-1 flex-col">
                  <div>
                    <h4 class="max-w-xs mb-1">
                      <a href="#">{{ item.name }}</a>
                    </h4>
                    <h4 class="max-w-lg truncate mb-3">UYU {{ item.price }}</h4>
                    <p class="text-sm text-gray-500">{{ item.category }}</p>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <p class="text-gray-500">Cantidad: {{ item.qty }}</p>

                    <div class="flex">
                      <button
                        @click="removeFromCart(item)"
                        type="button"
                        class="font-medium text-primary text-opacity-70 hover:text-opacity-50 transition-all duration-300 ease-in-out"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div class="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${{ total }}</p>
        </div>
        <p class="mt-0.5 text-sm text-gray-500">
          Envío e impuestos calculados al finalizar la compra.
        </p>
        <div class="mt-6">
          <PrimaryButton @click="enviarOrden" text="Enviar Por Whatsapp" />
        </div>
        <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            o
            <button
              type="button"
              class="font-medium text-primary text-opacity-70 hover:text-opacity-50 transition-all duration-300 ease-in-out"
            >
              Seguir comprando
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import PrimaryButton from "./PrimaryButton.vue";

export default {
  props: {
    showCart: { type: Boolean },
  },
  components: { PrimaryButton },
  computed: {
    items() {
      // Obtenemos los items del carrito desde el store
      return this.$store.state.cart.items;
    },
    total() {
      // Calculamos el total de los items en el carrito
      return this.items.reduce((acc, item) => acc + item.price, 0);
    },
  },
  methods: {
    close() {
      this.$emit("click");
    },
    enviarOrden() {
      var number = +59896260462;
      var pedido = "";
      var total = 12;
      const itemsLength = this.items.length;
      for (let i = 0; i < itemsLength; i++) {
        const item = this.items[i];
        pedido = pedido + "x"+item.qty+' '+ item.name +' || ';
        console.log(item.name + item.qty);
      }
      window.open(
        `https://api.whatsapp.com/send?phone=${number}&text=%20${pedido}. **SUBTOTAL:${total}**`
      );
    },
    removeFromCart(item) {
      const index = this.$store.state.cart.items.findIndex(
        (cartItem) => cartItem.id === item.id
      );
      if (index !== -1) {
        this.$store.commit("removeItem", item);
      }
    },
  },
};
</script>

<style></style>
