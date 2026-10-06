<template>
  <div class="w-full">
    <p v-if="loading" role="status">Cargando vinos…</p>
    <p v-else-if="error" role="alert">{{ error }} <nuxt-link to="/catalogo">Ver catálogo</nuxt-link></p>
    <div v-else class="grid grid-cols-12 gap-x-8 gap-y-4 py-10">
      <ProductCard v-for="product in products" :key="product.id" :name="product.product_name" :category="product.product_categories" :image="product.main_variant_image" :slug="product.id" :price="product.variant_price" />
    </div>
  </div>
</template>
<script setup>
import ProductCard from '@/components/shared/ProductCard.vue';
import { isAvailable } from '@/lib/wines';
const store = useNuxtApp().$store;
const loading = ref(true); const error = ref('');
const products = computed(() => store.state.products.filter(isAvailable).slice(0, 4));
onMounted(async () => { try { await store.dispatch('fetchProducts'); } catch { error.value = 'No pudimos cargar los vinos.'; } finally { loading.value = false; } });
</script>
