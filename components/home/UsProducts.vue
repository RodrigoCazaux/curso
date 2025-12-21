<template>
  <div class="grid grid-cols-12 gap-x-8 gap-y-4 py-10">
    <ProductCard
      v-for="(product, index) in products"
      :key="index"
      :name="product.product_name"
      :category="product.product_categories"
      :image="product.main_variant_image"
      :slug="product.id"
      :price="product.variant_price"
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
    const response = db
      .collection("Vinos")
      .limit(4)
      .get();
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
