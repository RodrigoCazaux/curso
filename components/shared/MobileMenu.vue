<template>
  <nav
    class="bg-secondary flex flex-col h-screen w-8/12 fixed top-0 left-0 z-50 px-10 py-6"
    aria-label="Menú móvil"
  >
    <nuxt-link to="/" class="-m-1.5 p-1.5" @click.native="closeMenu">
      <img
        class="h-12 w-auto mb-10"
        src="@/assets/images/isotipoInquieto.svg"
        alt="Inquieto"
      />
    </nuxt-link>
    <ul class="flex flex-col space-y-8 text-gray-200">
      <li>
        <nuxt-link
          to="/"
          @click.native="closeMenu"
          class="flex items-center space-x-2 text-lg gap-x-1 font-semibold leading-6 text-opacity-60"
        >
          <HomeIcon class="h-5 w-5" />
          <span>Inicio</span>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          to="/catalogo"
          @click.native="closeMenu"
          class="flex items-center space-x-2 text-lg gap-x-1 font-semibold leading-6 text-opacity-60"
        >
          <BookIcon class="h-5 w-5" />
          <span>Productos</span>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          to="/nosotros"
          @click.native="closeMenu"
          class="flex items-center space-x-2 text-lg font-semibold leading-6 text-opacity-60"
        >
          <UsersIcon class="h-5 w-5" />
          <span>Nosotros</span>
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import HomeIcon from "~/components/shared/icons/HomeIcon.vue";
import BookIcon from "~/components/shared/icons/BookIcon.vue";
import UsersIcon from "~/components/shared/icons/UsersIcon.vue";

export default {
  components: { HomeIcon, BookIcon, UsersIcon },
  methods: {
    closeMenu() {
      this.$emit("openMobileMenu");
    },
  },
};
</script>

<style></style>
