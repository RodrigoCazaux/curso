<template>
  <div  @click.stop="$router.push(category+'/'+slug)" class="group relative col-span-3">
    <div
      class="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80"
    >
      <img
        :src="image"
        alt="Front of men&#039;s Basic Tee in black."
        class="h-full w-full object-cover object-center lg:h-full lg:w-full"
      />
    </div>
    <div class="mt-4 flex justify-between z-20">
      <div>
        <h3 class="text-sm text-gray-700">
          <a>
            <span aria-hidden="true" class="absolute inset-0"></span>
            {{ name }}
          </a>
        </h3>
        <button  @click="$router.push(category)"  class="mt-1 text-sm text-gray-500">{{ category }}</button>
      </div>
      <p class="text-sm font-medium text-gray-900">${{ price }}</p>
      <burron  @click.stop="$router.push(category+'/'+slug)">See more</burron>
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
    image: {type:String, default: ""}
  },
};
</script>
