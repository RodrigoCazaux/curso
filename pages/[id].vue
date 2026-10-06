<template>
  <div v-if="!loading && product?.id && !product.archived" class="bg-gradient-to-b from-gray-50 to-white">
    <div class="mx-auto max-w-6xl px-6 md:px-10 py-8 md:py-12">
      <nav aria-label="Breadcrumb" class="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <nuxt-link to="/catalogo" class="text-gray-400 hover:text-gray-600">Vinos</nuxt-link>
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
            :alt="product.product_name || 'Vino Inquieto'"
            class="relative z-10 max-h-[520px] w-auto object-contain drop-shadow-xl"
          />
        </div>

        <div class="space-y-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl md:text-4xl font-bold text-secondary leading-tight uppercase">
                {{ product.product_name }}
              </h1>
              <p class="mt-2 text-3xl text-secondary font-semibold">{{ money(product.variant_price) }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-sm font-medium text-gray-700">Cantidad</label>
            <div class="flex flex-wrap items-center gap-3">
              <InputNumber :value="cantidad" @input="cantidad = $event" />
              <PrimaryButton
                class="h-12 flex items-center"
                :disabled="!available"
                @click="handleAddToCart"
                text="Agregar al carrito"
              />
            </div>
            <p v-if="feedbackMessage" :class="feedbackError ? 'text-rose-700' : 'text-emerald-600'" role="status" class="text-sm">{{ feedbackMessage }}</p>
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
          <p class="text-lg font-semibold text-secondary">{{ money(product.variant_price) }}</p>
        </div>
        <PrimaryButton
          :disabled="!available"
          @click="handleAddToCart"
          text="Agregar"
        />
      </div>
    </div>
  </div>
  <div v-else class="py-16 space-y-4"><p v-if="loading">Cargando vino…</p><template v-else><h1 class="text-2xl">{{ error || 'Este vino no está disponible.' }}</h1><button v-if="error" @click="load" class="text-primary">Reintentar</button><nuxt-link to="/catalogo" class="block">Volver al catálogo</nuxt-link></template></div>
</template>

<script setup>
import eventBus from '@/lib/eventBus';
import InputNumber from '@/components/shared/inputs/InputNumber.vue';
import PrimaryButton from '@/components/shared/PrimaryButton.vue';
import { isAvailable, formatMoney } from '@/lib/wines';
const route = useRoute(); const store = useNuxtApp().$store; const config = useRuntimeConfig().public;
const product = ref(null); const cantidad = ref(1); const loading = ref(true); const error = ref('');
const feedbackMessage = ref(''); const feedbackError = ref(false);
const available = computed(() => isAvailable(product.value));
const mainImage = computed(() => product.value?.main_variant_image?.[0] || '/wine-placeholder.svg');
const money = value => formatMoney(value, config.currency);
let sequence = 0;
async function load() {
  const current = ++sequence; loading.value = true; error.value = ''; product.value = null;
  try { const result = await store.dispatch('fetchProductById', route.params.id); if (current === sequence) product.value = result; }
  catch { if (current === sequence) error.value = 'No se pudo cargar el vino.'; }
  finally { if (current === sequence) loading.value = false; }
}
onMounted(load);
watch(() => route.params.id, () => { cantidad.value = 1; feedbackMessage.value = ''; load(); });
async function handleAddToCart() {
  try { await store.dispatch('addToCart', { product: product.value, quantity: cantidad.value }); feedbackError.value = false; feedbackMessage.value = 'Agregado al pedido'; eventBus.$emit('addToCart'); }
  catch (error) { feedbackError.value = true; feedbackMessage.value = error.message; }
}
useWineSeo(() => product.value?.product_name ? `${product.value.product_name} | Inquieto` : 'Vino | Inquieto', () => product.value?.product_description || 'Descubre nuestros vinos finos uruguayos.', () => product.value);
</script>
