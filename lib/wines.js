export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES = 8;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export function validateImage(file) {
  if (!file || !IMAGE_TYPES.includes(file.type)) throw new Error('Usa una foto JPG, PNG o WebP.');
  if (file.size > MAX_IMAGE_BYTES || file.size <= 0) throw new Error('Cada foto debe pesar entre 1 byte y 5 MB.');
}
export function numericPrice(value) {
  const text = String(value ?? '').trim();
  // Existing admin stored plain integers; accept old thousands-formatted values too.
  const normalized = /^\d{1,3}(\.\d{3})+$/.test(text) ? text.replaceAll('.', '') : text;
  const price = Number(normalized);
  if (!text || !Number.isFinite(price) || price < 0 || price > 100000000) throw new Error('Introduce un precio válido, entre 0 y 100.000.000.');
  return Math.round(price * 100) / 100;
}
export function formatMoney(value, currency = 'UYU') {
  let price;
  try { price = numericPrice(value); } catch { return 'Precio a confirmar'; }
  return new Intl.NumberFormat('es-UY', { style: 'currency', currency }).format(price);
}
export function slugify(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
export function productPayload(product, { categories = [], bodegas = [], allowLocalImages = false } = {}) {
  const name = String(product.product_name || '').trim();
  if (!name || name.length > 200) throw new Error('El nombre del vino es obligatorio (máximo 200 caracteres).');
  const year = String(product.product_year ?? '').trim();
  if (year && (!/^\d{4}$/.test(year) || Number(year) < 1900 || Number(year) > new Date().getFullYear() + 1)) throw new Error('Introduce una añada válida o deja el campo vacío.');
  const units = product.inventory_units === '' || product.inventory_units == null ? null : Number(product.inventory_units);
  if (units !== null && (!Number.isSafeInteger(units) || units < 0 || units > 1000000)) throw new Error('Las unidades disponibles deben ser un número entero entre 0 y 1.000.000.');
  const category = categories.find(item => item.id === product.category_id) || categories.find(item => item.name === product.product_categories);
  const bodega = bodegas.find(item => item.id === product.bodega_id) || bodegas.find(item => item.name === product.product_bodega);
  if (!category || !bodega) throw new Error('Selecciona una categoría y una bodega existentes.');
  const description = String(product.product_description || '').trim();
  if (description.length > 10000) throw new Error('La descripción no debe superar los 10.000 caracteres.');
  const volume = String(product.product_cantidad || '').trim();
  if (volume.length > 100) throw new Error('El volumen no debe superar los 100 caracteres.');
  const images = product.main_variant_image || [];
  if (!Array.isArray(images) || images.length > MAX_IMAGES || images.some(url => typeof url !== 'string' || (!url.startsWith('https://') && !(allowLocalImages && url.startsWith('http://127.0.0.1:9199/'))))) throw new Error('Las fotos deben estar subidas antes de guardar (máximo 8).');
  return {
    product_name: name, product_handle: product.product_handle || slugify(name),
    product_description: description, variant_price: numericPrice(product.variant_price),
    product_year: year, product_cantidad: volume, category_id: category.id, bodega_id: bodega.id,
    product_categories: category.name, product_bodega: bodega.name,
    main_variant_image: images, inventory_units: units,
    stock: units === 0 ? false : product.stock !== false,
    archived: product.archived === true,
  };
}
export function isAvailable(product) {
  return !!product?.id && product.archived !== true && product.stock !== false && product.inventory_units !== 0;
}
export function whatsappUrl(items, number, currency = 'UYU') {
  const phone = String(number).replace(/\D/g, '');
  if (!/^\d{8,15}$/.test(phone)) throw new Error('Revisa el número de WhatsApp en la configuración.');
  if (!items.length) throw new Error('Añade un vino antes de enviar el pedido.');
  const lines = items.map(item => `${item.qty} × ${item.name}: ${formatMoney(item.unitPrice * item.qty, currency)}`);
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  return `https://wa.me/${phone}?text=${encodeURIComponent(`Hola, quisiera pedir:\n${lines.join('\n')}\nSubtotal: ${formatMoney(total, currency)}`)}`;
}
