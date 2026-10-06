# Seguridad y estado de activación

Revisión del 6 de octubre de 2026.

## Controles implementados

- Configuración local `.env` ignorada por Git; `.env.example` sin valores del proyecto.
- Todas las cuentas autenticadas administran. Reglas preparadas con `npm run rules:prepare`, sin UIDs ni roles adicionales.
- Escrituras Firestore y Storage denegadas sin sesión. Para que solo existan cuentas creadas a mano, es imprescindible desactivar la creación de cuentas por usuarios finales en Firebase antes de desplegar esta política. Ocultar el registro en la web no bloquea la API de alta. [Configuración oficial](https://firebase.google.com/docs/auth/users#user_self-service).
- Validación de datos, archivos hasta 5 MB, tipos JPG/PNG/WebP y rutas únicas de imágenes.
- Actualización de referencias de fotos antes de borrar las anteriores; limpieza de subidas si falla el guardado.
- Borrado definitivo de vinos únicamente después de archivar.
- Autorización en el panel y en las operaciones del store; las reglas de Firebase son la protección efectiva fuera del navegador.
- Cabeceras para impedir framing, MIME sniffing y uso de cámara/micrófono/geolocalización en Netlify.

Las reglas fueron probadas en un proyecto demo con emuladores. Las reglas existentes de producción no se descargaron ni cambiaron. Las políticas preparadas deben revisarse contra las actuales antes de activarse, especialmente si existen otras aplicaciones que usan el mismo proyecto.

El catálogo, incluidos registros archivados y fotos, es público. No se usa para información privada. La configuración web de Firebase no es secreta: se incluyen en los assets que necesita el navegador. [Firebase explica el uso de API keys](https://firebase.google.com/docs/projects/api-keys).

## Dependencias

Se migró de Nuxt/Vue 2 a Nuxt 4/Vue 3 y del SDK Firebase 8 al SDK 12, conservando su API compat para esta transición. Las versiones instaladas se fijan en `package-lock.json`.

Se aplicaron overrides compatibles para `@grpc/grpc-js`, `brace-expansion` 2, `picomatch` 2, `minimatch` 9 y `websocket-driver`, que eliminan los avisos con parches disponibles, incluido el crítico de websocket-driver.

Después de esos cambios, `npm audit --omit=dev` todavía informa 11 avisos altos (contando las cadenas de dependencias), originados en **braces 3.0.3** y **node-forge 1.4.0**. El registro npm los marca como vulnerables y no ofrece versiones publicadas corregidas de esos dos paquetes al momento de la revisión. No se aplicaron degradaciones de Nuxt ni parches improvisados a código criptográfico.

Estas dependencias pertenecen al árbol de herramientas de Nuxt: globbing de archivos y certificados del servidor de desarrollo. El despliegue configurado publica únicamente `.output/public`, sin un servidor Node/Nuxt ni los paquetes de `node_modules`. No se usa TLS autogenerado por el servidor de desarrollo. Esto limita su exposición en el sitio estático, pero no equivale a haber eliminado los avisos: seguir sus actualizaciones y ejecutar `npm audit` al actualizar dependencias. Las herramientas de prueba/emuladores también deben mantenerse al día.

## Pendiente en producción

1. Revisar y respaldar datos y reglas actuales.
2. Desactivar el registro público en Authentication y verificar que las altas desde clientes están bloqueadas; después activar las reglas preparadas.
3. Retirar el dominio personalizado perdido, configurar las variables de construcción en Netlify y desplegar con el dominio gratuito.
4. Comprobar dominios autorizados de Authentication y restricciones de API key en Google Cloud.
5. Verificar que las cuentas creadas a mano administran, los visitantes no escriben y el catálogo sigue siendo público.

Consultar `README.md` para los comandos exactos. No hubo escrituras ni despliegues en el proyecto de producción durante esta implementación.
