<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
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
          class="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ product.name }}
          </th>
          <td class="px-6 py-4">{{ product.category }}</td>
          <td class="px-6 py-4">${{ product.price }}</td>
          <td class="px-6 py-4">{{ product.description }}</td>
          <td class="px-6 py-4">
            <nuxt-link
              :to="'admin/' + product.id"
              class="font-medium text-blue-600 hover:underline"
              >Edit</nuxt-link
            >
            <span
              @click="deleteDocument(product.id)"
              class="font-medium text-red-600 hover:underline"
              >Borrar</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { db } from "@/plugins/firebase";
export default {
  middleware:'auth',
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
      const response = db.collection("products").get();
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
    deleteDocument(id) {
      const ref = db.collection("products").doc(id);
      ref.delete();
      this.getDocuments();
    },
  },
};
</script>

<style></style>
