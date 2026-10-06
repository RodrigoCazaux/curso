<template>
  <div class="pb-8">
    <section class="flex flex-col justify-center px-8 md:px-32 h-72 bg-secondary -mx-10 md:-mx-32 -mt-16 mb-8 banner">
      <h1 class="text-white">Nuestros vinos</h1><p class="text-gray-200">Vinos finos uruguayos para disfrutar y compartir.</p>
    </section>
    <section class="-mt-20 relative">
      <CatalogFilters :categories="categories" :bodegas="bodegas" @filters-change="filters = { ...filters, ...$event }" />
      <p v-if="loading" role="status">Cargando vinos…</p>
      <div v-else-if="error" role="alert"><p class="text-rose-700">{{ error }}</p><button @click="load" class="text-primary underline">Reintentar</button></div>
      <p v-else-if="!filteredProducts.length">No encontramos vinos con esos filtros.</p>
      <Catalog v-else :products="filteredProducts" />
    </section>
  </div>
</template>
<script setup>
import CatalogFilters from '~/components/catalog/Categories.vue';
import Catalog from '~/components/home/Catalog.vue';
import { isAvailable } from '@/lib/wines';
const store = useNuxtApp().$store;
const filters = ref({ search: '', category: '', bodega: '' });
const loading = ref(true); const error = ref('');
const products = computed(() => store.state.products.filter(isAvailable));
const categories = computed(() => [...new Set(products.value.flatMap(product => Array.isArray(product.product_categories) ? product.product_categories : [product.product_categories]).filter(Boolean))].sort());
const bodegas = computed(() => [...new Set(products.value.map(product => product.product_bodega).filter(Boolean))].sort());
const filteredProducts = computed(() => products.value.filter(product => {
  const search = filters.value.search.toLocaleLowerCase();
  const category = Array.isArray(product.product_categories) ? product.product_categories : [product.product_categories];
  return (!filters.value.category || category.includes(filters.value.category)) && (!filters.value.bodega || product.product_bodega === filters.value.bodega) && (!search || [product.product_name, product.product_description, product.product_bodega].some(value => String(value || '').toLocaleLowerCase().includes(search)));
}));
async function load() { loading.value = true; error.value = ''; try { await store.dispatch('fetchProducts'); } catch { error.value = 'No pudimos cargar el catálogo. Revisa tu conexión.'; } finally { loading.value = false; } }
onMounted(load);
useWineSeo('Catálogo de vinos | Inquieto', 'Explora nuestra selección de vinos finos uruguayos por categoría y bodega.');
</script>
<style scoped>
.banner { background: linear-gradient(90deg, rgba(20,30,45,.9), rgba(20,30,45,.5)), url('@/assets/images/bannerInquietos.jpg') center / cover; }
</style>
