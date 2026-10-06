let db;
let firebase;
export async function initializeFirebase(config, emulators = false) {
  const required = ["apiKey", "authDomain", "projectId", "storageBucket", "appId"];
  const missing = required.filter((key) => !config[key]);
  if (missing.length) throw new Error(`Falta configurar Firebase: ${missing.join(", ")}. Revisa .env.`);
  firebase = (await import('firebase/compat/app')).default;
  await Promise.all([import('firebase/compat/auth'), import('firebase/compat/firestore'), import('firebase/compat/storage')]);
  if (!firebase.apps.length) firebase.initializeApp(config);
  db = firebase.firestore();
  if (emulators && !globalThis.__inquietoEmulators) {
    if (!config.projectId.startsWith('demo-')) throw new Error('Los emuladores requieren un proyecto demo- para evitar tocar producción.');
    db.useEmulator('127.0.0.1', 8080);
    firebase.storage().useEmulator('127.0.0.1', 9199);
    if (typeof window !== 'undefined') firebase.auth().useEmulator('http://127.0.0.1:9099', { disableWarnings: true });
    globalThis.__inquietoEmulators = true;
  }
}
export { firebase, db };
