export default defineNuxtConfig({
  hooks: {
    'build:before'() {
      const required = ['FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_PROJECT_ID', 'FIREBASE_STORAGE_BUCKET', 'FIREBASE_APP_ID'];
      const missing = required.filter(key => !process.env[key]);
      if (missing.length && process.env.FIREBASE_EMULATORS !== 'true') throw new Error(`Faltan variables de construcción: ${missing.join(', ')}. Configúralas en .env o Netlify.`);
    },
  },
  compatibilityDate: "2026-10-01",
  srcDir: ".",
  devtools: { enabled: false },
  components: [{ path: "~/components", pathPrefix: false }],
  plugins: ["~/plugins/firebase", "~/plugins/store"],
  css: ["~/assets/main.css"],
  modules: ["@nuxtjs/tailwindcss"],
  runtimeConfig: {
    public: {
      firebaseEmulators: process.env.FIREBASE_EMULATORS === "true",
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY || "",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
        projectId: process.env.FIREBASE_PROJECT_ID || "",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
        appId: process.env.FIREBASE_APP_ID || "",
      },
      siteUrl: process.env.SITE_URL || (process.env.SITE_NAME ? `https://${process.env.SITE_NAME}.netlify.app` : process.env.URL) || "http://localhost:3000",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "59896260462",
      currency: process.env.CURRENCY || "UYU",
    },
  },
  app: {
    head: {
      title: "Inquieto | Experiencias de vino",
      htmlAttrs: { lang: "es" },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Catas, maridajes y vinos finos uruguayos para disfrutar y aprender." },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Inquieto" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Karla:wght@300;400;500;700&display=swap" },
      ],
    },
  },
  routeRules: { "/admin/**": { ssr: false }, "/login": { ssr: false } },
  nitro: { prerender: { crawlLinks: false, routes: ["/", "/nosotros", "/catalogo"] } },
});
