<template>
  <div>
    <div class="absolute z-50 top-0 left-0 bg-secondary h-screen w-full hero-bg">
      <section class="bg-white flex flex-col justify-center items-center bg-opacity-20 h-full w-full bg-gradient-to-t from-black to-transparent">
        <img
            class="h-32 w-auto mb-6"
            src="https://firebasestorage.googleapis.com/v0/b/curso-aa826.appspot.com/o/logoInquieto.png?alt=media&token=d3dae27b-b6c9-4620-866c-349bc2659b20"
            alt=""
          />
          <h5 class="font-bold leading-tight text-gray-200 text-2xl">Estamos remodelando</h5>
          <p class="text-gray-400">En poco tiempo estaremos de vuelta para ofrecerte la mejor experiencia de vinos online.</p>
      </section>
    </div>
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

<style>
.hero-bg {
  background-image: url("https://firebasestorage.googleapis.com/v0/b/curso-aa826.appspot.com/o/bannerInquietos.jpeg?alt=media&token=18c65a7c-00ea-455e-8edd-f0a5b20b8f46");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>