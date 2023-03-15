<template>
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
</template>

<script>
import ProductCard from "@/components/shared/ProductCard.vue";
import { db } from "@/plugins/firebase";
export default {
  components: {
    ProductCard,
  },
  data() {
    return {
      products: [],
    };
  },
  created() {
    const response = db.collection("products").get();
    response
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const product = {
            id: doc.id,
            ...doc.data(),
          };
          this.products.push(product);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
