<template>
  <div class="flex space-x-5" v-if="product">
    <div class="w-1/2">
      <img :src="product.main_variant_image" />
    </div>

    <form class="w-1/2">
      <div class="relative z-0 w-full mb-6 group">
        <input
          type="text"
          v-model="product.product_name"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="floating_repeat_password"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Name</label
        >
      </div>
      <div class="relative z-0 w-full mb-6 group">
        <input
          type="text"
          v-model="product.product_handle"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        />
        <label
          for="floating_email"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Handle</label
        >
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-6 group">
          <input
            type="text"
            v-model="product.product_categories"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Category</label
          >
        </div>
        <div class="relative z-0 w-full mb-6 group">
          <input
            type="text"
            v-model="product.product_bodega"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Bodega</label
          >
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-6 group">
          <input
            type="text"
            v-model="product.variant_price"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Precio</label
          >
        </div>
        <div class="relative z-0 w-full mb-6 group">
          <input
            type="text"
            v-model="product.product_year"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >año</label
          >
        </div>
        <div class="relative z-0 w-full mb-6 group">
          <input
            type="file"
            @change="onFileChange"
            v-on="product.main_variant_image"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            for="floating_company"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Image</label
          >
        </div>
      </div>
      <div class="relative z-0 w-full mb-6 group">
        <textarea
          type="text"
          v-model="product.product_description"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          for="floating_repeat_password"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Text</label
        >
      </div>
      <button
        type="submit"
        @click.prevent="onUpdate"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
      {{ isLoading ? 'Cargando...' : 'Actualizar' }}
      </button>
    </form>
  </div>
</template>

<script>
import { db, firebase } from "@/plugins/firebase";
import "firebase/storage";

export default {
  middleware: "auth",
  layout: "admin",
  data() {
    return {
      product: {
        product_name: "",
        product_handle: "",
        product_categories: "",
        product_bodega: "",
        variant_price: "",
        product_year:"",
        product_description: "",
      },
      isLoading: false,
    };
  },
  mounted() {
    this.loadProduct();
  },
  methods: {
    async loadProduct() {
      try {
        const productHandle = this.$route.params.id;
        const productQuery = await db
          .collection("Vinos")
          .where("product_handle", "==", productHandle)
          .get();

        if (productQuery.empty) {
          console.error("Producto no encontrado");
          return;
        }

        const productData = productQuery.docs[0].data();
        this.product = {
          main_variant_image: productData.main_variant_image,
          product_name: productData.product_name,
          product_handle: productData.product_handle,
          product_categories: productData.product_categories,
          product_bodega: productData.product_bodega,
          variant_price: productData.variant_price,
          product_year: productData.product_year,
          product_description: productData.product_description,
        };
      } catch (error) {
        console.error("Error al cargar el producto:", error);
      }
    },
    async onUpdate() {
      try {
        this.isLoading = true;
        const productQuery = await db
          .collection("Vinos")
          .where("product_handle", "==", this.product.product_handle)
          .get();

        if (productQuery.empty) {
          console.error("Producto no encontrado");
          return;
        }

        const productId = productQuery.docs[0].id;
        const productRef = db.collection("Vinos").doc(productId);

        await productRef.update({
          product_name: this.product.product_name,
          product_handle: this.product.product_handle,
          product_categories: this.product.product_categories,
          product_bodega: this.product.product_bodega,
          variant_price: this.product.variant_price,
          product_year: this.product.product_year,
          product_description: this.product.product_description,
        });

        console.log("Producto actualizado correctamente");
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
      } finally {
        this.isLoading = false;
        alert("Producto actualizado correctamente");
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(file.name);

      fileRef
        .put(file)
        .then(() => {
          console.log("Archivo subido correctamente");
          // Aquí puedes obtener la URL del archivo subido y guardarla en tu objeto product si es necesario
        })
        .catch((error) => {
          console.error("Error al subir el archivo:", error);
        });
    },
  },
};
</script>
