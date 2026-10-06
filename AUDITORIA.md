# Auditoría de Inquieto

Fecha: 5 de octubre de 2026.

> Este documento describe la revisión inicial, anterior a las mejoras. Consulta `README.md` para la configuración y comportamiento actuales; los nombres y líneas de archivos de esta auditoría corresponden a la versión anterior.

## Alcance y resultado

Revisión del código, configuración, dependencias declaradas y lockfile, formularios administrativos, catálogo, carrito y pruebas existentes. Se ejecutaron reproducciones locales del store con Node y dobles de Firebase/Vuex: no se consultaron ni modificaron los datos de producción. No se accedió a las consolas de Netlify, Firebase o Google Cloud. No se cambió el comportamiento de la aplicación.

La aplicación es un sitio estático Nuxt 2 que se conecta directamente desde el código a Firebase Authentication, Firestore y Storage. Netlify aloja el sitio; los vinos no se guardan en Netlify. Las colecciones utilizadas son `Vinos`, `categories` y `bodegas`; las fotos de productos se suben a `products/<id>/<nombre de archivo>`.

## Variables y valores escritos en código

| Configuración | Ubicación | Estado |
| --- | --- | --- |
| Firebase web: apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId | `plugins/firebase.js:6–13` | Todos los valores están escritos directamente. Proyecto `curso-aa826`, bucket `curso-aa826.appspot.com`. |
| URL pública del sitio | `nuxt.config.js:1` y `head()` de las páginas | Única variable de entorno leída: `SITE_URL`, con fallback `https://inquieto.com`. |
| WhatsApp del carrito visible | `components/shared/Cart.vue:100` | Número de Uruguay escrito directamente. |
| WhatsApp de la acción del store | `store/index.js:78` | Otro número, de Colombia. Hay dos implementaciones diferentes. |
| Moneda | `components/shared/Cart.vue:33`, `components/shared/ProductCard.vue`, `pages/_id/index.vue:156` | El carrito muestra COP, las fichas UYU. |
| API de ejemplo | `services/api.config.js:1` | URL de un mock de restaurantes. No se encontraron consumidores de este servicio. |
| Imágenes remotas | `pages/nosotros.vue`, `pages/catalogo.vue`, login y navegación | URLs fijas de Firebase, Webflow y plantillas; una URL de Firebase incluye un token de descarga. |

No hay `.env` ni `.env.example` en el checkout. `.env` está ignorado por Git. No se encontraron archivos de entorno, reglas o configuración Netlify en los nombres de archivos del historial local revisado. Tampoco se encontraron contraseñas de acceso, claves privadas o credenciales de service account en los archivos actuales revisados. Esto no constituye un escaneo exhaustivo de secretos de cada versión histórica.

Los valores actuales permiten inicializar Firebase sin configurar variables en Netlify. Esto explica la ausencia de variables, aunque no verifica la configuración del despliegue que está publicado.

