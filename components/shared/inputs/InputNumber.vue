<template>
  <div class="inline-flex items-stretch rounded-lg border border-gray-200 bg-gray-100 h-12 overflow-hidden shadow-sm">
    <button
      type="button"
      aria-label="Disminuir cantidad"
      @click="decrement"
      class="px-4 text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition"
    >
      <span class="text-xl leading-none">−</span>
    </button>
    <input
      v-model.number="internalValue"
      @input="emitInput"
      type="number"
      min="1"
      max="1000000"
      step="1"
      class="w-14 text-center bg-transparent text-gray-800 font-semibold focus:outline-none"
      name="custom-input-number"
      aria-label="Cantidad"
    />
    <button
      type="button"
      aria-label="Incrementar cantidad"
      @click="increment"
      class="px-4 text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition"
    >
      <span class="text-xl leading-none">+</span>
    </button>
  </div>
</template>

<script>
export default {
  emits: ['input'],
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      internalValue: this.value || 1,
    };
  },
  watch: {
    value(newVal) {
      this.internalValue = newVal || 1;
    },
  },
  methods: {
    emitInput() {
      const parsed = Number(this.internalValue);
      const safe = Number.isSafeInteger(parsed) && parsed > 0 && parsed <= 1000000 ? parsed : 1;
      this.internalValue = safe;
      this.$emit("input", safe);
    },
    increment() {
      this.internalValue = (this.internalValue || 0) + 1;
      this.emitInput();
    },
    decrement() {
      const next = (this.internalValue || 1) - 1;
      this.internalValue = next < 1 ? 1 : next;
      this.emitInput();
    },
  },
};
</script>
