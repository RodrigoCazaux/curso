<template>
  <div class="flex flex-col lg:flex-row space-x-5" v-if="product">
    <div class="w-2/2 lg:w-1/2">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="(image, index) in product.main_variant_image" :key="index" class="relative">
          <img @click="selectImage(index)" :src="image" :class="[
            'w-full h-auto border rounded-md cursor-pointer',
            selectedImageIndex === index
              ? 'border-blue-500 ring-2 ring-primary'
              : 'border-gray-300'
          ]" />
        </div>
      </div>
    </div>

    <form class="w-2/2 lg:w-1/2">
      <div class="relative z-0 w-full mb-6 group">
        <input type="text" v-model="product.product_name"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" " required />
        <label for="floating_repeat_password"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
      </div>
      <!-- <div class="relative z-0 w-full mb-6 group">
        <input type="file" @change="onAddImages" multiple
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" " />
        <label
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          Agregar imágenes
        </label>
      </div> -->
      <div class="relative z-0 w-full mb-6 group">
        <input type="text" v-model="product.product_handle"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required />
        <label for="floating_email"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Handle</label>
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
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Cantidad (ml/l)</label>
        </div>
      </div>

      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-6 group">
          <select v-model="product.product_categories"
            class="block uppercase py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required>
            <option value="" disabled selected>Selecciona una categoría</option>
            <option class="uppercase" v-for="category in categories" :key="category.id">
              {{ category.name }}
            </option>
          </select>
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Category</label>
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
          <input type="text" v-model="product.variant_price"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" " required />
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Precio</label>
        </div>
        <div class="relative z-0 w-full mb-6 group">
          <input type="file" @change="onFileChange"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" " />
          <label
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Cambiar imagen seleccionada
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
      <div class="relative z-0 w-full mb-6 group">
        <label class="flex items-center space-x-3">
          <span class="text-gray-700">¿Hay stock?</span>
          <button type="button" :class="{
            'bg-blue-500': product.stock,
            'bg-gray-300': !product.stock,
          }"
            class="relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            role="switch" @click="toggleStock">
            <span aria-hidden="true" :class="product.stock ? 'translate-x-6' : 'translate-x-1'"
              class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform"></span>
          </button>
        </label>
      </div>
      <button type="submit" @click.prevent="onUpdate"
        class="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
        {{ isLoading ? "Cargando..." : "Actualizar" }}
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

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
      isLoading: false,
      selectedImageIndex: null,
      imageChanges: [],
    };
  },
  created() {
    this.fetchCategories();
    this.fetchBodegas();
  },
  mounted() {
    this.loadProduct();
  },
  computed: {
    ...mapState(["categories", "bodegas"]),
  },
  methods: {
    ...mapActions(['updateProduct', 'uploadImage', "fetchCategories","fetchBodegas"]),

    toggleStock() {
      this.product.stock = !this.product.stock;
    },

    async loadProduct() {
      try {
        const productHandle = this.$route.params.id;
        const productQuery = await this.$store.dispatch('fetchProductBySlug', productHandle);

        if (!this.product) {
          console.error("Producto no encontrado");
          return;
        }

        this.product = this.$store.state.product;
      } catch (error) {
        console.error("Error al cargar el producto:", error);
      }
    },

    selectImage(index) {
      this.selectedImageIndex = index;
    },

    async onAddImages(event) {
      const files = event.target.files;
      if (!files || files.length === 0) {
        alert("No se seleccionaron imágenes.");
        return;
      }

      try {
        this.isLoading = true;
        const newImageUrls = [];

        // Subir cada imagen seleccionada
        for (const file of files) {
          const imageUrl = await this.$store.dispatch("uploadImage", {
            file,
            productName: this.product.product_name, // Usamos el nombre del producto para crear la ruta
          });
          newImageUrls.push(imageUrl);
        }

        // Actualizar el producto con las nuevas imágenes
        const updatedImages = [...this.product.main_variant_image, ...newImageUrls];
        await this.$store.dispatch("updateProduct", {
          ...this.product,
          images: updatedImages,
        });

        // Actualizar el estado local
        this.product.main_variant_image = updatedImages;
        alert("Imágenes agregadas correctamente.");
      } catch (error) {
        console.error("Error al agregar imágenes:", error);
        alert("Ocurrió un error al agregar las imágenes.");
      } finally {
        this.isLoading = false;
      }
    },

    async onFileChange(event) {
      const file = event.target.files[0];
      if (file && this.selectedImageIndex !== null) {
        // Registrar la imagen seleccionada localmente
        const oldImageUrl = this.product.main_variant_image[this.selectedImageIndex];

        // Guardar el cambio en el array temporal
        this.imageChanges.push({
          index: this.selectedImageIndex,
          file,
          oldImageUrl,
        });

        // Actualizar la vista previa local
        const reader = new FileReader();
        reader.onload = (e) => {
          this.product.main_variant_image[this.selectedImageIndex] = e.target.result; // Mostrar la vista previa
        };
        reader.readAsDataURL(file);
      } else {
        alert("Por favor, selecciona una imagen para reemplazar.");
      }
    },

    async onUpdate() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;

        // 1. Subir nuevas imágenes y actualizar el producto en Firestore
        for (const change of this.imageChanges) {
          const { file, oldImageUrl, index } = change;

          // Subir la nueva imagen y obtener su URL, usando el nombre del producto
          const newImageUrl = await this.$store.dispatch("uploadImage", {
            file,
            oldImageUrl,
            productName: this.product.product_name, // Usamos el nombre del producto para crear la ruta
          });

          // Actualizar la imagen localmente y sincronizar con Firestore
          await this.$store.dispatch("updateProductImage", {
            productId: this.product.id,
            imageIndex: index,
            newImageUrl,
          });
          this.product.main_variant_image[index] = newImageUrl;
        }
        await this.$store.dispatch("updateProduct", this.product);
        this.imageChanges = [];
        alert("Producto actualizado correctamente");
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
