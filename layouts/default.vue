<template>
  <div>
    <Header />
    <div class="px-32">
      <nuxt />
    </div>
  </div>
</template>

<script>
import Header from "@/components/shared/Header.vue";
export default {
  components: {
    Header,
  },
};
</script>

<style></style>
