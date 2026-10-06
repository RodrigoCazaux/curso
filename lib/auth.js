export function waitForAuth(auth) {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  return new Promise((resolve, reject) => {
    let unsubscribe;
    unsubscribe = auth.onAuthStateChanged(user => { unsubscribe?.(); resolve(user); }, error => { unsubscribe?.(); reject(error); });
  });
}
