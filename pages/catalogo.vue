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
      <CatalogFilters
        :categories="categories"
        :bodegas="bodegas"
        @filters-change="applyFilters"
      />
      <Catalog :products="filteredProducts" />
    </section>
  </div>
</template>

<script>
import CatalogFilters from "~/components/catalog/Categories.vue";
import Catalog from "~/components/home/Catalog.vue";
import { db } from "@/plugins/firebase";
export default {
  components: {
    Catalog,
    CatalogFilters,
  },
  data() {
    return {
      products: [],
      filteredProducts: [],
      categories: [],
      bodegas: [],
      filters: {
        search: "",
        category: "",
        bodega: "",
      },
    };
  },
  async created() {
    try {
      // Obtenemos todos los productos y ordenamos localmente para no excluir los que no tienen createdAt
      const snapshot = await db.collection("Vinos").get();

      this.products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      this.buildFilterOptions();
      this.applyFilters();
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    buildFilterOptions() {
      const categorySet = new Set();
      const bodegaSet = new Set();

      this.products.forEach((product) => {
        const categories = Array.isArray(product.product_categories)
          ? product.product_categories
          : [product.product_categories];

        categories
          .filter(Boolean)
          .forEach((category) => {
            const normalized = typeof category === "string" ? category.trim() : category;
            if (normalized) {
              categorySet.add(normalized);
            }
          });

        if (product.product_bodega) {
          const normalizedBodega =
            typeof product.product_bodega === "string"
              ? product.product_bodega.trim()
              : product.product_bodega;

          if (normalizedBodega) {
            bodegaSet.add(normalizedBodega);
          }
        }
      });

      this.categories = Array.from(categorySet);
      this.bodegas = Array.from(bodegaSet);
    },
    applyFilters(newFilters = {}) {
      this.filters = { ...this.filters, ...newFilters };

      const searchTerm = (this.filters.search || "").toLowerCase();
      const selectedCategoryValue = this.filters.category
        ? this.filters.category.toString().toLowerCase()
        : "";
      const selectedBodegaValue = this.filters.bodega
        ? this.filters.bodega.toString().toLowerCase()
        : "";

      this.filteredProducts = this.products
        .filter((product) => {
          const productName = (product.product_name || "").toLowerCase();
          const productDescription = (product.product_description || "").toLowerCase();
          const productBodega = (product.product_bodega || "").toLowerCase();

        const categories = Array.isArray(product.product_categories)
          ? product.product_categories
          : [product.product_categories];

        const matchesCategory =
          !selectedCategoryValue ||
          categories
            .filter(Boolean)
            .some(
              (category) =>
                category &&
                category.toString().toLowerCase() === selectedCategoryValue
            );

        const matchesBodega =
          !selectedBodegaValue || productBodega === selectedBodegaValue;

        const matchesSearch =
          !searchTerm ||
          productName.includes(searchTerm) ||
          productDescription.includes(searchTerm) ||
          productBodega.includes(searchTerm);

        const matchesStock = product.stock === undefined ? true : product.stock;

          return matchesCategory && matchesBodega && matchesSearch && matchesStock;
        })
        .sort((a, b) => {
          const aTime = a?.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const bTime = b?.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return bTime - aTime;
        });
    },
  },
  head() {
    const baseUrl = process.env.SITE_URL || "https://inquieto.com";
    const url = `${baseUrl}${this.$route.path}`;
    const title = "Catálogo de vinos | Inquieto";
    const description =
      "Explora nuestra selección curada de vinos finos uruguayos por categoría y bodega.";

    return {
      title,
      meta: [
        { hid: "description", name: "description", content: description },
        { hid: "og:title", property: "og:title", content: title },
        { hid: "og:description", property: "og:description", content: description },
        { hid: "og:url", property: "og:url", content: url },
        { hid: "twitter:title", name: "twitter:title", content: title },
        { hid: "twitter:description", name: "twitter:description", content: description },
      ],
      link: [{ rel: "canonical", href: url }],
    };
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
