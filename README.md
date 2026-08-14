# Mi Momento

Mi Momento es un proyecto de Neuronova Apps orientado a devocionales, oraciones personales, diario de reflexión y seguimiento del recorrido espiritual.

## Estado actual

**Demo web funcional en desarrollo.**

La versión pública permite completar un devocional de muestra, avanzar por tres sesiones disponibles en cada plan, gestionar oraciones con seguimiento y crear, editar o eliminar reflexiones del diario. Todo el estado personal se conserva localmente en el navegador mediante `mimomento-local-v1`.

## Funciones reales

- navegación entre Inicio, Devocionales, Oraciones, Diario y Progreso;
- finalización diaria del devocional de muestra;
- tres sesiones completables en cada uno de los cuatro planes;
- progreso, racha y calendario derivados de actividad real;
- creación, edición y eliminación de oraciones personales;
- cambio de activa a respondida con fecha técnica de respuesta;
- notas de seguimiento persistentes y fechadas por oración;
- historial de notas por petición;
- creación de entradas del diario;
- edición y eliminación de entradas personales del diario;
- conservación de la fecha original de creación de cada reflexión;
- registro de `updatedAt` al editar una reflexión;
- persistencia local versionada y validada;
- migración de las claves antiguas de la demo;
- funcionamiento en memoria cuando `localStorage` no está disponible;
- base compartida de accesibilidad de Neuronova Apps.

## Funciones pendientes

- contenido completo de los planes de 7, 10, 14 y 21 días;
- más de tres sesiones por plan;
- edición o eliminación individual de notas de seguimiento;
- eliminación individual de eventos de progreso devocional;
- perfil, recordatorios, copias de seguridad y preferencias;
- cuentas y sincronización remota.

## Datos de ejemplo

Las oraciones y reflexiones precargadas viven únicamente en `seedPrayers` y `seedJournal`. No se guardan en `localStorage`, no participan en métricas personales y no ofrecen controles de edición, eliminación, cambio de estado ni seguimiento.

## Persistencia local v1

La clave actual es `mimomento-local-v1` y conserva `version: 1`.

El estado puede contener:

- `prayers`: oraciones personales;
- `journal`: reflexiones personales;
- `devotional`: actividad devocional y sesiones completadas.

Los estados creados en pasos anteriores siguen siendo compatibles. Los campos nuevos se normalizan con valores vacíos o `null` cuando no existían, sin inventar fechas históricas.

### Oraciones

Una oración personal puede contener:

- `id`, `title`, `text`, `category` y `status`;
- `createdAt` y `updatedAt`;
- `answeredAt` cuando fue marcada como respondida;
- `notes`, con elementos formados por `id`, `text` y `createdAt`.

Cada oración puede acumular notas de hasta 600 caracteres. Marcarla como respondida conserva su contenido e historial. Eliminarla elimina también sus notas asociadas.

### Diario

Una reflexión personal puede contener:

- `id`;
- `date`, conservado como texto visible de compatibilidad;
- `text` de hasta 600 caracteres;
- `createdAt`, cuando existe una fecha técnica válida;
- `updatedAt`, cuando la reflexión fue editada.

La interfaz muestra la fecha derivada de `createdAt` cuando está disponible y usa `date` como respaldo para registros antiguos. Editar una entrada modifica solo el texto y `updatedAt`; no altera su fecha de creación. Eliminar una entrada la retira de `journal` y actualiza el contador local.

## Validación

`app.js` valida y normaliza el estado antes de utilizarlo. Entre otras reglas:

- IDs positivos y no duplicados;
- título de oración de hasta 120 caracteres;
- texto de oración de hasta 1200 caracteres;
- notas de seguimiento de hasta 600 caracteres;
- reflexiones del diario de hasta 600 caracteres;
- fechas técnicas normalizadas cuando son válidas;
- `updatedAt` opcional para entradas del diario antiguas;
- categorías desconocidas de oración normalizadas a `Personal`;
- estados desconocidos normalizados a `active`;
- sesiones devocionales limitadas al contenido realmente disponible;
- funcionamiento temporal en memoria si falla `localStorage`.

## Progreso devocional

Los cuatro planes disponen actualmente de tres sesiones reales de muestra. El porcentaje se calcula sobre las 12 sesiones publicadas, no sobre los días conceptuales todavía ausentes.

También se calculan desde eventos reales las sesiones devocionales, días con actividad, racha actual y calendario de los últimos 28 días.

## Privacidad

Oraciones, notas de seguimiento, reflexiones y progreso devocional permanecen en el navegador. No existe actualmente cuenta, sincronización remota ni base de datos propia para estos registros.

Las oraciones y las entradas personales del diario disponen de eliminación desde la interfaz. Los eventos de progreso devocional todavía requieren borrar los datos del sitio para eliminarlos.

La política pública se encuentra en `privacy/index.html`.

## Accesibilidad

La web utiliza el módulo central de accesibilidad de Neuronova Apps. Es una base técnica compartida y no una certificación WCAG.

## Estructura

- `index.html`: interfaz principal.
- `styles.css`: estilos base y responsive.
- `hero-orbit.css`: hero visual.
- `progress.css`: estados de progreso y calendario.
- `app.js`: navegación, validación, persistencia, progreso, seguimiento de oraciones y gestión del diario.
- `privacy/index.html`: política de privacidad.
- `privacy/styles.css`: estilos de privacidad.
- `sitemap.xml`: rutas públicas indexables.

## Próxima etapa

El siguiente trabajo previsto es **reforzar la accesibilidad específica de la aplicación**: modales, pestañas, formularios, gestión de foco, anuncios de estado y navegación por teclado, sin afirmar conformidad formal hasta completar validaciones manuales.

## Enlaces

- Web: https://neuronova-apps.github.io/mimomento-app/
- Política de privacidad: https://neuronova-apps.github.io/mimomento-app/privacy/
- Repositorio: https://github.com/neuronova-apps/mimomento-app
- Ecosistema: https://neuronova-apps.github.io/

## Autoría

Proyecto personal desarrollado dentro del ecosistema Neuronova Apps.