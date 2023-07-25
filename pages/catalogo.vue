<template>
  <div class="pb-8">
    <section
      class="flex flex-col items-start justify-center px-8 md:px-32 h-72 bg-secondary -mx-10 md:-mx-32 -mt-16 mb-8 banner bg-no-repeat"
    >
      <h1 class="text-white">Nuestros Vinos</h1>
      <hr class="border-secondary border w-1/12 mb-4" />
      <p class="text-gray-400 w-10/12 md:w-4/12 leading-6">
        Un viaje de degustación a través de nuestra selección única de vinos
        finos
      </p>
    </section>
    <section class="-mt-20">
      <Categories @category-selected="filterProducts" />
      <Catalog :products="filteredProducts" />
    </section>
  </div>
</template>

<script>
import Categories from "~/components/catalog/Categories.vue";
import Catalog from "~/components/home/Catalog.vue";
import { db } from "@/plugins/firebase";
export default {
  components: {
    Catalog,
    Categories,
  },
  data() {
    return {
      products: [],
      filteredProducts: [],
    };
  },
  created() {
    // Carga todos los productos al inicio
    const response = db.collection("Vinos").get();
    response
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const product = {
            id: doc.id,
            ...doc.data(),
          };
          this.products.push(product);
        });
        // Al cargar los productos, también los filtramos inicialmente mostrando todos
        this.filteredProducts = this.products;
      })
      .catch((error) => {
        console.log(error);
      });
  },

  methods: {
    filterProducts(category) {
      if (category === "") {
        // Si se selecciona la categoría 'Todos', mostramos todos los productos
        this.filteredProducts = this.products;
      } else {
        // Filtramos los productos según la categoría seleccionada
        this.filteredProducts = this.products.filter((product) =>
          product.product_categories.includes(category)
        );
      }
    },
  },
};
</script>

<style>
.banner {
  background: url("https://uploads-ssl.webflow.com/636f2dc9ef41c9384311dd93/6373c467e0f78d1f250a7e5d_99a87d8071214fa4ab13060de66a4c93.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
