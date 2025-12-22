const siteUrl = process.env.SITE_URL || "https://inquieto.com";

export default {
  mode: "universal",
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Inquieto | Experiencias de vino",
    htmlAttrs: {
      lang: "es",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "Inquieto difunde la cultura del vino con catas, maridajes y una selección de vinos finos uruguayos.",
      },
      { name: "format-detection", content: "telephone=no" },
      { hid: "og:type", property: "og:type", content: "website" },
      { hid: "og:site_name", property: "og:site_name", content: "Inquieto" },
      { hid: "og:title", property: "og:title", content: "Inquieto | Experiencias de vino" },
      {
        hid: "og:description",
        property: "og:description",
        content:
          "Catas, maridajes y vinos finos para disfrutar y aprender sobre el vino en Uruguay.",
      },
      { hid: "og:url", property: "og:url", content: siteUrl },
      { hid: "og:locale", property: "og:locale", content: "es" },
      { hid: "twitter:card", name: "twitter:card", content: "summary_large_image" },
      { hid: "twitter:title", name: "twitter:title", content: "Inquieto | Experiencias de vino" },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content:
          "Catas, maridajes y una curaduría de vinos finos uruguayos para cada ocasión.",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
      { rel: "canonical", href: siteUrl },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Karla:wght@300&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Karla:wght@400&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Karla:wght@500&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Karla:wght@700&display=swap',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/axios"],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
