<template>
  <div><Navbar /><main class="mx-auto max-w-7xl px-4 sm:px-8 py-8 bg-background min-h-screen"><slot /></main></div>
</template>
<script setup>
import Navbar from "@/components/admin/Navbar.vue";
</script>
