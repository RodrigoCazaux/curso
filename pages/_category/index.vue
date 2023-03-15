<template>
  <div>
    <h1>CATEGORYS</h1>
    <div class="grid grid-cols-12 gap-x-8 gap-y-4">
      <ProductCard
        v-for="(product, index) in products"
        :key="index"
        :name="product.name"
        :category="product.category"
        :image="product.image"
        :slug="product.slug"
      />
    </div>
  </div>
</template>

<script>
import { db } from "@/plugins/firebase";
import ProductCard from "@/components/shared/ProductCard.vue";
export default {
  layout: "default",
  components: {
    ProductCard,
  },
  async created() {
    await db
      .collection('products')
      .where('category', '==', this.$route.params.category)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.products.push(doc.data())
        })
      })
  },
  data() {
    return {
      products: []
    }
  }
};
</script>

<style></style>
