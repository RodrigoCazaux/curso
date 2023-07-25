<template>
  <div class="bg-white md:min-h-screen hero-mobile-bg md:hero-bg -mx-10 md:-mx-32 -my-16 text-center md:text-left">
    <main>
      <div class="relative px-6 lg:px-32 pt-16">
        <div class="max-w-xl py-32">
          <span class="text-xs tracking-widest text-primary uppercase">Santiago Cazaux</span>
          <hr class="mt-2 mb-4 border-primary border-opacity-30 md:w-10/12" />
          <h1
          >
            EXPERIENCIAS DE VINOS
          </h1>
          <p class="mb-4">
            Difundimos la cultura del vino a través de propuestas que eleven el
            placer de beber.
          </p>
          <PrimaryButton @click="$router.push('/catalogo')" text="Ver Productos"/>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import PrimaryButton from '../shared/PrimaryButton.vue';

export default { components: { PrimaryButton } };
</script>

<style>
.hero-bg {
  background-image: url("https://firebasestorage.googleapis.com/v0/b/curso-aa826.appspot.com/o/bannerInquietos.jpeg?alt=media&token=18c65a7c-00ea-455e-8edd-f0a5b20b8f46");
  background-repeat: no-repeat;
  background-size: cover;
}
.hero-mobile-bg{
  background-image: url("https://firebasestorage.googleapis.com/v0/b/curso-aa826.appspot.com/o/bannerInquietos.jpeg?alt=media&token=18c65a7c-00ea-455e-8edd-f0a5b20b8f46");
  background-repeat: no-repeat;
  background-size: cover;
  background-position-x: -50px;
}
</style>
