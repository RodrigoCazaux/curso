<template>
  <form @submit.prevent="submit" class="space-y-6 max-w-4xl">
    <p v-if="error" role="alert" class="rounded-lg bg-rose-50 border border-rose-200 p-4 text-rose-800">{{ error }}</p>
    <fieldset :disabled="busy" class="grid gap-5 sm:grid-cols-2 disabled:opacity-70">
      <label class="field sm:col-span-2">Nombre del vino
        <input v-model.trim="draft.product_name" required maxlength="200" autocomplete="off" />
      </label>
      <div class="field"><label for="wine-bodega">Bodega</label>
        <select id="wine-bodega" v-model="draft.bodega_id" required><option value="" disabled>Selecciona una bodega</option><option v-for="item in bodegas" :key="item.id" :value="item.id">{{ item.name }}</option></select>
      </div>
      <div class="field"><label for="wine-category">Categoría</label>
        <select id="wine-category" v-model="draft.category_id" required><option value="" disabled>Selecciona una categoría</option><option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option></select>
      </div>
      <label class="field">Añada (opcional)
        <input v-model="draft.product_year" type="number" min="1900" :max="new Date().getFullYear() + 1" step="1" placeholder="Ej. 2024" />
      </label>
      <label class="field">Volumen de la botella
        <input v-model.trim="draft.product_cantidad" maxlength="100" placeholder="Ej. 750 ml" />
      </label>
      <label class="field">Precio ({{ currency }})
        <input v-model.number="draft.variant_price" type="number" min="0" max="100000000" step="0.01" required inputmode="decimal" />
      </label>
      <label class="field">Unidades disponibles (opcional)
        <input v-model="draft.inventory_units" type="number" min="0" max="1000000" step="1" placeholder="Vacío: sin control de unidades" />
      </label>
      <label class="flex items-center gap-3 text-sm text-gray-900"><input type="checkbox" v-model="draft.stock" /> Disponible para pedidos</label>
      <p class="text-sm">Las unidades son orientativas. Los pedidos por WhatsApp no descuentan existencias automáticamente.</p>
      <label class="field sm:col-span-2">Notas de cata y descripción
        <textarea v-model.trim="draft.product_description" rows="5" maxlength="10000" />
      </label>
      <div class="sm:col-span-2 space-y-3">
        <h2 class="text-lg">Fotos del vino</h2>
        <p class="text-sm">Hasta 8 fotos JPG, PNG o WebP, de máximo 5 MB cada una.</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="(url, index) in draft.main_variant_image" :key="url" class="space-y-2">
            <img :src="replacementPreviews[index] || url" :alt="`Foto ${index + 1} del vino`" class="h-40 w-full object-contain rounded-lg bg-white border" />
            <label class="text-sm text-primary cursor-pointer">Reemplazar foto {{ index + 1 }}<input type="file" accept="image/jpeg,image/png,image/webp" class="block w-full text-xs" @change="replaceImage($event, index)" /></label>
          </div>
          <div v-for="(url, index) in addedPreviews" :key="url" class="space-y-2">
            <img :src="url" alt="Nueva foto del vino" class="h-40 w-full object-contain rounded-lg bg-white border" />
            <button type="button" class="text-sm text-rose-700" @click="removeAdded(index)">Quitar foto nueva</button>
          </div>
        </div>
        <label class="field">Añadir fotos<input type="file" multiple accept="image/jpeg,image/png,image/webp" @change="addImages" /></label>
        <p v-if="imageError" role="alert" class="text-rose-700">{{ imageError }}</p>
      </div>
    </fieldset>
    <div class="flex flex-wrap gap-3">
      <button type="submit" :disabled="busy || !!imageError" class="rounded-lg bg-secondary text-white px-6 py-3 disabled:opacity-50">{{ busy ? 'Guardando…' : 'Guardar vino' }}</button>
      <nuxt-link to="/admin" class="rounded-lg border border-gray-300 px-6 py-3" :aria-disabled="busy" @click="busy && $event.preventDefault()">Volver al catálogo</nuxt-link>
    </div>
  </form>
</template>
<script>
import { validateImage, MAX_IMAGES, numericPrice } from '@/lib/wines';
export default {
  props: { product: { type: Object, required: true }, categories: { type: Array, required: true }, bodegas: { type: Array, required: true }, busy: Boolean, error: String, currency: { type: String, default: 'UYU' } },
  emits: ['save'],
  data() { return { draft: {}, replacements: {}, replacementPreviews: {}, addedFiles: [], addedPreviews: [], imageError: '' }; },
  watch: { product: { immediate: true, handler(product) {
    this.releasePreviews();
    let price = '';
    try { if (product.variant_price !== '' && product.variant_price != null) price = numericPrice(product.variant_price); } catch { /* Invalid legacy prices must remain editable. */ }
    this.draft = { ...product, variant_price: price, main_variant_image: [...(Array.isArray(product.main_variant_image) ? product.main_variant_image : product.main_variant_image ? [product.main_variant_image] : [])], category_id: product.category_id || this.categories.find(item => item.name === product.product_categories)?.id || '', bodega_id: product.bodega_id || this.bodegas.find(item => item.name === product.product_bodega)?.id || '', inventory_units: product.inventory_units ?? '' };
    this.replacements = {}; this.replacementPreviews = {}; this.addedFiles = []; this.addedPreviews = []; this.imageError = '';
  } } },
  beforeUnmount() { this.releasePreviews(); },
  methods: {
    releasePreviews() { [...Object.values(this.replacementPreviews || {}), ...(this.addedPreviews || [])].forEach(url => URL.revokeObjectURL(url)); },
    replaceImage(event, index) {
      const file = event.target.files?.[0]; if (!file) return;
      try { validateImage(file); if (this.replacementPreviews[index]) URL.revokeObjectURL(this.replacementPreviews[index]); this.replacements[index] = file; this.replacementPreviews[index] = URL.createObjectURL(file); this.imageError = ''; }
      catch (error) { this.imageError = error.message; }
      event.target.value = '';
    },
    addImages(event) {
      const files = Array.from(event.target.files || []);
      try {
        if (this.draft.main_variant_image.length + this.addedFiles.length + files.length > MAX_IMAGES) throw new Error('Puedes añadir hasta 8 fotos.');
        files.forEach(validateImage); this.addedFiles.push(...files); this.addedPreviews.push(...files.map(file => URL.createObjectURL(file))); this.imageError = '';
      } catch (error) { this.imageError = error.message; }
      event.target.value = '';
    },
    removeAdded(index) { URL.revokeObjectURL(this.addedPreviews[index]); this.addedPreviews.splice(index, 1); this.addedFiles.splice(index, 1); this.imageError = ''; },
    submit() {
      if (this.busy) return;
      this.$emit('save', { product: { ...this.draft }, changes: Object.entries(this.replacements).map(([index, file]) => ({ index: Number(index), file })), addedFiles: [...this.addedFiles] });
    },
  },
};
</script>
<style scoped>
.field { @apply flex flex-col gap-2 text-sm font-medium text-gray-900; }
.field input, .field select, .field textarea { @apply w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-secondary; }
</style>