La configuración web de Firebase es pública por diseño: pasarla a `.env` organiza la configuración, pero no la oculta en el JavaScript del navegador ni protege los datos. La protección depende de las reglas y restricciones del proyecto. Referencia: [API keys de Firebase](https://firebase.google.com/docs/projects/api-keys).

Para externalizarla en una siguiente implementación: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, `SITE_URL`, `WHATSAPP_NUMBER` y `CURRENCY`. Son nombres propuestos; el código actual no lee las variables `FIREBASE_*`, `WHATSAPP_NUMBER` ni `CURRENCY`. Debe adaptarse la inicialización y exponer únicamente configuración pública al cliente. Con `target: "static"`, los cambios requieren regenerar y desplegar el sitio. Referencia: [Configuración Nuxt 2](https://v2.nuxt.com/docs/directory-structure/nuxt-config/).

## Hallazgos prioritarios

### 1. Alta: la creación puede fallar y cerrar igualmente el formulario

`store/index.js:418–465` captura errores de `addProduct` sin volver a lanzarlos. `pages/admin/create.vue:157–166` vuelve atrás en `finally`, tanto si guardó como si falló. Además, no bloquea un segundo envío mientras guarda. El botón utiliza `@click.prevent` y llama directamente al guardado, sin validar los campos `required` mediante un envío normal del formulario.

Consecuencia: el administrador puede creer que guardó un vino, perder los valores del formulario o crear duplicados. El documento se crea antes de subir las fotos; si falla una subida, puede quedar publicado sin imágenes o con archivos subidos sin enlazar.

Reproducción local confirmada: una excepción simulada al crear el documento no rechaza la promesa de `addProduct`.

Corrección: propagar errores, mantener el formulario y mostrar un mensaje comprensible al fallar; navegar únicamente tras éxito; bloquear envíos repetidos; validar antes de escribir y definir recuperación para subidas parciales.

### 2. Alta: reemplazar imágenes puede borrar la foto nueva o romper la anterior

`store/index.js:370–388` usa el nombre original para subir y elimina la foto anterior antes de confirmar la nueva referencia en Firestore. Si la nueva foto tiene el mismo nombre y carpeta, la subida sobrescribe el objeto y la eliminación posterior borra ese mismo objeto.

Reproducción local confirmada con Storage simulado: la ruta subida y la ruta eliminada coinciden. Si falla la actualización posterior en Firestore, la referencia anterior también puede quedar rota incluso con nombres distintos. En `pages/admin/_id.vue`, el índice utilizado por el callback de FileReader puede cambiar antes de completar la lectura y los reemplazos pendientes se acumulan.

Corrección: nombres únicos por subida, conservar la imagen antigua hasta guardar correctamente la referencia, limpiar archivos después del éxito y capturar el índice de la vista previa al seleccionar el archivo. Validar tipo y tamaño de imagen tanto en la aplicación como en Storage.

### 3. Alta: el carrito calcula importes incorrectos

`store/index.js:39–49, 68–70, 90–101` guarda precios formateados como texto y vuelve a convertirlos a números. Los puntos se utilizan simultáneamente como separadores de miles y decimales.

Reproducciones locales confirmadas ejecutando las acciones y mutaciones existentes:

- Un producto con precio `1500`, cantidad 1, se guarda como `1.500`; el subtotal resulta `1.5`.
- Añadir de nuevo ese producto genera `3.000.00`; el subtotal resulta `NaN`.

Corrección: mantener precio unitario y cantidad como números; calcular el total numérico y aplicar formato únicamente al mostrarlo. Unificar moneda, teléfono y construcción del mensaje de WhatsApp. La implementación del componente no codifica el mensaje completo, por lo que caracteres como `&` pueden alterar la URL.

### 4. Alta, pendiente de verificación: autorización real de administradores

`middleware/auth.js:19–26` solo comprueba si hay un usuario autenticado. No comprueba que sea administrador. Esto afecta al acceso al panel; no demuestra que otros usuarios puedan escribir en la base, porque las reglas de Firebase podrían impedirlo.

No hay `firestore.rules`, `storage.rules` ni `firebase.json` en el repo. No se puede determinar desde este checkout si las escrituras están protegidas.

Verificar en el proyecto `curso-aa826`:

- Firestore → Reglas: lectura del catálogo según lo necesario y escrituras únicamente para administradores autorizados; validar campos y tipos.
- Storage → Reglas: escrituras y eliminaciones únicamente para administradores, límites de tipo y tamaño.
- Authentication → Usuarios y configuración: identificar la cuenta del padre y revisar proveedores y dominios autorizados.
- Google Cloud → Credenciales: comprobar restricciones de la API key a las APIs necesarias y, cuando corresponda, restricciones de aplicación compatibles.

Versionar las reglas después de revisar las vigentes y comprobarlas con el emulador. No sustituirlas sin conocer la política actual. Referencia: [Checklist de seguridad de Firebase](https://firebase.google.com/support/guides/security-checklist).

### 5. Media: categorías y bodegas no tienen referencias estables

Los formularios guardan el nombre de categoría y bodega, no su ID. Las acciones que renombran o eliminan esas entidades no actualizan ni comprueban los vinos relacionados (`store/index.js:149–187, 219–257`).

Consecuencia: renombrar deja vinos asociados al nombre anterior; eliminar deja referencias antiguas. El catálogo construye opciones a partir de los vinos, de modo que pueden seguir apareciendo nombres eliminados.

Corrección: introducir IDs estables con migración compatible de los vinos actuales y bloquear eliminaciones con vinos asociados o permitir reasignarlos.

### 6. Media: errores de lectura ocultos y estado inconsistente

`fetchProducts`, `fetchCategories` y `fetchBodegas` capturan los errores sin propagarlos. El manejo de errores del panel no se activa ante esos fallos y puede mostrarse una lista vacía como si no hubiera vinos. La resolución silenciosa de `fetchProducts` ante un fallo fue confirmada localmente.

`updateProduct` refresca `products` pero no `filteredProducts`, que utiliza el listado administrativo; este último puede conservar valores anteriores. Corrección: representar carga/error/vacío por separado y centralizar la actualización del catálogo y sus filtros.

### 7. Media: mantenimiento y pruebas pendientes

El lockfile fija Nuxt `2.18.1`, Vue `2.7.16` y Firebase `8.9.1`. Nuxt 2 llegó al fin de soporte oficial el 30 de junio de 2024. Planificar una migración incremental después de estabilizar el flujo actual. Referencia: [Fin de soporte de Nuxt 2](https://nuxt.com/blog/nuxt2-eol).

`test/NuxtLogo.spec.js` importa `components/NuxtLogo.vue`, que no existe. El test de ProductCard pasa una imagen de tipo String mientras el componente declara Array y conserva datos de restaurantes. Las pruebas existentes no cubren guardado fallido, reemplazo de imágenes ni totales.

No hay `node_modules` en el checkout; no se ejecutó Jest, la compilación ni una auditoría de vulnerabilidades de dependencias. Las reproducciones locales usan el código del store con dobles, no el SDK real ni un navegador.

## Mejoras de gestión para el padre

El panel ya tiene búsqueda, filtros por categoría/bodega/disponibilidad y confirmación de borrado; se pueden aprovechar.

Orden recomendado:

1. Verificar acceso a Firebase, reglas vigentes y un respaldo de los vinos antes de cambios de datos.
2. Corregir guardado, imágenes, carrito y mensajes de error; unificar teléfono y moneda.
3. Crear `.env.example`, documentar instalación y despliegue y versionar la configuración de Netlify y las reglas ya verificadas.
4. Simplificar el alta en español, con campos claramente etiquetados, vista previa de fotos, validación y mensajes visibles de éxito/error. El login aún usa textos de Flowbite en inglés y los enlaces para recuperar contraseña/registrarse apuntan a `#`.
5. Adaptar el panel al móvil: `layouts/admin.vue` aplica `px-32` a todos los tamaños y dificulta usarlo desde un teléfono. Permitir cambiar disponibilidad y precio desde el listado y duplicar un vino para otra añada.
6. Diferenciar volumen de botella y unidades disponibles: `product_cantidad` se etiqueta como `Cantidad (ml/l)` en edición y `stock` es solo un booleano; no existe un inventario numérico de unidades. Acordar si necesita solo publicar disponibilidad o controlar existencias.
7. Añadir archivado recuperable, exportación/respaldo y recuperación de contraseña. Después, migrar las referencias por nombre y actualizar la base tecnológica con pruebas de los flujos principales.

## Verificaciones necesarias fuera del repo

En Netlify: confirmar el repositorio y rama publicados, comando de construcción, directorio de publicación y configuración de rutas para enlaces directos a productos y `/admin`. El repo declara `yarn generate` y `target: "static"`, pero no contiene `netlify.toml` ni `_redirects`; la configuración podría existir en el panel. Comprobar en el despliegue real si un vino nuevo queda accesible por enlace directo sin reconstruir.

En Firebase: comprobar que el proyecto sigue accesible, los usuarios administradores, las reglas, la disponibilidad de Storage y la facturación. Estos puntos no se comprobaron contra producción.

## Aclaración posterior del propietario (6 de octubre de 2026)

Todas las cuentas de Authentication deben administrar y se crean manualmente. La implementación sigue ese criterio y requiere bloquear el alta pública en Firebase, también a través de su API. El dominio anterior era `inquietovinos.online`, ya no disponible: `inquieto.com` era un fallback incorrecto del código original. Ahora se detecta el dominio gratuito de Netlify mediante `SITE_NAME`.
