<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Inventario de productos</h1>
        <p class="text-sm text-gray-500">Gestiona, crea y actualiza el catálogo disponible en la tienda.</p>
      </div>
      <nuxt-link
        to="/admin/create"
        class="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
      >
        + Nuevo producto
      </nuxt-link>
    </div>

    <div v-if="feedback.message" :class="feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'" class="rounded-md border px-4 py-3 text-sm flex items-center justify-between">
      <span>{{ feedback.message }}</span>
      <button type="button" class="text-xs uppercase tracking-wide" @click="clearFeedback">Cerrar</button>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-lg border border-gray-200 bg-white px-4 py-3">
        <p class="text-xs uppercase text-gray-500">Total</p>
        <p class="text-xl font-semibold text-gray-900">{{ productStats.total }}</p>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white px-4 py-3">
        <p class="text-xs uppercase text-gray-500">En stock</p>
        <p class="text-xl font-semibold text-emerald-500">{{ productStats.inStock }}</p>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white px-4 py-3">
        <p class="text-xs uppercase text-gray-500">Sin stock</p>
        <p class="text-xl font-semibold text-rose-500">{{ productStats.outOfStock }}</p>
      </div>
    </div>

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="relative w-full md:max-w-sm">
        <input
          v-model.trim="searchTerm"
          type="search"
          placeholder="Buscar por nombre o handle…"
          class="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
        />
        <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 7.5 15a7.5 7.5 0 0 0 9.15 1.65Z" />
        </svg>
      </div>
      <div class="flex items-center gap-3">
        <label for="stock-filter" class="text-xs font-medium uppercase text-gray-500">Estado</label>
        <select
          id="stock-filter"
          v-model="stockFilter"
          class="rounded-md border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
        >
          <option value="all">Todos</option>
          <option value="in">En stock</option>
          <option value="out">Sin stock</option>
        </select>
      </div>
    </div>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <table class="w-full text-sm text-left text-gray-600">
        <thead class="text-xs uppercase bg-secondary text-white">
          <tr>
            <th scope="col" class="px-6 py-3">Nombre de producto</th>
            <th scope="col" class="px-6 py-3">Categoría</th>
            <th scope="col" class="px-6 py-3">Precio</th>
            <th scope="col" class="px-6 py-3">Estado</th>
            <th scope="col" class="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody v-if="!isLoading && displayProducts.length">
          <tr
            v-for="product in displayProducts"
            :key="product.id"
            class="border-b last:border-b-0 hover:bg-gray-50 transition"
          >
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {{ product.product_name }}
            </th>
            <td class="px-6 py-4 uppercase tracking-wide text-xs text-gray-500">
              {{ product.product_categories || '—' }}
            </td>
            <td class="px-6 py-4 font-medium text-gray-900">${{ product.variant_price }}</td>
            <td class="px-6 py-4">
              <span
                :class="product.stock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
              >
                {{ product.stock ? 'En stock' : 'Sin stock' }}
              </span>
            </td>
            <td class="px-6 py-4 flex items-center justify-end space-x-3">
              <nuxt-link
                :to="`/admin/${product.product_handle}`"
                class="inline-flex items-center space-x-1 text-secondary hover:opacity-80 text-sm font-medium"
              >
                <EditIcon class="w-4 h-4" />
                <span>Editar</span>
              </nuxt-link>
              <button
                type="button"
                @click="deleteDocument(product.id)"
                :disabled="deletingProductId === product.id"
                class="inline-flex items-center space-x-1 text-rose-600 hover:text-rose-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon class="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="isLoading" class="p-8 text-center text-sm text-gray-500">
        Cargando productos…
      </div>
      <div v-else-if="!displayProducts.length" class="p-8 text-center text-sm text-gray-500">
        No se encontraron productos. Crea uno nuevo para empezar a gestionar el catálogo.
      </div>
    </div>
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
      searchTerm: "",
      stockFilter: "all",
      isLoading: false,
      deletingProductId: null,
      feedback: {
        type: null,
        message: "",
      },
      feedbackTimeout: null,
    };
  },
  computed: {
    ...mapState(['filteredProducts']),

    productStats() {
      const items = Array.isArray(this.filteredProducts) ? this.filteredProducts : [];
      const total = items.length;
      const inStock = items.filter((item) => item.stock).length;
      return {
        total,
        inStock,
        outOfStock: total - inStock,
      };
    },

    displayProducts() {
      const items = Array.isArray(this.filteredProducts) ? this.filteredProducts : [];
      return items.filter((item) => {
        const matchesSearch = this.searchTerm
          ? [item.product_name, item.product_handle]
              .filter(Boolean)
              .some((field) =>
                field.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
              )
          : true;

        const matchesStock =
          this.stockFilter === "all"
            ? true
            : this.stockFilter === "in"
            ? Boolean(item.stock)
            : !item.stock;

        return matchesSearch && matchesStock;
      });
    },
  },
  created() {
    this.loadProducts();
  },
  beforeDestroy() {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }
  },
  methods: {
    ...mapActions(['fetchProducts', 'deleteProduct']),

    async loadProducts() {
      try {
        this.isLoading = true;
        await this.fetchProducts();
      } catch (error) {
        console.error("Error al cargar productos:", error);
        this.showFeedback("error", "No se pudieron cargar los productos. Intenta nuevamente.");
      } finally {
        this.isLoading = false;
      }
    },

    showFeedback(type, message) {
      if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
      this.feedback = { type, message };
      this.feedbackTimeout = setTimeout(() => {
        this.feedback = { type: null, message: "" };
        this.feedbackTimeout = null;
      }, 4000);
    },

    clearFeedback() {
      if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
      this.feedback = { type: null, message: "" };
      this.feedbackTimeout = null;
    },

    async deleteDocument(id) {
      const confirmDelete = window.confirm(
        "¿Estás seguro de que quieres eliminar este documento?"
      );
      if (!confirmDelete) {
        return;
      }
      try {
        this.deletingProductId = id;
        await this.deleteProduct(id); // Llama a la acción del store
        this.showFeedback("success", "Producto eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        this.showFeedback("error", "No se pudo eliminar el producto. Intenta nuevamente.");
      } finally {
        this.deletingProductId = null;
      }
    },
  },
};
</script>
