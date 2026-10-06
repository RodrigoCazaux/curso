# Inquieto — gestión de vinos

Sitio estático con Nuxt 4, Vue 3 y Firebase (Authentication, Firestore y Storage). Conserva las colecciones `Vinos`, `categories` y `bodegas`, los documentos existentes y los enlaces `/<id>`.

## Desarrollo

Requiere Node 22 actualizado o una versión LTS posterior.

```sh
npm ci
cp .env.example .env
# Completar la configuración del proyecto Firebase en .env.
npm run dev
```

El `.env` local de este workspace ya está configurado con el proyecto existente, moneda UYU, WhatsApp confirmado. Se ignora por Git. No copiarlo a documentación, issues o logs.

Las variables de Firebase son **configuración web pública**, no credenciales administrativas. Nuxt las incluye en el navegador bajo `runtimeConfig.public`. La protección de los datos depende de las reglas de Firebase, no de ocultar la API key. No colocar claves privadas, contraseñas ni service accounts en variables públicas. [Referencia oficial](https://firebase.google.com/docs/projects/api-keys).

| Variable | Uso |
| --- | --- |
| `FIREBASE_API_KEY` | API key de la aplicación web |
| `FIREBASE_AUTH_DOMAIN` | Dominio de Authentication |
| `FIREBASE_PROJECT_ID` | Proyecto Firebase |
| `FIREBASE_STORAGE_BUCKET` | Bucket de fotografías |
| `FIREBASE_MESSAGING_SENDER_ID` | Identificador del remitente |
| `FIREBASE_APP_ID` | Identificador de la aplicación web |
| `SITE_URL` | Opcional: URL para metadatos; vacía detecta `SITE_NAME` de Netlify y usa su dominio gratuito |
| `WHATSAPP_NUMBER` | Número internacional con código de país |
| `CURRENCY` | Moneda ISO; actualmente UYU |

Cambiar variables de un sitio estático requiere regenerar y desplegar el sitio.

## Activar seguridad en el proyecto existente

Todas las cuentas de Firebase Authentication administran el catálogo, según el modelo de cuentas creadas manualmente. No hay roles adicionales, lista de UIDs ni colección `admins`. El panel, el store y las reglas requieren sesión para escribir.

**Antes de publicar estas reglas, desactivar el alta de usuarios por usuarios finales en Firebase Authentication → Settings → User actions.** Dejar habilitado correo/contraseña para iniciar sesión con cuentas existentes y desactivar proveedores que no se utilicen, especialmente el anónimo. No basta con omitir el formulario de registro: Firebase permite registrarse mediante su API por defecto. Crear cuentas nuevas desde Authentication → Usuarios → Añadir usuario. Si no aparece el ajuste de User actions, comprobar la configuración de Authentication con Identity Platform; no publicar la política de cualquier usuario autenticado mientras el registro público siga abierto. [Documentación de Firebase](https://firebase.google.com/docs/auth/users#user_self-service).

1. Revisar/exportar las reglas actualmente publicadas y respaldar datos/fotos.
2. Desactivar el registro público y verificar que una petición de alta desde un cliente devuelve `auth/admin-restricted-operation`, mientras una cuenta existente puede iniciar sesión.
3. Preparar y revisar las reglas:

   ```sh
   npm run rules:prepare
   ```

   Copia las reglas versionadas a `generated-rules/` y crea `firebase.production.json`, ignorados por Git. No requiere UID ni credenciales administrativas.

4. Publicar las reglas revisadas mediante la consola o la CLI autenticada:

   ```sh
   npx firebase deploy --only firestore:rules,storage --project curso-aa826 --config firebase.production.json
   ```

   Este comando cambia la política de producción. No se ejecutó durante la implementación.

5. Comprobar lectura sin sesión, denegación de escrituras sin sesión y gestión con cada cuenta creada a mano. Revisar los dominios autorizados y restricciones de la API key.

Para retirar acceso, deshabilitar la cuenta en Authentication y revocar sus sesiones; los tokens ya emitidos pueden seguir válidos hasta su expiración. Archivar oculta vinos en la tienda y conserva su recuperación; los campos del catálogo y sus imágenes siguen siendo públicos. No guardar datos privados ni datos de clientes en `Vinos`.

Las reglas validan tipos y límites de los campos cambiados para permitir actualizar documentos antiguos sin borrar sus campos legacy. Las categorías/bodegas utilizadas se protegen contra eliminación desde el panel; las reglas no pueden hacer una búsqueda inversa de todos los vinos para verificar esa relación.

## Panel

- `/login`: inicio de sesión en español y recuperación de contraseña real.
- `/admin`: búsqueda y filtros, precio y disponibilidad rápidos, duplicado, archivado/restauración. El borrado definitivo solo se ofrece para archivados y pide confirmación.
- `/admin/create` y `/admin/<id>`: formulario validado, añada, volumen, unidades opcionales y fotos con vista previa. Guarda sin perder los valores al fallar.
- `/admin/categories` y `/admin/bodegas`: referencias estables; los cambios de nombre actualizan vinos asociados en un lote atómico de hasta 400 vinos. Si hay más, se bloquea el cambio y se necesita una migración por lotes.
- `/admin/backup`: exportación JSON y revisión/aplicación de referencias antiguas. Exige descargar respaldo antes de migrar; los nombres ambiguos o inexistentes se dejan para revisión manual. La migración es repetible y conserva los IDs.

Los documentos antiguos se vinculan por su nombre al editarlos o mediante la migración. Los nuevos guardan `category_id` y `bodega_id` junto con el nombre, para mantener compatible el catálogo. Los vinos duplicados copian sus fotos a rutas independientes y empiezan sin disponibilidad: revisar añada, precio y existencias antes de activarlos.

`product_cantidad` es el volumen de botella. `inventory_units` es un entero opcional; cero desactiva la disponibilidad. Los pedidos por WhatsApp revalidan precio y disponibilidad antes de salir, pero **no reservan ni descuentan existencias**. El carrito se mantiene durante la sesión de la página; no se persiste al recargar.

Las fotos admiten JPG/PNG/WebP, hasta 5 MB y 8 fotos por vino. Se guardan con nombres únicos. Al reemplazar, primero se confirma la referencia nueva y después se elimina la antigua; si falla el guardado se limpian las subidas nuevas. Un fallo de limpieza se registra como advertencia y no revierte un vino ya guardado.

## Respaldo y recuperación

La exportación JSON contiene todas las colecciones del catálogo, IDs y timestamps tipados. Incluye URLs de fotografías, **no sus archivos**, ni usuarios de Authentication. Para un respaldo completo, exportar Firestore/Authentication y copiar el bucket con herramientas de Firebase/Google Cloud. Conservar la exportación JSON en un lugar seguro y respaldado. La restauración de un JSON completo debe realizarse con una herramienta administrativa confiable, después de revisar el proyecto y los cambios; no hay importación masiva desde el navegador.

Para recuperar un vino archivado, elegir Estado → Archivados → Restaurar. El borrado definitivo no es recuperable desde el panel.

## Netlify

`netlify.toml` define:

- Construcción: `npm run generate`.
- Directorio publicado: `.output/public`.
- La generación fija `--preset static`: sin él, la detección automática de Netlify cambia la salida a `dist`, incompatible con el directorio publicado.
- Node 22.
- Fallback a `/200.html` para que vinos nuevos y rutas administrativas funcionen por enlace directo sin reconstruir el catálogo.
- Cabeceras básicas de seguridad.

Copiar las variables de `.env` al entorno de **construcción** del sitio en Netlify antes del primer despliegue. El `.env` no viaja con Git y un clon nuevo necesita su configuración. Las páginas generales se prerenderizan; el catálogo y las fichas cargan datos actuales de Firebase en el navegador. Los metadatos de un vino se actualizan en el cliente: si se necesitan previews sociales o SEO de cada vino renderizados en servidor, añadir prerenderizado de productos o un backend en otra fase.

### Volver al dominio gratuito de Netlify

1. Abrir el proyecto en Netlify → **Domain management → Production domains**. Allí aparece su dirección `<nombre-del-proyecto>.netlify.app`.
2. En las opciones de `inquietovinos.online` y de su alias `www`, eliminar esos dominios personalizados del proyecto. El sitio conserva su dirección gratuita; no hace falta comprar ni configurar DNS para ella.
3. En **Project configuration → Environment variables**, quitar cualquier `SITE_URL` con un dominio viejo, o poner la URL gratuita completa. Si se deja sin configurar, el código usa `https://<SITE_NAME>.netlify.app`; Netlify proporciona `SITE_NAME` automáticamente durante la construcción. Localmente usa `http://localhost:3000`.
4. En Firebase → Authentication → Settings → Authorized domains, añadir `<nombre-del-proyecto>.netlify.app` sin `https://`. Revisar también los enlaces de recuperación de contraseña para que no apunten al dominio perdido.
5. Volver a construir/desplegar y comprobar portada, un enlace directo a un vino, `/login` y recuperación de contraseña.

`SITE_URL` solo configura metadatos/enlaces canónicos: no asigna el dominio ni modifica DNS. El dominio real anterior era `inquietovinos.online`; el fallback `inquieto.com` del código era incorrecto y se eliminó. [Dominios en Netlify](https://docs.netlify.com/manage/domains/domains-fundamentals/domains-glossary/) · [Variables automáticas](https://docs.netlify.com/build/configure-builds/environment-variables/).

## Pruebas

```sh
npm test
npm run generate
```

Las pruebas del store/formulario simulan Firebase y no usan producción. Las pruebas de reglas y navegador requieren Java 21 y emuladores; solo utilizan `demo-inquieto`:

```sh
npm run test:rules
npm run test:e2e
# Todos los tests, incluidos permisos y navegador:
npm run test:integration
```

Para las pruebas de navegador, instalar Chromium con `npx playwright install chromium` o indicar `PLAYWRIGHT_CHROME_PATH` con la ruta del Chrome instalado. Cubren catálogo, enlace directo, carrito, acceso administrativo, alta/edición/archivado/restauración, exportación y reemplazo de fotos con igual nombre, en escritorio y móvil.

Se sustituyeron las pruebas y dependencias de Nuxt/Vue 2 por Vitest, Vue Test Utils para Vue 3 y Playwright. `package-lock.json` fija las versiones probadas; usar `npm ci`, no Yarn.

Validación de esta implementación: 21 pruebas de lógica/formulario/reglas y 10 de navegador en escritorio/móvil pasaron con datos ficticios. Consulta `SECURITY.md` para los avisos de dependencias que siguen sin parche y los pasos pendientes de activación en producción.
