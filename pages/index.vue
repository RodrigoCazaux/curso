<template>
  <div>
    <Hero />
    <Catalog/>
  </div>
</template>

<script lang="ts">
import Hero from "~/components/home/Hero.vue";
import Catalog from "~/components/home/Catalog.vue";
export default {
  name: "IndexPage",
  components: {
    Catalog,
    Hero,
  },
};
</script>
