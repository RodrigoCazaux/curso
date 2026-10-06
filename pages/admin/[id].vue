<template>
  <div class="space-y-6">
    <h1 class="text-2xl">Editar vino</h1>
    <p v-if="loading">Cargando vino…</p>
    <div v-else-if="loadError" role="alert"><p>{{ loadError }}</p><button @click="load">Reintentar</button><nuxt-link to="/admin">Volver al catálogo</nuxt-link></div>
    <template v-else>
      <p v-if="success" role="status" class="rounded-lg bg-emerald-50 p-4 text-emerald-800">{{ success }}</p>
      <WineForm :product="product" :categories="categories" :bodegas="bodegas" :busy="saving" :error="error" :currency="$config.public.currency" @save="save" />
    </template>
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
  data() { return { product: null, loading: true, saving: false, loadError: '', error: '', success: '' }; },
  computed: { ...mapState(['categories', 'bodegas']) },
  mounted() { this.load(); },
  methods: {
    async load() {
      this.loading = true; this.loadError = '';
      try {
        const results = await Promise.all([this.$store.dispatch('fetchProductById', this.$route.params.id), this.$store.dispatch('fetchCategories'), this.$store.dispatch('fetchBodegas')]);
        if (!results[0]) throw new Error('Este vino no existe.');
        this.product = results[0];
      } catch (error) { this.loadError = error.message || 'No se pudo cargar el vino.'; }
      finally { this.loading = false; }
    },
    async save(payload) {
      if (this.saving) return;
      this.saving = true; this.error = ''; this.success = '';
      try {
        const images = await this.$store.dispatch('saveProductImages', payload);
        const saved = this.$store.state.products.find(product => product.id === payload.product.id);
        this.product = { ...saved, main_variant_image: images };
        this.success = 'Vino guardado correctamente.';
      } catch (error) { this.error = error.message || 'No se guardó el vino. Tus cambios siguen aquí.'; }
      finally { this.saving = false; }
    },
  },
};
</script>
