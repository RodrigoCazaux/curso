<template>
  <main class="min-h-screen bg-background px-4 flex items-center justify-center">
    <section class="max-w-md w-full rounded-2xl bg-white p-6 sm:p-10 shadow-lg space-y-6">
      <nuxt-link to="/" class="text-primary font-bold text-xl">Inquieto</nuxt-link>
      <h1 class="text-2xl">Gestionar los vinos</h1>
      <p v-if="message" :role="isError ? 'alert' : 'status'" :class="isError ? 'text-rose-700' : 'text-emerald-700'">{{ message }}</p>
      <form @submit.prevent="login" class="space-y-5">
        <label class="block text-sm text-gray-900">Correo electrónico<input v-model.trim="email" type="email" required autocomplete="username" class="block w-full rounded-lg border p-3 mt-2" /></label>
        <label class="block text-sm text-gray-900">Contraseña<input v-model="password" type="password" required autocomplete="current-password" class="block w-full rounded-lg border p-3 mt-2" /></label>
        <button :disabled="busy" class="w-full rounded-lg bg-secondary text-white py-3 disabled:opacity-50">{{ busy ? 'Ingresando…' : 'Entrar' }}</button>
      </form>
      <button type="button" :disabled="busy" @click="resetPassword" class="text-primary text-sm">Olvidé mi contraseña</button>
    </section>
  </main>
</template>
<script setup>
definePageMeta({ layout: 'auth' });
</script>
<script>
import { firebase } from '@/lib/firebase';
export default {
  data() { return { email: '', password: '', busy: false, message: '', isError: false }; },
  mounted() {
    if (this.$route.query.reason) { this.isError = true; this.message = 'No se pudo verificar el acceso. Revisa tu conexión.'; }
  },
  methods: {
    async login() {
      if (this.busy) return;
      this.busy = true; this.message = '';
      try {
        const auth = firebase.auth(); await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        await auth.signInWithEmailAndPassword(this.email, this.password);
        this.password = ''; await this.$router.push('/admin');
      } catch (error) {
        this.isError = true;
        this.message = error.code === 'auth/too-many-requests' ? 'Hubo demasiados intentos. Espera unos minutos.' : error.code === 'auth/network-request-failed' ? 'No hay conexión. Inténtalo otra vez.' : 'No pudimos iniciar sesión. Revisa el correo y la contraseña o recupera tu acceso.';
      } finally { this.busy = false; }
    },
    async resetPassword() {
      if (this.busy) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) { this.isError = true; this.message = 'Escribe tu correo electrónico para recuperar la contraseña.'; return; }
      this.busy = true; this.message = '';
      try { await firebase.auth().sendPasswordResetEmail(this.email); this.isError = false; this.message = 'Si el correo tiene una cuenta, recibirás un enlace para restablecer la contraseña.'; }
      catch (error) { this.isError = error.code !== 'auth/user-not-found'; this.message = this.isError ? 'No se pudo enviar la solicitud. Revisa tu conexión e inténtalo otra vez.' : 'Si el correo tiene una cuenta, recibirás un enlace para restablecer la contraseña.'; }
      finally { this.busy = false; }
    },
  },
};
</script>
