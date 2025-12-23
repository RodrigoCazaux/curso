<template>
  <div>
    <Hero />
    <section class="mb-24">
      <div class="container mx-auto pr-4 bg-gray-100 p-8 shadow-xl rounded-lg">
        <div class="items-center flex flex-row-reverse flex-wrap">
          <div class="w-full md:w-5/12 ml-auto pr-12 md:px-4">
            <div class="md:pr-12">
              <h3>SOBRE NOSOTROS</h3>
              <p class="mt-4 leading-relaxed text-blueGray-500 mb-4">
                Difundimos la cultura del vino a través de propuestas que eleven
                el placer de beber. Catas, maridajes, charlas, presentación de
                vinos y bodegas, son algunos de los caminos para generar el
                encuentro con el vino y nuestros clientes.
              </p>
              <PrimaryButton @click="$router.push('/nosotros')" text="Leer Más" />
            </div>
          </div>

          <div class="w-full md:w-6/12 h-96 mr-auto pr-4 pt-24 md:pt-0 hidden md:flex">
            <img
              alt="..."
              class="w-full h-full object-cover rounded-l-lg shadow-xl"
              src="@/assets/images/SantiagoCazaux.jpg"
            />
          </div>
        </div>
      </div>
    </section>
    <section
      class="flex flex-col justify-center items-center text-center relative py-10"
    >
      <h2>AlGUNOS DE NUESTROS VINOS</h2>
      <p class="leading-relaxed text-blueGray-500 z-10">
        Difundimos la cultura del vino a través de propuestas que eleven el
        placer de beber. Catas, maridajes, charlas, presentación de vinos y
        bodegas, son algunos de los caminos para generar el encuentro con el
        vino y nuestros clientes.
      </p>
      <UsProducts />
      <SecondaryButton @click="$router.push('/catalogo')" />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Hero from "~/components/home/Hero.vue";
import UsProducts from "~/components/home/UsProducts.vue";
import PrimaryButton from "~/components/shared/PrimaryButton.vue";
import SecondaryButton from "~/components/shared/SecondaryButton.vue";

export default Vue.extend({
  name: "IndexPage",
  components: {
    UsProducts,
    Hero,
    SecondaryButton,
    PrimaryButton,
  },
  head(): Record<string, any> {
    const baseUrl: string = process.env.SITE_URL || "https://inquieto.com";
    const path = (this.$route && this.$route.path) || "/";
    const url = `${baseUrl}${path}`;
    const title = "Inquieto | Experiencias de vino y catas en Uruguay";
    const description =
      "Catas, maridajes y vinos seleccionados para disfrutar y aprender sobre el vino en Uruguay.";

    return {
      title,
      meta: [
        { hid: "description", name: "description", content: description },
        { hid: "og:title", property: "og:title", content: title },
        { hid: "og:description", property: "og:description", content: description },
        { hid: "og:url", property: "og:url", content: url },
        { hid: "twitter:title", name: "twitter:title", content: title },
        { hid: "twitter:description", name: "twitter:description", content: description },
      ],
      link: [{ rel: "canonical", href: url }],
    };
  },
});
</script>
