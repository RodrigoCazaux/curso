<template>
  <div class="grid grid-cols-12 gap-x-0 md:gap-x-8 gap-y-10 py-10">
    <ProductCard
      v-for="(product, index) in products"
      v-if="product.stock"
      :key="index"
      :name="product.product_name"
      :category="product.product_categories"
      :image="product.main_variant_image"
      :slug="product.product_handle"
      :price="product.variant_price"
    />
  </div>
</template>

<script>
import ProductCard from "@/components/shared/ProductCard.vue";
export default {
  components: {
    ProductCard,
  },
  props: {
    products: {
      type: Array,
      required: true
    }
  }
};
</script>
