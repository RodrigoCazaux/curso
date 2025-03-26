<template>
  <div>
    <form>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-6 group">
          <input type="text" v-model="product.product_name"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" " required />
          <label for="floating_repeat_password"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
        </div>
        <div class="relative z-0 w-full mb-6 group">
          <select v-model="product.product_bodega"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required>
            <option value="" disabled selected>Selecciona una Bodega</option>
            <option v-for="bodega in bodegas" :key="bodega.id">
              {{ bodega.name }}
            </option>
          </select>
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Bodega</label>
        </div>
      </div>

      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-6 group">
          <select v-model="product.product_categories"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required>
            <option value="" disabled selected>Selecciona una categoría</option>
            <option v-for="category in categories" :key="category.id">
              {{ category.name }}
            </option>
          </select>
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Category</label>
        </div>
        <div class="relative z-0 w-full mb-6 group">
          <input type="text" v-model="slug"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" " required />
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Link</label>
        </div>
      </div>

      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-6 group">
          <input type="text" v-model="product.product_year"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" " required />
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Año</label>
        </div>

        <div class="relative z-0 w-full mb-6 group">
          <input type="text" v-model="product.product_cantidad"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" " required />
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Cantidad</label>
        </div>
      </div>

      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-6 group">
          <input type="text" v-model="formattedPrice" @input="updatePrice" @keypress="allowOnlyNumbers"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" " required />
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Precio</label>
        </div>

        <div class="relative z-0 w-full mb-6 group">
          <input type="file" multiple @change="onFileChange"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" " required />
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Images
          </label>
        </div>
      </div>
      <div class="relative z-0 w-full mb-6 group">
        <textarea type="text" v-model="product.product_description"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" " required />
        <label for="floating_repeat_password"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Text</label>
      </div>
      <button type="submit" @click.prevent="onSubmitButton"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        {{ isLoading ? 'Cargando...' : 'Crear' }}
      </button>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  middleware: "auth",
  layout: "admin",
  data() {
    return {
      product: {
        product_name: null,
        product_description: null,
        main_variant_image: [],
        product_handle: "",
        variant_price: '',
        product_categories: null,
        product_bodega: null,
        stock: true,
        product_cantidad: "",
        product_year: ""
      },
      isLoading: false
    };
  },
  computed: {
    ...mapState(["categories", "bodegas"]),
    slug() {
      if (this.product.product_name) {
        this.product.product_handle = this.product.product_name.replace(/ /g, "-");
        return this.product.product_handle;
      } else {
        return "";
      }
    },
    formattedPrice() {
      if (!this.product.variant_price) return '';
      return this.product.variant_price.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
  },
  created() {
    this.fetchCategories();
    this.fetchBodegas();
  },
  methods: {
    ...mapActions(["fetchCategories", "addProduct", "fetchBodegas"]),
    updatePrice(event) {
      const rawValue = event.target.value.replace(/\D/g, '');
      this.product.variant_price = rawValue;
    },
    allowOnlyNumbers(event) {
      const charCode = event.key.charCodeAt(0);
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    onFileChange(event) {
      this.product.main_variant_image = Array.from(event.target.files);
    },
    async onSubmitButton() {
      try {
        this.isLoading = true;
        await this.addProduct(this.product);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
      } finally {
        this.isLoading = false;
        this.$router.back();
      }
    }
  },
};
</script>
