import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc } from 'firebase/firestore';
let env;
const email = 'padre@example.test'; const password = 'Test-password-123';
test.beforeAll(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-inquieto', firestore: { rules: readFileSync('firestore.rules', 'utf8') }, storage: { rules: readFileSync('storage.rules', 'utf8') } });
  await fetch('http://127.0.0.1:9099/emulator/v1/projects/demo-inquieto/accounts', { method: 'DELETE' });
  const signup = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true }) });
  const user = await signup.json();
  if (!user.localId) throw new Error('No se pudo preparar el usuario de prueba.');
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db, 'categories/red'), { name: 'Tintos', description: '' });
    await setDoc(doc(db, 'bodegas/estate'), { name: 'Bodega', description: '' });
    const wine = { product_name: 'Tannat de prueba', product_description: 'Notas de cata', product_year: '2024', product_cantidad: '750 ml', category_id: 'red', product_categories: 'Tintos', bodega_id: 'estate', product_bodega: 'Bodega', variant_price: 1500, main_variant_image: [], stock: true, archived: false, inventory_units: 12 };
    await setDoc(doc(db, 'Vinos/wine'), wine);
    await setDoc(doc(db, 'Vinos/archived'), { ...wine, product_name: 'Vino archivado', archived: true });
  });
});
test.afterAll(async () => env?.cleanup());
async function login(page) {
  await page.goto('/login'); await page.getByLabel('Correo electrónico').fill(email); await page.getByLabel('Contraseña', { exact: true }).fill(password); await page.getByRole('button', { name: 'Entrar', exact: true }).click(); await expect(page).toHaveURL(/\/admin$/);
}
test('catálogo, enlace directo y total correcto al añadir dos veces', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/catalogo'); await expect(page.getByText('Tannat de prueba', { exact: true })).toBeVisible(); await expect(page.getByText('Vino archivado', { exact: true })).toHaveCount(0);
  await page.goto('/wine'); await expect(page.getByRole('heading', { name: 'Tannat de prueba' })).toBeVisible();
  await page.getByRole('button', { name: 'Agregar al carrito', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible(); await expect(page.getByText(/Subtotal:.*1\.500/)).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar pedido' }).click(); await page.getByRole('button', { name: 'Agregar al carrito', exact: true }).click(); await expect(page.getByText(/Subtotal:.*3\.000/)).toBeVisible();
  await page.screenshot({ path: `test-results/carrito-${test.info().project.name}.png`, fullPage: true });
  expect(errors).toEqual([]);
});
test('protege el panel y permite crear, editar, archivar, restaurar y exportar', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/admin/create'); await expect(page).toHaveURL(/\/login/); await login(page);
  await page.goto('/admin/create'); await page.getByLabel('Nombre del vino').fill('Reserva creada'); await page.getByLabel('Bodega', { exact: true }).selectOption('estate'); await page.getByLabel('Categoría', { exact: true }).selectOption('red'); await page.getByLabel(/Precio \(/).fill('1800');
  await page.getByRole('button', { name: 'Guardar vino', exact: true }).click(); await expect(page).toHaveURL(/\/admin\?created=1/); await expect(page.getByText('Reserva creada', { exact: true })).toBeVisible();
  let row = page.getByRole('row').filter({ hasText: 'Reserva creada' }); await row.getByRole('spinbutton').fill('1900'); await row.getByRole('button', { name: 'Guardar', exact: true }).click(); await expect(page.getByRole('status')).toContainText('Precio guardado'); await row.getByRole('link', { name: 'Editar' }).click(); await page.getByLabel('Añada').fill('2025'); await page.getByLabel('Unidades disponibles').fill('0'); await page.getByRole('button', { name: 'Guardar vino', exact: true }).click(); await expect(page.getByText('Vino guardado correctamente.')).toBeVisible(); await expect(page.getByLabel('Disponible para pedidos')).not.toBeChecked(); await page.getByLabel('Unidades disponibles').fill('6'); await page.getByLabel('Disponible para pedidos').check(); await page.getByRole('button', { name: 'Guardar vino', exact: true }).click(); await expect(page.getByText('Vino guardado correctamente.')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `test-results/editar-${test.info().project.name}.png`, fullPage: true });
  await page.getByRole('link', { name: 'Volver al catálogo' }).click(); row = page.getByRole('row').filter({ hasText: 'Reserva creada' }); await row.getByRole('button', { name: 'Archivar', exact: true }).click(); await expect(row).toHaveCount(0);
  await page.getByLabel('Estado', { exact: true }).selectOption('archived'); row = page.getByRole('row').filter({ hasText: 'Reserva creada' }); await expect(row).toBeVisible(); await row.getByRole('button', { name: 'Restaurar', exact: true }).click(); await expect(row).toHaveCount(0);
  await page.goto('/admin/backup'); const downloadPromise = page.waitForEvent('download'); await page.getByRole('button', { name: 'Descargar respaldo', exact: true }).click(); const download = await downloadPromise; expect(download.suggestedFilename()).toMatch(/inquieto-respaldo/);
  expect(errors).toEqual([]);
});
test('reemplaza dos fotos con el mismo nombre sin perderlas', async ({ page }) => {
  await login(page); await page.goto('/admin/create'); await page.getByLabel('Nombre del vino').fill('Vino con foto'); await page.getByLabel('Bodega', { exact: true }).selectOption('estate'); await page.getByLabel('Categoría', { exact: true }).selectOption('red'); await page.getByLabel(/Precio \(/).fill('1200');
  const png = { name: 'botella.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64') };
  await page.getByLabel('Añadir fotos').setInputFiles(png); await page.getByRole('button', { name: 'Guardar vino', exact: true }).click(); await expect(page).toHaveURL(/\/admin\?created=1/);
  await page.getByRole('row').filter({ hasText: 'Vino con foto' }).getByRole('link', { name: 'Editar' }).click(); await expect(page).toHaveURL(/\/admin\/[^/?]+$/); const id = page.url().split('/').pop();
  let before; await env.withSecurityRulesDisabled(async context => { before = (await getDoc(doc(context.firestore(), `Vinos/${id}`))).data().main_variant_image[0]; });
  await page.getByLabel('Reemplazar foto 1').setInputFiles(png); await page.getByRole('button', { name: 'Guardar vino', exact: true }).click(); await expect(page.getByText('Vino guardado correctamente.')).toBeVisible();
  let after; await env.withSecurityRulesDisabled(async context => { after = (await getDoc(doc(context.firestore(), `Vinos/${id}`))).data().main_variant_image[0]; });
  expect(after).not.toBe(before); expect((await fetch(after)).status).toBe(200); expect((await fetch(before)).status).toBe(404);
});
test('duplicar conserva datos y copia fotos independientes sin activar disponibilidad', async ({ page }) => {
  const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
  const photoRef = ref(env.authenticatedContext('fixture', { admin: true }).storage('gs://demo-inquieto.appspot.com'), 'products/source/photo.png');
  await uploadBytes(photoRef, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64'), { contentType: 'image/png' });
  const sourceUrl = await getDownloadURL(photoRef);
  await env.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), 'Vinos/source'), { product_name: 'Vino para duplicar', product_description: 'Notas originales', product_year: '2024', product_cantidad: '750 ml', category_id: 'red', product_categories: 'Tintos', bodega_id: 'estate', product_bodega: 'Bodega', variant_price: 1500, main_variant_image: [sourceUrl], stock: true, archived: false, inventory_units: 10 });
  });
  await login(page);
  await page.getByRole('row').filter({ hasText: 'Vino para duplicar' }).getByRole('button', { name: 'Duplicar', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/[^/?]+$/);
  await expect(page.getByLabel('Nombre del vino')).toHaveValue('Vino para duplicar (copia)');
  await expect(page.getByLabel('Disponible para pedidos')).not.toBeChecked();
  const id = page.url().split('/').pop();
  await env.withSecurityRulesDisabled(async context => {
    const copy = (await getDoc(doc(context.firestore(), `Vinos/${id}`))).data();
    expect(copy.main_variant_image[0]).not.toBe(sourceUrl); expect(copy.inventory_units).toBeNull(); expect(copy.product_description).toBe('Notas originales');
    expect((await fetch(copy.main_variant_image[0])).status).toBe(200); expect((await fetch(sourceUrl)).status).toBe(200);
  });
});
test('cualquier cuenta autenticada puede entrar al panel y la recuperación funciona', async ({ page }) => {
  const outsider = 'visitante@example.test';
  await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: outsider, password, returnSecureToken: true }) });
  await page.goto('/login'); await page.getByLabel('Correo electrónico').fill(outsider); await page.getByLabel('Contraseña', { exact: true }).fill(password); await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.reload(); await expect(page.getByRole('heading', { name: 'Catálogo de vinos', exact: true })).toBeVisible();
  await page.goto('/login');
  await page.getByLabel('Correo electrónico').fill(email); await page.getByRole('button', { name: 'Olvidé mi contraseña' }).click(); await expect(page.getByRole('status')).toContainText('recibirás un enlace');
});
