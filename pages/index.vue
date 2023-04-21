<template>
  <div>
    <Hero />
    <section>
      <div class="container mx-auto px-4 pb-32 pt-48">
        <div class="items-center flex flex-wrap">
          <div class="w-full md:w-5/12 ml-auto px-12 md:px-4">
            <div class="md:pr-12">
              <h3>SOBRE NOSOTROS</h3>
              <p class="mt-4 leading-relaxed text-blueGray-500">
                Difundimos la cultura del vino a través de propuestas que eleven
                el placer de beber. Catas, maridajes, charlas, presentación de
                vinos y bodegas, son algunos de los caminos para generar el
                encuentro con el vino y nuestros clientes.
              </p>
              <PrimaryButton/>
            </div>
          </div>

          <div class="w-full md:w-6/12 mr-auto px-4 pt-24 md:pt-0">
            <img
              alt="..."
              class="max-w-full rounded-lg shadow-xl"
              style="
                transform: scale(1) perspective(1040px) rotateY(-11deg)
                  rotateX(2deg) rotate(2deg);
              "
              src="https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s"
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
      <SecondaryButton />
    </section>
  </div>
</template>

<script lang="ts">
import Hero from "~/components/home/Hero.vue";
import UsProducts from "~/components/home/UsProducts.vue";
import PrimaryButton from '~/components/shared/PrimaryButton.vue';
import SecondaryButton from "~/components/shared/SecondaryButton.vue";

export default {
  name: "IndexPage",
  components: {
    UsProducts,
    Hero,
    SecondaryButton,
    PrimaryButton,
  },
};
</script>
