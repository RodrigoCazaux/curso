<template>
    <header class="bg-white absolute left-0 top-0 w-full">
      <nav
        class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div class="flex lg:flex-1">
          <nuxt-link to="/" class="-m-1.5 p-1.5">
            <img
              class="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
          </nuxt-link>
        </div>
        <div class="flex lg:hidden">
          <button
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
            to="/admin"
            exact
            class="flex items-center gap-x-1 font-semibold leading-6 text-gray-500 hover:text-gray-900 transition"
            exact-active-class="text-secondary"
          >
            Dashboard
          </nuxt-link>
          <nuxt-link
            to="/admin"
            class="flex items-center gap-x-1 font-semibold leading-6 text-gray-500 hover:text-gray-900 transition"
            exact-active-class="text-secondary"
          >
            Productos
          </nuxt-link>
          <nuxt-link
            to="/admin/categories"
            class="flex items-center gap-x-1 font-semibold leading-6 text-gray-500 hover:text-gray-900 transition"
            exact-active-class="text-secondary"
          >
            Categorías
          </nuxt-link>
          <nuxt-link
            to="/admin/create"
            class="font-semibold leading-6 text-gray-500 hover:text-gray-900 transition"
            exact-active-class="text-secondary"
            >Crear</nuxt-link
          >
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            @click="logOut"
            class="flex items-center space-x-2 text-xs uppercase font-semibold leading-6 text-gray-900"
          >
          <LogOutIcon class="w-4 h-4 mr-2"/>
            Log Out
          </button>
        </div>
      </nav>
      <!-- Mobile menu, show/hide based on menu open state. -->
      <div class="lg:hidden" role="dialog" aria-modal="true">
        <!-- Background backdrop, show/hide based on slide-over state. -->
        <div class="fixed inset-0 z-10"></div>
        <div
          class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
        >
          <div class="flex items-center justify-between">
            <a href="#" class="-m-1.5 p-1.5">
              <span class="sr-only">Your Company</span>
              <img
                class="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
              <span class="sr-only">Close menu</span>
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <nuxt-link
                  to="/admin"
                  exact
                  class="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
                  exact-active-class="text-secondary"
                  >Dashboard</nuxt-link
                >
                <nuxt-link
                  to="/admin"
                  class="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
                  exact-active-class="text-secondary"
                  >Productos</nuxt-link
                >
                <nuxt-link
                  to="/admin/categories"
                  class="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
                  exact-active-class="text-secondary"
                  >Categorías</nuxt-link
                >
                <nuxt-link
                  to="/admin/create"
                  class="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
                  exact-active-class="text-secondary"
                  >Crear</nuxt-link
                >
              </div>
              <div class="py-6">
                <button
                  @click="logOut"
                  href="/login"
                  class="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  import { firebase } from "@/plugins/firebase";
import LogOutIcon from '../shared/icons/LogOutIcon.vue';
  export default {
  components: { LogOutIcon },
    name: "Header",
    methods: {
      logOut() {
        firebase.auth().signOut();
        this.$router.push("/");
      },
    },
  };
  </script>
  
  <style></style>
  
