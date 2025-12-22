<template>
  <div class="bg-gradient-to-b from-gray-50 to-white">
    <div class="mx-auto max-w-6xl px-6 md:px-10 py-8 md:py-12">
      <nav aria-label="Breadcrumb" class="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <span class="text-gray-400">Vinos</span>
        <span class="text-gray-300">/</span>
        <span class="text-gray-500">{{ product.product_categories || 'Selección' }}</span>
        <span class="text-gray-300">/</span>
        <span class="text-gray-900 font-medium truncate">{{ product.product_name || 'Producto' }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div class="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center">
          <div class="absolute inset-x-6 top-6 h-24 bg-gradient-to-b from-gray-100 to-transparent rounded-xl blur-xl opacity-60"></div>
          <img
            :src="mainImage"
            alt="Botella de vino"
            class="relative z-10 max-h-[520px] w-auto object-contain drop-shadow-xl"
          />
        </div>

        <div class="space-y-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl md:text-4xl font-bold text-secondary leading-tight uppercase">
                {{ product.product_name }}
              </h1>
              <p class="mt-2 text-3xl text-secondary font-semibold">${{ product.variant_price }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-sm font-medium text-gray-700">Cantidad</label>
            <div class="flex flex-wrap items-center gap-3">
              <InputNumber :value="cantidad" @input="updaeValue" />
              <PrimaryButton
                class="h-12 flex items-center"
                :disabled="!product.stock"
                @click="handleAddToCart"
                text="Agregar al carrito"
              />
            </div>
            <p v-if="feedbackMessage" class="text-sm text-emerald-600">{{ feedbackMessage }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p class="text-xs uppercase tracking-wide text-gray-500">Bodega</p>
              <p class="text-base text-gray-900 font-medium mt-1">
                {{ product.product_bodega || '-' }}
              </p>
            </div>
            <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p class="text-xs uppercase tracking-wide text-gray-500">Año</p>
              <p class="text-base text-gray-900 font-medium mt-1">
                {{ product.product_year || '-' }}
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Detalles</h3>
            <p class="mt-3 text-gray-600 leading-7" v-if="product.product_description">
              {{ product.product_description }}
            </p>
            <p class="mt-3 text-gray-400" v-else>
              Pronto sumaremos las notas de cata y maridaje de este vino.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA móvil fija -->
    <div class="fixed bottom-0 inset-x-0 z-30 bg-white/90 border-t border-gray-200 px-4 py-3 backdrop-blur md:hidden">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-gray-500">Total</p>
          <p class="text-lg font-semibold text-secondary">${{ product.variant_price }}</p>
        </div>
        <PrimaryButton
          :disabled="!product.stock"
          @click="handleAddToCart"
          text="Agregar"
        />
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from "@/plugins/eventBus";
import InputNumber from "@/components/shared/inputs/InputNumber.vue";
import PrimaryButton from "~/components/shared/PrimaryButton.vue";

export default {
  async fetch({ store, params }) {
    await store.dispatch("fetchProductById", params.id);
  },

  data() {
    return {
      cantidad: 1,
      feedbackMessage: "",
      feedbackTimeout: null,
    };
  },

  components: { InputNumber, PrimaryButton },
  
  computed: {
    product() {
      return this.$store.state.product;
    },
    mainImage() {
      const images = Array.isArray(this.product.main_variant_image)
        ? this.product.main_variant_image
        : this.product.main_variant_image
        ? [this.product.main_variant_image]
        : [];
      return images[0] || "https://via.placeholder.com/600x800?text=Sin+imagen";
    },
  },

  methods: {
    updaeValue(newOne) {
      this.cantidad = newOne;
    },
    handleAddToCart() {
      this.$store.dispatch("addToCart", {
        product: this.product,
        quantity: this.cantidad,
      });
      eventBus.$emit("addToCart");
      this.showFeedback("Agregado al carrito");
    },
    showFeedback(message) {
      if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
      this.feedbackMessage = message;
      this.feedbackTimeout = setTimeout(() => {
        this.feedbackMessage = "";
        this.feedbackTimeout = null;
      }, 2500);
    },
  },
};
</script>

<style></style>
