import { initializeFirebase } from "@/lib/firebase";

export default defineNuxtPlugin({
  name: "firebase",
  async setup() {
    if (import.meta.server) return;
    const config = useRuntimeConfig().public;
    await initializeFirebase(config.firebase, config.firebaseEmulators);
  },
});
