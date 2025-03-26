<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-white uppercase bg-secondary">
        <tr>
          <th scope="col" class="px-6 py-3">Nombre de producto</th>
          <th scope="col" class="px-6 py-3">Categoria</th>
          <th scope="col" class="px-6 py-3">Precio</th>
          <th scope="col" class="px-6 py-3">Estado</th>
          <th scope="col" class="px-6 py-3">Descripcion</th>
          <th scope="col" class="px-6 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id" class="bg-white border-b">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {{ product.product_name }}
          </th>
          <td class="px-6 py-4">{{ product.product_categories }}</td>
          <td class="px-6 py-4">${{ product.variant_price }}</td>
          <td class="px-6 py-4">
            <span :class="product.stock ? ' bg-green-200' : ' bg-red-300'" class="text-xs py-2 px-2 flex flex-col flex-shrink-0 rounded-lg">
              {{ product.stock ? 'En Stock' : 'Sin Stock' }}
            </span>
          </td>
          <td class="px-6 py-4">{{ product.product_description }}</td>
          <td class="px-6 py-4 flex items-center space-x-2">
            <nuxt-link :to="`/admin/${product.product_handle}`" class="font-medium text-secondary hover:underline">
              <EditIcon class="w-5 h-5" />
            </nuxt-link>
            <span @click="deleteDocument(product.id)" class="font-medium text-primary hover:underline">
              <TrashIcon class="w-5 h-5" />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import EditIcon from "~/components/shared/icons/EditIcon.vue";
import TrashIcon from "~/components/shared/icons/TrashIcon.vue";
import { mapState, mapActions } from 'vuex';

export default {
  components: { EditIcon, TrashIcon },
  middleware: "auth",
  layout: "admin",
  data() {
    return {
      products: [],
    };
  },
  computed: {
    ...mapState(['filteredProducts']),
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    ...mapActions(['fetchProducts', 'filterProducts', 'deleteProduct']),

    async deleteDocument(id) {
      const confirmDelete = window.confirm(
        "¿Estás seguro de que quieres eliminar este documento?"
      );
      if (!confirmDelete) {
        return;
      }
      await this.deleteProduct(id); // Llama a la acción del store
    },
  },
};
</script>
