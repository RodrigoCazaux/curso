<template>
  <div
    class="bg-white md:min-h-screen hero-bg -mx-10 md:-mx-32 -my-16 text-center md:text-left"
  >
    <main>
      <div class="relative px-6 lg:px-32 2xl:px-52 pt-16">
        <div class="max-w-xl py-32">
          <span class="text-xs tracking-widest text-primary uppercase"
            >Santiago Cazaux</span
          >
          <hr class="mt-2 mb-4 border-primary border-opacity-30 md:w-10/12" />
          <h1>EXPERIENCIAS DE VINOS</h1>
          <p class="mb-4">
            Difundimos la cultura del vino a través de propuestas que eleven el
            placer de beber.
          </p>
          <PrimaryButton
            @click="$router.push('/catalogo')"
            text="Ver Productos"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import PrimaryButton from "../shared/PrimaryButton.vue";

export default { components: { PrimaryButton } };
</script>

<style>
.hero-bg {
  background-image: url("https://firebasestorage.googleapis.com/v0/b/curso-aa826.appspot.com/o/bannerInquietos%20.jpg?alt=media&token=1112ebbd-0039-48db-9579-0809f00c5f7d");
  background-repeat: no-repeat;
  background-size: cover;
}

@media only screen and (max-width: 600px) {
  .hero-bg {
    background-image: url("https://firebasestorage.googleapis.com/v0/b/curso-aa826.appspot.com/o/bannerInquietos%20.jpg?alt=media&token=1112ebbd-0039-48db-9579-0809f00c5f7d");
    background-repeat: no-repeat;
    background-size: cover;
    background-position-x: -50px;
  }
}
</style>
