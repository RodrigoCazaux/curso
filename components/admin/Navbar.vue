<template>
  <header class="bg-white border-b sticky top-0 z-30">
    <nav class="mx-auto max-w-7xl px-4 sm:px-8 py-4 flex flex-wrap items-center gap-4" aria-label="Administración">
      <nuxt-link to="/admin" class="font-bold text-primary">Inquieto</nuxt-link>
      <nuxt-link to="/admin">Vinos</nuxt-link>
      <nuxt-link to="/admin/categories">Categorías</nuxt-link>
      <nuxt-link to="/admin/bodegas">Bodegas</nuxt-link>
      <nuxt-link to="/admin/backup">Respaldo</nuxt-link>
      <nuxt-link to="/catalogo">Ver tienda</nuxt-link>
      <button type="button" class="sm:ml-auto text-rose-700" :disabled="busy" @click="logOut">{{ busy ? 'Saliendo…' : 'Cerrar sesión' }}</button>
      <span v-if="error" role="alert" class="text-rose-700">{{ error }}</span>
    </nav>
  </header>
</template>
<script>
import { firebase } from '@/lib/firebase';
export default {
  data() { return { busy: false, error: '' }; },
  methods: { async logOut() { this.busy = true; this.error = ''; try { await firebase.auth().signOut(); await this.$router.push('/'); } catch { this.error = 'No se pudo cerrar sesión.'; } finally { this.busy = false; } } },
};
</script>
