<template>
  <div class="pt-8">
    <h1>Nuestros Vinos</h1>
    <p class="mb-16">Un viaje de degustación a través de nuestra selección única de vinos finos</p>
    <Categories/>
    <Catalog />
  </div>
</template>

<script>
import Categories from '~/components/catalog/Categories.vue';
import Catalog from "~/components/home/Catalog.vue";
export default {
  components: {
    Catalog,
    Categories,
  },
}
</script>

<style>

</style>