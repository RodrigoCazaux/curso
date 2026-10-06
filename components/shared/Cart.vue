<template>
  <section v-if="showCart" class="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40" role="dialog" aria-modal="true" aria-labelledby="cart-title" @keydown.esc="close" @click.self="close">
    <div class="w-full max-w-md flex flex-col bg-white shadow-xl h-full p-5 overflow-y-auto" ref="panel" tabindex="-1">
      <div class="flex justify-between items-center mb-6"><h2 id="cart-title" class="text-xl">Tu pedido</h2><button @click="close" aria-label="Cerrar pedido">✕</button></div>
      <p v-if="!items.length">Todavía no añadiste vinos.</p>
      <ul class="divide-y flex-1">
        <li v-for="item in items" :key="item.id" class="py-4 flex gap-4">
          <img :src="item.image" :alt="item.name" class="w-20 h-28 object-contain" />
          <div class="flex-1 space-y-2"><nuxt-link :to="`/${item.id}`" @click="close">{{ item.name }}</nuxt-link><p>{{ money(item.unitPrice * item.qty) }}</p>
            <label class="block text-sm">Botellas <input type="number" min="1" step="1" :max="item.maxQty || 1000000" :value="item.qty" class="w-20 border rounded p-2" @change="setQuantity(item, $event)" /></label>
            <button @click="$store.commit('removeItem', item)" class="text-sm text-rose-700">Quitar</button>
          </div>
        </li>
      </ul>
      <div class="border-t pt-5 space-y-4"><p class="font-semibold text-gray-900">Subtotal: {{ money(total) }}</p><p class="text-sm">Confirmaremos disponibilidad y envío por WhatsApp.</p>
        <p v-if="error" role="alert" class="text-rose-700">{{ error }}</p>
        <button @click="send" :disabled="busy || !items.length" class="w-full rounded-lg bg-secondary text-white p-3 disabled:opacity-50">{{ busy ? 'Verificando pedido…' : 'Enviar por WhatsApp' }}</button>
        <nuxt-link to="/catalogo" @click="close" class="block text-center text-primary">Seguir comprando</nuxt-link>
      </div>
    </div>
  </section>
</template>
<script>
import { formatMoney } from '@/lib/wines';
export default {
  props: { showCart: Boolean }, emits: ['click'],
  data() { return { busy: false, error: '' }; },
  computed: { items() { return this.$store.getters.cartItems; }, total() { return this.$store.getters.cartTotal; } },
  watch: { showCart(value) { if (value) this.$nextTick(() => this.$refs.panel?.focus()); } },
  methods: {
    money(value) { return formatMoney(value, this.$config.public.currency); },
    close() { this.$emit('click'); },
    setQuantity(item, event) {
      const qty = Number(event.target.value);
      if (!Number.isSafeInteger(qty) || qty < 1 || qty > 1000000 || (item.maxQty && qty > item.maxQty)) { this.error = 'Revisa la cantidad de botellas.'; event.target.value = item.qty; return; }
      this.error = ''; this.$store.commit('setCartQuantity', { id: item.id, qty });
    },
    async send() {
      if (this.busy) return;
      // Open synchronously so the browser does not block the window after the live check.
      const popup = window.open('about:blank', '_blank');
      if (popup) popup.opener = null;
      this.busy = true; this.error = '';
      try { const url = await this.$store.dispatch('enviarOrden'); if (popup) popup.location.href = url; else window.location.assign(url); }
      catch (error) { popup?.close(); this.error = error.message || 'No se pudo verificar el pedido. Revisa tu conexión.'; }
      finally { this.busy = false; }
    },
  },
};
</script>
