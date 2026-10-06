// @vitest-environment node
import { beforeAll, beforeEach, afterAll, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, deleteObject } from 'firebase/storage';
let env;
const wine = () => ({ product_name: 'Tannat', variant_price: 1500, stock: true, archived: false, category_id: 'red', bodega_id: 'estate', product_categories: 'Tintos', product_bodega: 'Bodega', main_variant_image: [], createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
beforeAll(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-inquieto', firestore: { rules: readFileSync('firestore.rules', 'utf8') }, storage: { rules: readFileSync('storage.rules', 'utf8') } });
});
beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db, 'categories/red'), { name: 'Tintos', description: '' });
    await setDoc(doc(db, 'bodegas/estate'), { name: 'Bodega', description: '' });
    await setDoc(doc(db, 'Vinos/legacy'), { product_name: 'Antiguo', variant_price: '1500', stock: true, legacy_field: 'keep' });
  });
});
afterAll(async () => { await env?.cleanup(); });
test('catálogo público, visitantes sin permisos de escritura', async () => {
  const guest = env.unauthenticatedContext().firestore();
  await assertSucceeds(getDocs(collection(guest, 'Vinos')));
  await assertFails(setDoc(doc(guest, 'Vinos/new'), wine()));
  await assertFails(updateDoc(doc(guest, 'Vinos/legacy'), { stock: false, updatedAt: serverTimestamp() }));
  await assertFails(deleteDoc(doc(guest, 'Vinos/legacy')));
});
test('colecciones ajenas al catálogo permanecen inaccesibles incluso con sesión', async () => {
  const db = env.authenticatedContext('any-account').firestore();
  await assertFails(setDoc(doc(db, 'admins/self'), { active: true }));
  await assertFails(getDoc(doc(db, 'admins/self')));
  await assertFails(getDocs(collection(db, 'admins')));
});
test('cualquier cuenta autenticada administra sin UID ni custom claim', async () => {
  const db = env.authenticatedContext('any-account').firestore();
  await assertSucceeds(setDoc(doc(db, 'Vinos/new'), wine()));
  await assertSucceeds(updateDoc(doc(db, 'Vinos/new'), { stock: false, archived: true, updatedAt: serverTimestamp() }));
  await assertSucceeds(deleteDoc(doc(db, 'Vinos/new')));
  await assertSucceeds(setDoc(doc(db, 'categories/white'), { name: 'Blancos', description: '', updatedAt: serverTimestamp() }));
  await assertSucceeds(setDoc(doc(db, 'bodegas/another'), { name: 'Otra bodega', description: '', updatedAt: serverTimestamp() }));
});
test('rechaza datos inválidos, referencias inexistentes y cambios de fecha original', async () => {
  const db = env.authenticatedContext('dad').firestore();
  await assertFails(setDoc(doc(db, 'Vinos/negative'), { ...wine(), variant_price: -1 }));
  await assertFails(setDoc(doc(db, 'Vinos/wrong'), { ...wine(), variant_price: '1500' }));
  await assertFails(setDoc(doc(db, 'Vinos/unknown'), { ...wine(), category_id: 'missing' }));
  await assertFails(setDoc(doc(db, 'Vinos/units'), { ...wine(), inventory_units: -1 }));
  await assertSucceeds(setDoc(doc(db, 'Vinos/new'), wine()));
  await assertFails(updateDoc(doc(db, 'Vinos/new'), { createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(doc(db, 'Vinos/new'), { arbitrary: true, updatedAt: serverTimestamp() }));
});
test('normaliza referencias antiguas y requiere archivado antes del borrado definitivo', async () => {
  const db = env.authenticatedContext('dad').firestore();
  await assertSucceeds(updateDoc(doc(db, 'Vinos/legacy'), { category_id: 'red', product_categories: 'Tintos', bodega_id: 'estate', product_bodega: 'Bodega', archived: false, updatedAt: serverTimestamp() }));
  await assertFails(deleteDoc(doc(db, 'Vinos/legacy')));
  await assertSucceeds(updateDoc(doc(db, 'Vinos/legacy'), { archived: true, updatedAt: serverTimestamp() }));
  await assertSucceeds(deleteDoc(doc(db, 'Vinos/legacy')));
});
test('Storage restringe permisos, tipo y tamaño y admite eliminación separada', async () => {
  const path = 'products/test/bottle.jpg'; const jpeg = new Uint8Array([255, 216, 255]);
  await assertFails(uploadBytes(ref(env.unauthenticatedContext().storage(), path), jpeg, { contentType: 'image/jpeg' }));
  await assertSucceeds(uploadBytes(ref(env.authenticatedContext('outsider').storage(), path), jpeg, { contentType: 'image/jpeg' }));
  const storage = env.authenticatedContext('dad').storage();
  await assertSucceeds(uploadBytes(ref(storage, path), jpeg, { contentType: 'image/jpeg' }));
  await assertFails(uploadBytes(ref(storage, 'products/test/file.html'), jpeg, { contentType: 'text/html' }));
  await assertFails(uploadBytes(ref(storage, 'products/test/large.jpg'), new Uint8Array(5 * 1024 * 1024 + 1), { contentType: 'image/jpeg' }));
  await assertFails(uploadBytes(ref(storage, 'other/photo.jpg'), jpeg, { contentType: 'image/jpeg' }));
  await assertFails(deleteObject(ref(env.unauthenticatedContext().storage(), path)));
  await assertSucceeds(deleteObject(ref(env.authenticatedContext('outsider').storage(), path)));
  await assertSucceeds(uploadBytes(ref(storage, path), jpeg, { contentType: 'image/jpeg' }));
  await assertSucceeds(deleteObject(ref(storage, path)));
});
