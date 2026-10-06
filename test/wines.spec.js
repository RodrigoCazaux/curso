import { test, expect } from 'vitest';
import { numericPrice, whatsappUrl, validateImage, productPayload, slugify, formatMoney } from '../lib/wines.js';
import { product } from './helpers/firebase.js';
test('precios y codificación de WhatsApp', () => {
  expect(formatMoney('1.500')).toContain('1.500'); expect(formatMoney('NaN')).toBe('Precio a confirmar');
  expect(numericPrice('1.500')).toBe(1500); expect(numericPrice('1500.50')).toBe(1500.5);
  expect(() => numericPrice('NaN')).toThrow(); expect(() => numericPrice('-1')).toThrow();
  const url = new URL(whatsappUrl([{ name: 'Vino & Cía #1', unitPrice: 1500, qty: 2 }], '59896260462'));
  expect(url.searchParams.get('text')).toContain('Vino & Cía #1'); expect([...url.searchParams.keys()]).toEqual(['text']);
  expect(slugify('Añada Reserva 2024')).toBe('anada-reserva-2024');
});
test('valida imágenes y unidades', () => {
  expect(() => validateImage({ type: 'text/html', size: 1 })).toThrow('JPG'); expect(() => validateImage({ type: 'image/jpeg', size: 6 * 1024 * 1024 })).toThrow('5 MB');
  expect(() => productPayload({ ...product, inventory_units: 1.5 }, { categories: [{ id: 'red', name: 'Tintos' }], bodegas: [{ id: 'estate', name: 'Bodega' }] })).toThrow('entero');
});
