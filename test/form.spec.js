import { test, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import WineForm from '../components/admin/WineForm.vue';
import { product, photo } from './helpers/firebase.js';
test('conserva los datos al fallar y bloquea envíos repetidos durante guardado', async () => {
  const wrapper = mount(WineForm, { props: { product, categories: [{ id: 'red', name: 'Tintos' }], bodegas: [{ id: 'estate', name: 'Bodega' }], error: '', busy: false }, global: { stubs: { 'nuxt-link': true } } });
  await wrapper.find('form').trigger('submit'); expect(wrapper.emitted('save')).toHaveLength(1);
  await wrapper.setProps({ busy: true }); await wrapper.find('form').trigger('submit'); expect(wrapper.emitted('save')).toHaveLength(1);
  await wrapper.setProps({ busy: false, error: 'No se pudo guardar' }); expect(wrapper.get('[role="alert"]').text()).toBe('No se pudo guardar'); expect(wrapper.find('input').element.value).toBe('Tannat');
});
test('un segundo reemplazo de la misma foto mantiene solo el último archivo', async () => {
  URL.createObjectURL = vi.fn(() => 'blob:preview'); URL.revokeObjectURL = vi.fn();
  const wrapper = mount(WineForm, { props: { product: { ...product, main_variant_image: ['https://old.test/photo'] }, categories: [{ id: 'red', name: 'Tintos' }], bodegas: [{ id: 'estate', name: 'Bodega' }] }, global: { stubs: { 'nuxt-link': true } } });
  const first = photo(); const last = photo();
  wrapper.vm.replaceImage({ target: { files: [first], value: '' } }, 0); wrapper.vm.replaceImage({ target: { files: [last], value: '' } }, 0);
  await wrapper.find('form').trigger('submit'); expect(wrapper.emitted('save')[0][0].changes).toHaveLength(1); expect(wrapper.emitted('save')[0][0].changes[0].file).toBe(last); wrapper.unmount(); expect(URL.revokeObjectURL).toHaveBeenCalled();
});
