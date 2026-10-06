import { vi } from 'vitest';
export function fakeFirebase() {
  const data = { Vinos: {}, categories: { red: { name: 'Tintos', description: '' } }, bodegas: { estate: { name: 'Bodega', description: '' } } };
  const objects = new Map(); const events = []; let next = 0;
  const makeDoc = (collection, id) => {
    const snapshot = data[collection]?.[id] ? { ...data[collection][id] } : undefined;
    return { id, exists: !!snapshot, data: () => snapshot, ref: ref(collection, id) };
  };
  const ref = (collection, id) => ({
    id,
    get: vi.fn(async () => makeDoc(collection, id)),
    set: vi.fn(async payload => { events.push(`set:${collection}/${id}`); data[collection] ||= {}; data[collection][id] = { ...payload }; }),
    update: vi.fn(async patch => { if (!data[collection]?.[id]) throw new Error('not-found'); events.push(`update:${collection}/${id}`); Object.assign(data[collection][id], patch); }),
    delete: vi.fn(async () => { events.push(`delete:${collection}/${id}`); delete data[collection][id]; }),
  });
  const collection = (name, filters = [], max = Infinity) => ({
    doc: (id = `new-${++next}`) => ref(name, id),
    get: vi.fn(async () => { const docs = Object.entries(data[name] || {}).filter(([id, value]) => filters.every(([field, comparator, expected]) => value[field] === expected)).slice(0, max).map(([id]) => makeDoc(name, id)); return { docs, empty: !docs.length }; }),
    where: (field, comparator, expected) => collection(name, [...filters, [field, comparator, expected]], max),
    limit: count => collection(name, filters, count),
  });
  const db = { collection: vi.fn(collection), batch: () => { const changes = []; return { update: (ref, patch) => changes.push(() => ref.update(patch)), commit: async () => { for (const change of changes) await change(); } }; } };
  const storageRef = path => ({
    bucket: 'test-bucket', fullPath: path,
    put: vi.fn(async file => { events.push(`upload:${path}`); objects.set(path, file); }),
    getDownloadURL: vi.fn(async () => `https://storage.test/${path}`),
    delete: vi.fn(async () => { events.push(`delete-image:${path}`); objects.delete(path); }),
  });
  const user = { uid: 'dad', getIdTokenResult: vi.fn(async () => ({ claims: {} })) };
  const auth = { currentUser: user };
  const firestore = () => db;
  firestore.FieldValue = { serverTimestamp: () => ({ toMillis: () => 12345, toDate: () => new Date('2026-01-01') }) };
  const firebase = { auth: () => auth, firestore, storage: () => ({ ref: () => ({ child: storageRef }), refFromURL: url => storageRef(url.replace('https://storage.test/', '')) }) };
  const config = { currency: 'UYU', whatsappNumber: '59896260462', firebase: { projectId: 'demo-inquieto', storageBucket: 'test-bucket' } };
  return { data, objects, events, db, firebase, auth, config, ref };
}
export const product = { product_name: 'Tannat', product_description: 'Notas de cata', variant_price: '1500', product_year: '2024', product_cantidad: '750 ml', product_categories: 'Tintos', product_bodega: 'Bodega', main_variant_image: [], stock: true };
export const photo = () => new File(['photo'], 'bottle.jpg', { type: 'image/jpeg' });
