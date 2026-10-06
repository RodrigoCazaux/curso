import { mkdir, readFile, writeFile } from 'node:fs/promises';
await mkdir('generated-rules', { recursive: true });
for (const file of ['firestore.rules', 'storage.rules']) {
  const template = await readFile(file, 'utf8');
  await writeFile(`generated-rules/${file}`, template);
}
await writeFile('firebase.production.json', JSON.stringify({ firestore: { rules: 'generated-rules/firestore.rules' }, storage: { rules: 'generated-rules/storage.rules' } }, null, 2) + '\n');
console.log('Reglas preparadas: todas las cuentas autenticadas administran. Desactiva el registro público en Firebase antes de publicarlas. No se ha desplegado ningún cambio.');
