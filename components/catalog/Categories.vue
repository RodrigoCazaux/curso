<template>
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 mb-8">
    <div class="flex flex-col md:flex-row md:items-center gap-4">
      <div class="relative w-full md:w-1/3">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary text-opacity-60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="10" cy="10" r="6.25" stroke-linecap="round" stroke-linejoin="round" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.5 14.5L20 20" />
          </svg>
        </span>
        <input
          v-model.trim="localFilters.search"
          type="search"
          placeholder="Buscar vinos por nombre, nota o descripción"
          class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:border-primary focus:bg-white rounded-xl text-sm text-primary placeholder-gray-400 focus:outline-none transition"
          @input="emitChange"
        />
      </div>
      <div class="w-full md:w-1/3">
        <BaseDropdown
          :options="categoryOptions"
          :value="localFilters.category"
          placeholder="Categoría"
          @input="updateCategory"
        />
      </div>
      <div class="w-full md:w-1/3">
        <BaseDropdown
          :options="bodegaOptions"
          :value="localFilters.bodega"
          placeholder="Bodega"
          @input="updateBodega"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseDropdown from "@/components/shared/BaseDropdown.vue";

export default {
  name: "CatalogFilters",
  components: { BaseDropdown },
  props: {
    categories: {
      type: Array,
      default: () => [],
    },
    bodegas: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      localFilters: {
        search: "",
        category: "",
        bodega: "",
      },
    };
  },
  computed: {
    categoryOptions() {
      return this.normalizeOptions(this.categories, "Todas las categorías");
    },
    bodegaOptions() {
      return this.normalizeOptions(this.bodegas, "Todas las bodegas");
    },
  },
  methods: {
    normalizeOptions(list, allLabel) {
      const seen = new Set();
      const normalized = (list || [])
        .map((item) => {
          if (typeof item === "string") {
            return { label: item, value: item };
          }

          if (item && typeof item === "object") {
            const label = item.label || item.name || item.value;
            const value = item.value !== undefined ? item.value : label;
            if (label) {
              return { label, value };
            }
          }

          return null;
        })
        .filter(Boolean)
        .filter((option) => {
          const valueKey = option.value || option.label;
          if (seen.has(valueKey)) return false;
          seen.add(valueKey);
          return true;
        });

      return [{ label: allLabel, value: "" }, ...normalized];
    },
    emitChange() {
      this.$emit("filters-change", { ...this.localFilters });
    },
    updateCategory(value) {
      this.localFilters.category = value;
      this.emitChange();
    },
    updateBodega(value) {
      this.localFilters.bodega = value;
      this.emitChange();
    },
  },
};
</script>
