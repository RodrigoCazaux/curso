<template>
  <div class="space-y-6 max-w-3xl">
    <h1 class="text-2xl">Respaldo y mantenimiento</h1>
    <p v-if="error" role="alert" class="text-rose-700">{{ error }}</p>
    <p v-if="success" role="status" class="text-emerald-700">{{ success }}</p>
    <section class="rounded-xl border bg-white p-6 space-y-4">
      <h2 class="text-xl">Guardar una copia del catálogo</h2>
      <p>Descarga vinos, categorías y bodegas en un archivo JSON. Las fotos se incluyen como enlaces; para conservar sus archivos también necesitas un respaldo de Storage.</p>
      <button @click="exportBackup" :disabled="busy" class="rounded-lg bg-secondary text-white p-3 disabled:opacity-50">Descargar respaldo</button>
    </section>
    <section class="rounded-xl border bg-white p-6 space-y-4">
      <h2 class="text-xl">Actualizar referencias antiguas</h2>
      <p>Vincula cada vino con el identificador de su categoría y bodega. Se conservan los IDs y enlaces de los vinos. Los nombres ambiguos o sin coincidencia requieren revisión manual.</p>
      <button @click="preview" :disabled="busy" class="rounded-lg border p-3">Revisar cambios</button>
      <div v-if="plan" class="space-y-3">
        <p>{{ plan.changes.length }} vinos para actualizar. {{ plan.unresolved.length }} necesitan revisión manual.</p>
        <ul v-if="plan.unresolved.length" class="list-disc pl-6"><li v-for="item in plan.unresolved" :key="item.id"><nuxt-link :to="`/admin/${item.id}`">{{ item.name || item.id }}</nuxt-link></li></ul>
        <p v-if="plan.changes.length">Primero descarga un respaldo; después podrás aplicar los cambios.</p>
        <button v-if="plan.changes.length" @click="migrate" :disabled="busy || !backupDownloaded" class="rounded-lg bg-secondary text-white p-3 disabled:opacity-50">Aplicar actualización de referencias</button>
      </div>
    </section>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' });
const store = useNuxtApp().$store;
const busy = ref(false); const error = ref(''); const success = ref(''); const plan = ref(null); const backupDownloaded = ref(false);
async function run(task) { if (busy.value) return; busy.value = true; error.value = ''; success.value = ''; try { await task(); } catch (e) { error.value = e.message || 'No se pudo completar la operación.'; } finally { busy.value = false; } }
async function exportBackup() { await run(async () => {
  const backup = await store.dispatch('exportBackup');
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = `inquieto-respaldo-${new Date().toISOString().slice(0,10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  backupDownloaded.value = true; success.value = 'Respaldo descargado.';
}); }
async function preview() { await run(async () => { plan.value = await store.dispatch('planReferenceMigration'); backupDownloaded.value = false; }); }
async function migrate() { if (!backupDownloaded.value) return; await run(async () => { const result = await store.dispatch('migrateReferences'); plan.value = null; success.value = `Se actualizaron ${result.updated} vinos. ${result.unresolved.length} quedan para revisión manual.`; }); }
</script>
