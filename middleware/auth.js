import { firebase } from "@/plugins/firebase";

function waitForAuthState() {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
}

export default async function ({ redirect }) {
  try {
    const currentUser =
      firebase.auth().currentUser ||
      (process.client ? await waitForAuthState() : null);

    if (!currentUser) {
      return redirect("/login");
    }
  } catch (error) {
    console.error("Error verificando autenticación:", error);
    return redirect("/login");
  }
}
