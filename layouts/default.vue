<template>
  <div>
    <Header @click="cart" @openMobileMenu="openMenu"/>
    <MobileMenu v-if="showMobileMenu" @openMobileMenu="openMenu"/>
    <Cart @click="cart" :showCart="openCart" />
    <div class="px-10 md:px-32 py-16 bg-background">
      <nuxt />
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from "@/components/shared/Header.vue";
import MobileMenu from "@/components/shared/MobileMenu.vue";
import Cart from "@/components/shared/Cart.vue";
import eventBus from '@/plugins/eventBus';
import Footer from '~/components/shared/Footer.vue';
export default {
  components: {
    Header,
    Cart,
    Footer,
    MobileMenu
  },
  data() {
    return {
      openCart: false,
      showMobileMenu: false
    };
  },
  created() {
    // Escuchar el evento para abrir el carrito de compras
    eventBus.$on('addToCart', () => {
      this.openCart = true;
    });
  },
  methods: {
    cart() {
      this.openCart = !this.openCart;
    },
    openMenu(){
      console.log('in')
      this.showMobileMenu = !this.showMobileMenu;
    }
  },
};
</script>

<style></style>
