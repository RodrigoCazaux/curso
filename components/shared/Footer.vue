<template>
  <footer class="relative bg-white pt-8 pb-6">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap">
        <div class="w-full lg:w-6/12 px-4">
          <img
            class="h-16 w-auto mb-4"
            src="@/assets/images/logoInquieto.svg"
            alt="Inquieto"
            width="190"
            height="64"
          />
          <p class="w-6/12 text-xs">
            Difundimos la cultura del vino a través de propuestas que eleven el
            placer de beber.
          </p>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="flex flex-wrap items-top mb-6">
            <div class="w-full lg:w-2/12 px-4 ml-auto">
              <span
                class="block uppercase text-primary text-opacity-70 text-xs font-semibold mb-2"
                >Menu</span
              >
              <ul class="list-unstyled text-xs">
                <li>
                  <nuxt-link
                    class="text-gray-800 hover:text-primary text-opacity-70 hover:text-opacity-70 transition-all ease-out duration-300 block pb-2"
                    to="/"
                    >Inicio</nuxt-link
                  >
                </li>
                <li>
                  <nuxt-link
                    class="text-gray-800 hover:text-primary text-opacity-70 hover:text-opacity-70 transition-all ease-out duration-300 block pb-2"
                    to="/catalogo"
                    >Vinos</nuxt-link
                  >
                </li>
                <li>
                  <nuxt-link
                    class="text-gray-800 hover:text-primary text-opacity-70 hover:text-opacity-70 transition-all ease-out duration-300 block pb-2"
                    to="/nosotros"
                    >Nosotros</nuxt-link
                  >
                </li>
                <li>
                  <a
                    class="text-gray-800 hover:text-primary text-opacity-70 hover:text-opacity-70 transition-all ease-out duration-300 block pb-2"
                    href="mailto:inquieto.experiencias@gmail.com"
                    >Contacto</a
                  >
                </li>
              </ul>
            </div>
            <div class="w-full lg:w-4/12 px-4">
              <span
                class="block uppercase text-primary text-opacity-70 text-xs font-semibold mb-2"
                >Contacto</span
              >
              <ul class="list-unstyled text-xs">
                <li>
                  <a
                    class="text-gray-800 hover:text-primary text-opacity-70 hover:text-opacity-70 transition-all ease-out duration-300 block pb-2"
                    href="mailto:inquieto.experiencias@gmail.com"
                    >inquieto.experiencias@gmail.com</a
                  >
                </li>
                <li>
                  <a
                    class="text-gray-800 hover:text-primary text-opacity-70 hover:text-opacity-70 transition-all ease-out duration-300 block pb-2"
                    href="tel:096260462"
                    >096260462</a
                  >
                </li>
                <li>
                  <a
                    class="text-gray-800 hover:text-primary text-opacity-70 hover:text-opacity-70 transition-all ease-out duration-300 block pb-2"
                    href="https://www.instagram.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                    >Instagram</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <hr class="my-6 border-primary border-opacity-30" />
      <div
        class="flex flex-wrap items-center md:justify-between justify-center"
      >
        <div class="w-full md:w-4/12 px-4 mx-auto text-center">
          <div class="text-xs text-gray-600 py-1">
            Diseño y desarrollo by:
            <a
              href="https://www.creative-tim.com"
              class="text-gray-600 hover:secondary"
              >Index webs Creative team</a
            >.
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style></style>
