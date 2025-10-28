<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Bodegas</h1>
        <p class="text-sm text-gray-500">
          Crea, edita y elimina las bodegas disponibles para tus productos.
        </p>
      </div>
      <button
        v-if="isEditing"
        type="button"
        @click="resetForm"
        class="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
      >
        Cancelar edición
      </button>
    </div>

    <div
      v-if="feedback.message"
      :class="feedback.type === 'success'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-rose-50 text-rose-700 border-rose-200'"
      class="rounded-md border px-4 py-3 text-sm flex items-center justify-between"
    >
      <span>{{ feedback.message }}</span>
      <button type="button" class="text-xs uppercase tracking-wide" @click="clearFeedback">Cerrar</button>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">
        {{ isEditing ? "Editar bodega" : "Agregar nueva bodega" }}
      </h2>
      <form class="grid gap-4 md:grid-cols-2" @submit.prevent="handleSubmit">
        <div class="md:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1" for="bodega-name">Nombre</label>
          <input
            id="bodega-name"
            v-model.trim="form.name"
            type="text"
            required
            placeholder="Ej. Viña El Encanto"
            class="w-full rounded-md border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
          />
        </div>
        <div class="md:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1" for="bodega-description">Descripción</label>
          <input
            id="bodega-description"
            v-model.trim="form.description"
            type="text"
            placeholder="Información opcional"
            class="w-full rounded-md border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
          />
        </div>
        <div class="md:col-span-2 flex justify-end gap-3">
          <button
            v-if="isEditing"
            type="button"
            @click="resetForm"
            class="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? "Guardando..." : isEditing ? "Actualizar bodega" : "Crear bodega" }}
          </button>
        </div>
      </form>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 class="text-base font-semibold text-gray-900">Listado de bodegas</h2>
          <p class="text-xs uppercase text-gray-500">{{ bodegasList.length }} bodegas registradas</p>
        </div>
      </div>
      <div v-if="isLoading" class="px-6 py-10 text-center text-sm text-gray-500">
        Cargando bodegas…
      </div>
      <table v-else class="min-w-full divide-y divide-gray-100">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white">
          <tr v-for="bodega in bodegasList" :key="bodega.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">
              {{ bodega.name }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ bodega.description || "—" }}
            </td>
            <td class="px-6 py-4 text-sm text-right space-x-3">
              <button
                type="button"
                class="text-secondary hover:opacity-80"
                @click="startEdit(bodega)"
              >
                Editar
              </button>
              <button
                type="button"
                class="text-rose-600 hover:text-rose-500 disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="isDeleting && deletingBodegaId === bodega.id"
                @click="requestDelete(bodega)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!isLoading && !bodegasList.length" class="px-6 py-10 text-center text-sm text-gray-500">
        Aún no tienes bodegas registradas. Usa el formulario superior para crear la primera.
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40 px-4"
    >
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Eliminar bodega</h3>
        </div>
        <div class="px-6 py-5 text-sm text-gray-600 space-y-2">
          <p>
            ¿Estás seguro de que quieres eliminar la bodega
            <span class="font-semibold text-gray-900">“{{ bodegaToDelete?.name }}”</span>?
          </p>
          <p>Esta acción no se puede deshacer.</p>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white transition"
            @click="closeDeleteModal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="isDeleting"
            @click="confirmDelete"
          >
            {{ isDeleting ? "Eliminando..." : "Eliminar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  middleware: "auth",
  layout: "admin",
  data() {
    return {
      form: {
        id: null,
        name: "",
        description: "",
      },
      isEditing: false,
      isSubmitting: false,
      isDeleting: false,
      isLoading: false,
      deletingBodegaId: null,
      showDeleteModal: false,
      bodegaToDelete: null,
      feedback: {
        type: null,
        message: "",
      },
      feedbackTimeout: null,
    };
  },
  computed: {
    ...mapState(["bodegas"]),
    bodegasList() {
      return Array.isArray(this.bodegas) ? this.bodegas : [];
    },
  },
  created() {
    this.loadBodegas();
  },
  beforeDestroy() {
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
  },
  methods: {
    ...mapActions(["fetchBodegas", "addBodega", "updateBodega", "deleteBodega"]),

    async loadBodegas() {
      try {
        this.isLoading = true;
        await this.fetchBodegas();
      } catch (error) {
        console.error("Error al cargar bodegas:", error);
        this.showFeedback("error", "No se pudieron cargar las bodegas. Intenta nuevamente.");
      } finally {
        this.isLoading = false;
      }
    },

    async handleSubmit() {
      if (this.isSubmitting) return;
      try {
        this.isSubmitting = true;
        const payload = { ...this.form };
        if (this.isEditing) {
          await this.updateBodega(payload);
          this.showFeedback("success", "Bodega actualizada correctamente.");
        } else {
          await this.addBodega(payload);
          this.showFeedback("success", "Bodega creada correctamente.");
        }
        this.resetForm();
      } catch (error) {
        this.showFeedback(
          "error",
          error?.message || "Ocurrió un error al guardar la bodega. Intenta nuevamente."
        );
      } finally {
        this.isSubmitting = false;
      }
    },

    startEdit(bodega) {
      this.form = {
        id: bodega.id,
        name: bodega.name || "",
        description: bodega.description || "",
      };
      this.isEditing = true;
    },

    resetForm() {
      this.form = {
        id: null,
        name: "",
        description: "",
      };
      this.isEditing = false;
    },

    requestDelete(bodega) {
      this.bodegaToDelete = bodega;
      this.deletingBodegaId = bodega?.id || null;
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.bodegaToDelete = null;
      this.deletingBodegaId = null;
    },

    async confirmDelete() {
      if (!this.bodegaToDelete?.id || this.isDeleting) return;
      try {
        this.isDeleting = true;
        await this.deleteBodega(this.bodegaToDelete.id);
        this.showFeedback("success", "Bodega eliminada correctamente.");
        this.closeDeleteModal();
      } catch (error) {
        console.error("Error al eliminar bodega:", error);
        this.showFeedback(
          "error",
          error?.message || "No se pudo eliminar la bodega. Intenta nuevamente."
        );
      } finally {
        this.isDeleting = false;
        this.deletingBodegaId = null;
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
  },
};
</script>
