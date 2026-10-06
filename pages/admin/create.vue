<template>
  <div class="space-y-6">
    <h1 class="text-2xl">Nuevo vino</h1>
    <p v-if="loading">Cargando categorías y bodegas…</p>
    <div v-else-if="loadError" role="alert"><p>{{ loadError }}</p><button @click="load">Reintentar</button></div>
    <WineForm v-else :product="product" :categories="categories" :bodegas="bodegas" :busy="saving" :error="error" :currency="$config.public.currency" @save="save" />
  </div>
</template>
<script setup>
definePageMeta({ middleware: 'auth', layout: 'admin' });
</script>
<script>
import { mapState } from 'vuex';
import WineForm from '@/components/admin/WineForm.vue';
export default {
  components: { WineForm },
  data() { return { product: { product_name: '', product_description: '', variant_price: '', product_year: '', product_cantidad: '750 ml', main_variant_image: [], stock: true }, saving: false, loading: true, loadError: '', error: '' }; },
  computed: { ...mapState(['categories', 'bodegas']) },
  mounted() { this.load(); },
  methods: {
    async load() {
      this.loading = true; this.loadError = '';
      try { await Promise.all([this.$store.dispatch('fetchCategories'), this.$store.dispatch('fetchBodegas')]); }
      catch { this.loadError = 'No se pudieron cargar las opciones. Revisa tu conexión e inténtalo otra vez.'; }
      finally { this.loading = false; }
    },
    async save({ product, addedFiles }) {
      if (this.saving) return;
      this.saving = true; this.error = '';
      try { await this.$store.dispatch('addProduct', { ...product, main_variant_image: addedFiles }); await this.$router.push('/admin?created=1'); }
      catch (error) { this.error = error.message || 'No se guardó el vino. Tus datos siguen aquí; vuelve a intentarlo.'; }
      finally { this.saving = false; }
    },
  },
};
</script>
