<template>
  <div class="bg-secondary h-screen w-8/12 fixed top-0 left-0 z-50 px-10 py-6">
    <nuxt-link to="/" class="-m-1.5 p-1.5 mb-16">
      <img
        class="h-14 w-auto"
        src="https://firebasestorage.googleapis.com/v0/b/curso-aa826.appspot.com/o/inquietoIcon.png?alt=media&token=b4b3047b-c061-4937-be49-13203f662918"
        alt=""
      />
    </nuxt-link>
    <ul class="flex flex-col space-y-8 text-gray-200">
      <li>
        <button
          @click="navegation('/')"
          to="/"
          class="flex items-center space-x-2 text-lg gap-x-1 font-semibold leading-6 text-opacity-60"
        >
          <HomeIcon class="h-5 w-5" />
          <span>Inicio</span>
        </button>
      </li>
      <li>
        <button
          @click="navegation('catalogo')"
          class="flex items-center space-x-2 text-lg gap-x-1 font-semibold leading-6 text-opacity-60"
        >
          <BookIcon class="h-5 w-5" />
          <span>Productos</span>
        </button>
      </li>
      <li>
        <button
          @click="navegation('nosotros')"
          class="flex items-center space-x-2 text-lg font-semibold leading-6 text-opacity-60"
        >
          <UsersIcon class="h-5 w-5" />
          <span>Nosotros</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import HomeIcon from "~/components/shared/icons/HomeIcon.vue";
import BookIcon from "~/components/shared/icons/BookIcon.vue";
import UsersIcon from "~/components/shared/icons/UsersIcon.vue";

export default {
  components: { HomeIcon, BookIcon, UsersIcon },
  methods: {
    navegation(route) {
      this.$emit("openMobileMenu");
      this.$router.push(route);
    },
  },
};
</script>

<style></style>
