<template>
  <div
    @click.stop="$router.push(slug)"
    class="group relative col-span-3 cursor-pointer"
  >
    <div
      class="min-h-80 relative aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80"
    >
      <img
        :src="image"
        alt="product image"
        class="h-full w-full object-cover object-center lg:h-full lg:w-full"
      />
      <span
        class="mt-1 bottom-5 left-5 text-xs absolute text-gray-300 py-1 px-4 bg-slate-700 bg-opacity-20 mb-2 rounded-sm"
        >{{ category }}</span
      >
    </div>
    <div class="mt-4 text-left">
      <h4 class="mt-1">
        {{ name }}
      </h4>
      <p class="text-sm text-gray-500">UYU {{ price }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    name: { type: String, default: "Basic Tee" },
    description: { type: String, default: "This is a short description" },
    category: { type: String, default: "shirt" },
    price: { type: String, default: "35" },
    slug: { type: String, default: "product-name" },
    image: { type: String, default: "" },
  },
};
</script>
