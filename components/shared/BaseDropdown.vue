<template>
  <div class="relative w-full" ref="dropdown">
    <button
      type="button"
      class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between text-sm text-primary shadow-sm focus:ring-2 focus:ring-primary focus:ring-opacity-30 focus:outline-none transition"
      :aria-expanded="isOpen"
      @click="toggleDropdown"
    >
      <span class="truncate" :class="{ 'text-gray-400': !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 transform transition duration-200"
        :class="{ 'rotate-180 text-primary': isOpen, 'text-gray-400': !isOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150 transform"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-30 overflow-hidden"
      >
        <ul class="max-h-64 overflow-auto py-2">
          <li
            v-for="option in options"
            :key="option.value !== undefined && option.value !== null ? option.value : option.label"
          >
            <button
              type="button"
              class="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-gray-50 flex items-center justify-between"
              @click="selectOption(option.value)"
            >
              <span class="truncate">{{ option.label }}</span>
              <span v-if="option.value === value" class="text-primary text-xs font-semibold">●</span>
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "BaseDropdown",
  props: {
    value: {
      type: [String, Number, Boolean],
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "Selecciona una opción",
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    selectedLabel() {
      const selected = this.options.find((option) => option.value === this.value);
      return selected ? selected.label : "";
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(value) {
      this.$emit("input", value);
      this.$emit("change", value);
      this.isOpen = false;
    },
    handleClickOutside(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.isOpen = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>
