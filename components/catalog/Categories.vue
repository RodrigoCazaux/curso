<template>
  <ul
    class="flex flex-wrap font-medium text-center border-b border-opacity-40 border-primary bg-white rounded-t-xl uppercase text-xs"
  >
    <li class="mr-2">
      <a
        href="#"
        @click="selectCategory('')"
        aria-current="page"
        :class="{ active: activeCategory === '' }"
        class="inline-block p-4 text-primary text-opacity-50 rounded-t-lg"
        >Todos</a
      >
    </li>
    <li class="mr-2">
      <a
        href="#"
        @click="selectCategory('ROSADO')"
        :class="{ active: activeCategory === 'ROSADO' }"
        class="inline-block p-4 rounded-t-lg text-primary text-opacity-50"
        >Rosados</a
      >
    </li>
    <li class="mr-2">
      <a
        href="#"
        @click="selectCategory('TINTO')"
        :class="{ active: activeCategory === 'TINTO' }"
        class="inline-block p-4 rounded-t-lg text-primary text-opacity-50"
        >Tintos</a
      >
    </li>
    <li class="mr-2">
      <a
        href="#"
        @click="selectCategory('BLANCO')"
        :class="{ active: activeCategory === 'BLANCO' }"
        class="inline-block p-4 rounded-t-lg text-primary text-opacity-50"
        >Blancos</a
      >
    </li>
    <li class="mr-2">
      <a
        href="#"
        @click="selectCategory('ESPUMANTE')"
        :class="{ active: activeCategory === 'ESPUMANTE' }"
        class="inline-block p-4 rounded-t-lg text-primary text-opacity-50"
        >Espumantes</a
      >
    </li>
    <li class="mr-2">
      <a
        href="#"
        @click="selectCategory('PACK')"
        :class="{ active: activeCategory === 'PACK' }"
        class="inline-block p-4 rounded-t-lg text-primary text-opacity-50"
        >Packs</a
      >
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      activeCategory: "",
    };
  },
  methods: {
    selectCategory(category) {
      this.activeCategory = category;
      this.$emit("category-selected", category);
    },
  },
};
</script>
<style scoped>
.active {
  @apply bg-gray-100 text-opacity-100;
}
</style>
