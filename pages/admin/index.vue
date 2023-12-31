<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-white uppercase bg-secondary">
        <tr>
          <th scope="col" class="px-6 py-3">Product name</th>
          <th scope="col" class="px-6 py-3">Category</th>
          <th scope="col" class="px-6 py-3">Price</th>
          <th scope="col" class="px-6 py-3">Description</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in products"
          :key="product"
          class="bg-white border-b"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
          >
            {{ product.product_name }}
          </th>
          <td class="px-6 py-4">{{ product.product_categories }}</td>
          <td class="px-6 py-4">${{ product.variant_price }}</td>
          <td class="px-6 py-4">{{ product.product_description }}</td>
          <td class="px-6 py-4 flex items-center space-x-2">
            <nuxt-link
              :to="'admin/' + product.product_handle"
              class="font-medium text-secondary hover:underline"
              ><EditIcon class="w-5 h-5"
            /></nuxt-link>
            <span
              @click="deleteDocument(product.id)"
              class="font-medium text-primary hover:underline"
              ><TrashIcon class="w-5 h-5"
            /></span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { db } from "@/plugins/firebase";
import EditIcon from "~/components/shared/icons/EditIcon.vue";
import TrashIcon from "~/components/shared/icons/TrashIcon.vue";
export default {
  components: { EditIcon, TrashIcon },
  middleware: "auth",
  layout: "admin",
  data() {
    return {
      products: [],
    };
  },
  created() {
    this.getDocuments();
  },

  methods: {
    getDocuments() {
      this.products = [];
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // Dentro de tu método deleteDocument
    deleteDocument(id) {
      const ref = db.collection("Vinos").doc(id);

      // Obtener el documento para acceder a la referencia de la imagen
      ref
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            console.log("data", data);
            const imageUrl = data.main_variant_image; // Asegúrate de usar el campo correcto
            // Eliminar el documento de Firestore
            ref
              .delete()
              .then(() => {
                // Eliminar la imagen de Firebase Storage
                const storageRef = firebase.storage().refFromURL(imageUrl);
                storageRef
                  .delete()
                  .then(() => {
                    console.log("Imagen eliminada de Firebase Storage.");
                  })
                  .catch((error) => {
                    console.error("Error al eliminar la imagen:", error);
                  });
              })
              .catch((error) => {
                console.error("Error al eliminar el documento:", error);
              });
          } else {
            console.log("No se encontró el documento.");
          }
        })
        .catch((error) => {
          console.error("Error al obtener el documento:", error);
        });

      // Actualiza la lista de productos después de eliminar
      this.getDocuments();
    },
  },
};
</script>
