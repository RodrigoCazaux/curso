import createWineStore from "@/store";
import { db, firebase } from "@/lib/firebase";
export default defineNuxtPlugin({
  name: "store",
  dependsOn: ["firebase"],
  setup(nuxtApp) {
    const store = createWineStore({ db, firebase, config: useRuntimeConfig().public });
    nuxtApp.vueApp.use(store);
    return { provide: { store } };
  },
});
