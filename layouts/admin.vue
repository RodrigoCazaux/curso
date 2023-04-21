<template>
  <div>
    <Navbar />
    <div class="px-32 py-32 bg-background min-h-screen">
      <nuxt />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/admin/Navbar.vue";
export default {
  components: { Navbar },
};
</script>
