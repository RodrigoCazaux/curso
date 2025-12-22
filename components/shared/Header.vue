<template>
  <header class="bg-white">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <nuxt-link to="/" class="-m-1.5 p-1.5">
          <img
            class="h-16 w-auto"
            src="@/assets/images/logoInquieto.svg"
            alt="Inquieto"
            width="190"
            height="64"
          />
        </nuxt-link>
      </div>
      <div class="flex lg:hidden">
        <button
          @click="$emit('openMobileMenu')"
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12 uppercase text-xs">
        <nuxt-link
          to="/"
          class="flex items-center gap-x-1 font-semibold leading-6 text-primary text-opacity-60"
        >
          Inicio
        </nuxt-link>
        <nuxt-link
          to="/catalogo"
          class="flex items-center gap-x-1 font-semibold leading-6 text-primary text-opacity-60"
        >
          Productos
        </nuxt-link>
        <nuxt-link
          to="/nosotros"
          class="font-semibold leading-6 text-primary text-opacity-60"
          >Nosotros</nuxt-link
        >
        <!-- <nuxt-link
          to="/contacto"
          class="font-semibold leading-6 text-primary text-opacity-60"
          >Contacto</nuxt-link
        > -->
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <button
          @click="toggleCart"
          class="text-xs uppercase font-semibold leading-6 text-primary text-opacity-60"
        >
          Carrito
        </button>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
  methods: {
    toggleCart() {
      this.$emit("click");
    },
  },
};
</script>

<style></style>
