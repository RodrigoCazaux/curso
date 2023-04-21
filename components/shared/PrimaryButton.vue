<template>
  <button @click="$emit('click')" class="text-white tracking-widest px-6 py-4 text-xs uppercase font-bold bg-secondary relative transition-all ease-in-out duration-300 hover:bg-white hover:text-secondary hover:shadow-xl">{{text}}</button>
</template>

<script>
export default {
  props: {
    text: { type: String,default:'Text' },
  },
};
</script>