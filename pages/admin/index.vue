<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Catálogo de vinos</h1>
        <p class="text-sm text-gray-500">Gestiona, crea y actualiza el catálogo disponible en la tienda.</p>
      </div>
      <nuxt-link
        to="/admin/create"
        class="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
      >
        + Nuevo producto
      </nuxt-link>
      <nuxt-link to="/admin/backup" class="text-secondary underline">Respaldo y mantenimiento</nuxt-link>
    </div>

    <div v-if="feedback.message" :role="feedback.type === 'error' ? 'alert' : 'status'" :class="feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'" class="rounded-md border px-4 py-3 text-sm flex items-center justify-between">
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

    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="relative w-full md:max-w-sm">
        <input
          v-model.trim="searchTerm"
          type="search"
          placeholder="Buscar por nombre…"
          class="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
        />
        <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 7.5 15a7.5 7.5 0 0 0 9.15 1.65Z" />
        </svg>
      </div>
      <div class="flex flex-wrap items-center gap-3 md:justify-end">
        <div class="flex items-center gap-2">
          <label for="stock-filter" class="text-xs font-medium uppercase text-gray-500">Estado</label>
          <select
            id="stock-filter"
            v-model="stockFilter"
            class="rounded-md border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
          >
            <option value="all">Todos</option>
            <option value="in">En stock</option>
            <option value="out">Sin stock</option>
            <option value="archived">Archivados</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label for="category-filter" class="text-xs font-medium uppercase text-gray-500">Categoría</label>
          <select
            id="category-filter"
            v-model="categoryFilter"
            class="rounded-md border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
          >
            <option value="">Todas</option>
            <option
              v-for="category in categoryOptions"
              :key="`category-${category}`"
              :value="category"
              class="uppercase"
            >
              {{ category }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label for="bodega-filter" class="text-xs font-medium uppercase text-gray-500">Bodega</label>
          <select
            id="bodega-filter"
            v-model="bodegaFilter"
            class="rounded-md border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
          >
            <option value="">Todas</option>
            <option
              v-for="bodega in bodegaOptions"
              :key="`bodega-${bodega}`"
              :value="bodega"
            >
              {{ bodega }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <table class="w-full text-sm text-left text-gray-600">
        <thead class="text-xs uppercase bg-secondary text-white">
          <tr>
            <th scope="col" class="px-6 py-3 w-1/4">Nombre de producto</th>
            <th scope="col" class="px-6 py-3">Categoría</th>
            <th scope="col" class="px-6 py-3">Bodega</th>
            <th scope="col" class="px-6 py-3">Precio ({{ $config.public.currency }})</th>
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
            <th scope="row" class="px-6 py-4 font-medium text-gray-900">
              <span class="block max-w-[180px] truncate">
                {{ product.product_name || '—' }}
              </span>
            </th>
            <td class="px-6 py-4 uppercase tracking-wide text-xs text-gray-500">
              {{ product.product_categories || '—' }}
            </td>
            <td class="px-6 py-4 text-xs font-medium text-gray-900">
              {{ product.product_bodega || '—' }}
            </td>
            <td class="px-6 py-4 font-medium text-gray-900">
              <form @submit.prevent="savePrice(product)" class="flex gap-2"><input type="number" min="0" max="100000000" step="0.01" required :aria-label="`Precio de ${product.product_name}`" :value="priceDrafts[product.id] ?? product.variant_price" @input="priceDrafts[product.id] = Number($event.target.value)" class="w-28 border rounded p-2" /><button :disabled="busyId === product.id" class="text-secondary">Guardar</button></form>
            </td>
            <td class="px-6 py-4">
              <button type="button" @click="toggleAvailability(product)" :disabled="busyId === product.id || product.archived"
                :class="product.stock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
              >
                {{ product.archived ? 'Archivado' : product.stock ? 'En stock' : 'Sin stock' }}
              </button>
            </td>
            <td class="px-6 py-4 flex items-center justify-end space-x-3">
              <nuxt-link
                :to="`/admin/${product.id}`"
                class="inline-flex items-center space-x-1 text-secondary hover:opacity-80 text-sm font-medium"
              >
                <EditIcon class="w-4 h-4" />
                <span>Editar</span>
              </nuxt-link>
              <button type="button" :disabled="busyId === product.id" @click="duplicate(product)" class="text-secondary">Duplicar</button>
              <button type="button" :disabled="busyId === product.id" @click="archive(product)" class="text-secondary">{{ product.archived ? 'Restaurar' : 'Archivar' }}</button>
              <button v-if="product.archived"
                type="button"
                @click="openDeleteModal(product)"
                :disabled="deletingProductId === product.id"
                class="inline-flex items-center space-x-1 text-rose-600 hover:text-rose-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon class="w-4 h-4" />
                <span>{{ deletingProductId === product.id ? 'Eliminando…' : 'Eliminar' }}</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="isLoading" class="p-8 text-center text-sm text-gray-500">
        Cargando productos…
      </div>
      <div v-else-if="loadError" role="alert" class="p-8 text-rose-700">No se pudo cargar el catálogo. <button @click="loadProducts" class="underline">Reintentar</button></div>
      <div v-else-if="!displayProducts.length" class="p-8 text-center text-sm text-gray-500">
        No se encontraron productos. Crea uno nuevo para empezar a gestionar el catálogo.
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div
      v-if="isDeleteModalOpen"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div class="p-5 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Eliminar producto</h2>
          <p class="mt-2 text-sm text-gray-600">
            ¿Seguro que deseas eliminar
            <span class="font-semibold text-gray-900">{{ productToDelete?.product_name || 'este producto' }}</span>?
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div class="p-5 flex items-center justify-end space-x-3">
          <button
            type="button"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="closeDeleteModal"
            :disabled="isDeleting"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="inline-flex items-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="confirmDelete"
            :disabled="isDeleting"
          >
            <svg
              v-if="isDeleting"
              class="mr-2 h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 000 16v4l3.5-3.5L12 20v4a8 8 0 01-8-8z"></path>
            </svg>
            {{ isDeleting ? 'Eliminando…' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: "auth", layout: "admin" });
</script>
<script>
import EditIcon from "~/components/shared/icons/EditIcon.vue";
import TrashIcon from "~/components/shared/icons/TrashIcon.vue";
import { mapState, mapActions } from 'vuex';

export default {
  components: { EditIcon, TrashIcon },
  data() {
    return {
      searchTerm: "",
      stockFilter: "all",
      categoryFilter: "",
      bodegaFilter: "",
      isLoading: false,
      loadError: false,
      busyId: null,
      priceDrafts: {},
      deletingProductId: null,
      feedback: {
        type: null,
        message: "",
      },
      feedbackTimeout: null,
      isDeleteModalOpen: false,
      productToDelete: null,
      isDeleting: false,
    };
  },
  computed: {
    ...mapState(['filteredProducts', 'categories', 'bodegas']),

    productStats() {
      const items = this.displayProducts;
      const total = items.length;
      const inStock = items.filter((item) => item.stock).length;
      return {
        total,
        inStock,
        outOfStock: total - inStock,
      };
    },

    categoryOptions() {
      const categories = Array.isArray(this.categories) ? this.categories : [];
      return Array.from(
        new Set(
          categories
            .map((category) => category?.name?.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b));
    },

    bodegaOptions() {
      const bodegas = Array.isArray(this.bodegas) ? this.bodegas : [];
      return Array.from(
        new Set(
          bodegas
            .map((bodega) => bodega?.name?.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b));
    },

    displayProducts() {
      const items = Array.isArray(this.filteredProducts) ? this.filteredProducts : [];
      return items.filter((item) => {
        if (this.stockFilter === "archived" ? !item.archived : item.archived) return false;
        const matchesSearch = this.searchTerm
          ? [item.product_name, item.product_handle, item.id]
              .filter(Boolean)
              .some((field) =>
                field.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
              )
          : true;

        const matchesStock =
          ["all", "archived"].includes(this.stockFilter)
            ? true
            : this.stockFilter === "in"
            ? Boolean(item.stock)
            : !item.stock;

        const itemCategory = item.product_categories
          ? item.product_categories.toString().trim()
          : "";
        const matchesCategory = this.categoryFilter
          ? itemCategory === this.categoryFilter
          : true;

        const itemBodega = item.product_bodega
          ? item.product_bodega.toString().trim()
          : "";
        const matchesBodega = this.bodegaFilter
          ? itemBodega === this.bodegaFilter
          : true;

        return matchesSearch && matchesStock && matchesCategory && matchesBodega;
      });
    },
  },
  mounted() {
    this.loadProducts();
    if (this.$route.query.created) this.showFeedback("success", "Vino creado correctamente.");
  },
  beforeUnmount() {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }
  },
  methods: {
    ...mapActions(['fetchProducts', 'deleteProduct', 'fetchCategories', 'fetchBodegas']),

    async loadProducts() {
      try {
        this.isLoading = true;
        this.loadError = false;
        await Promise.all([this.fetchProducts(), this.fetchCategories(), this.fetchBodegas()]);
      } catch (error) {
        this.loadError = true;
        console.error("Error al cargar datos de inventario:", error);
        this.showFeedback("error", "No se pudieron cargar los datos. Intenta nuevamente.");
      } finally {
        this.isLoading = false;
      }
    },

    async perform(product, action, payload, message) {
      if (this.busyId) return;
      this.busyId = product.id;
      try { const result = await this.$store.dispatch(action, payload); this.showFeedback('success', message); return result; }
      catch (error) { this.showFeedback('error', error.message || 'No se pudo guardar el cambio.'); }
      finally { this.busyId = null; }
    },
    async savePrice(product) {
      const value = this.priceDrafts[product.id] ?? product.variant_price;
      await this.perform(product, 'quickUpdate', { id: product.id, variant_price: value }, 'Precio guardado.');
    },
    async toggleAvailability(product) { await this.perform(product, 'quickUpdate', { id: product.id, stock: !product.stock }, 'Disponibilidad guardada.'); },
    async archive(product) { await this.perform(product, 'setArchived', { id: product.id, archived: !product.archived }, product.archived ? 'Vino restaurado.' : 'Vino archivado. Puedes restaurarlo desde el filtro Archivados.'); },
    async duplicate(product) {
      const id = await this.perform(product, 'duplicateProduct', product.id, 'Copia creada sin disponibilidad. Revisa la añada, precio y existencias.');
      if (id) await this.$router.push(`/admin/${id}`);
    },
    showFeedback(type, message) {
      if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
      this.feedback = { type, message };
      if (type === "error") { this.feedbackTimeout = null; return; }
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

    openDeleteModal(product) {
      this.productToDelete = product;
      this.isDeleteModalOpen = true;
    },

    closeDeleteModal() {
      if (this.isDeleting) return;
      this.isDeleteModalOpen = false;
      this.productToDelete = null;
    },

    async confirmDelete() {
      if (!this.productToDelete?.id) return;
      try {
        const id = this.productToDelete.id;
        this.deletingProductId = id;
        this.isDeleting = true;
        await this.deleteProduct(id); // Llama a la acción del store
        this.showFeedback("success", "Producto eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        this.showFeedback("error", "No se pudo eliminar el producto. Intenta nuevamente.");
      } finally {
        this.isDeleting = false;
        this.deletingProductId = null;
        this.closeDeleteModal();
      }
    },
  },
};
</script>
