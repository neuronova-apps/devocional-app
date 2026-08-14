# Mi Momento

Mi Momento es un proyecto de Neuronova Apps orientado a devocionales, oraciones personales, diario de reflexión y seguimiento del recorrido espiritual.

## Estado actual

**Demo web funcional en desarrollo.**

La versión pública permite completar un devocional de muestra, avanzar por tres sesiones disponibles en cada plan, gestionar oraciones con seguimiento y escribir reflexiones. Todo el estado personal se conserva localmente en el navegador mediante `mimomento-local-v1`.

## Funciones reales

- navegación entre Inicio, Devocionales, Oraciones, Diario y Progreso;
- finalización diaria del devocional de muestra;
- tres sesiones completables en cada uno de los cuatro planes;
- progreso, racha y calendario derivados de actividad real;
- creación de oraciones personales;
- edición y eliminación de oraciones personales;
- cambio de activa a respondida con fecha técnica de respuesta;
- notas de seguimiento persistentes y fechadas por oración;
- historial de notas por petición;
- creación de entradas del diario;
- persistencia local versionada y validada;
- migración de las claves antiguas de la demo;
- funcionamiento en memoria cuando `localStorage` no está disponible;
- base compartida de accesibilidad de Neuronova Apps.

## Funciones pendientes

- contenido completo de los planes de 7, 10, 14 y 21 días;
- más de tres sesiones por plan;
- edición y eliminación de entradas del diario;
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

Las oraciones guardadas antes del paso 4 siguen siendo compatibles. Al restaurarlas se completan de forma segura los campos nuevos con historial vacío cuando no existían.

Una oración personal puede contener:

- `id`, `title`, `text`, `category` y `status`;
- `createdAt` y `updatedAt`;
- `answeredAt` cuando fue marcada como respondida;
- `notes`, con elementos formados por `id`, `text` y `createdAt`.

## Seguimiento de oraciones

Cada oración personal puede acumular notas de hasta 600 caracteres. El historial se muestra con las notas más recientes primero y se conserva al editar título, categoría o texto.

Marcar una oración como respondida mantiene su fecha de creación y registra `answeredAt`. Una oración respondida puede continuar recibiendo notas.

Eliminar una oración elimina también sus notas asociadas. Los ejemplos demostrativos permanecen inmutables.

## Validación

`app.js` valida y normaliza el estado antes de utilizarlo. Entre otras reglas:

- IDs positivos y no duplicados;
- título de oración de hasta 120 caracteres;
- texto de oración de hasta 1200 caracteres;
- notas de hasta 600 caracteres;
- notas con ID, texto y fecha técnica válidos;
- categorías desconocidas normalizadas a `Personal`;
- estados desconocidos normalizados a `active`;
- `answeredAt` conservado solo para oraciones respondidas;
- sesiones devocionales limitadas al contenido realmente disponible;
- funcionamiento temporal en memoria si falla `localStorage`.

## Progreso devocional

Los cuatro planes disponen actualmente de tres sesiones reales de muestra. El porcentaje se calcula sobre las 12 sesiones publicadas, no sobre los días conceptuales todavía ausentes.

También se calculan desde eventos reales las sesiones devocionales, días con actividad, racha actual y calendario de los últimos 28 días.

## Privacidad

Oraciones, notas de seguimiento, reflexiones y progreso devocional permanecen en el navegador. No existe actualmente cuenta, sincronización remota ni base de datos propia para estos registros.

La política pública se encuentra en `privacy/index.html`.

## Accesibilidad

La web utiliza el módulo central de accesibilidad de Neuronova Apps. Es una base técnica compartida y no una certificación WCAG.

## Estructura

- `index.html`: interfaz principal.
- `styles.css`: estilos base y responsive.
- `hero-orbit.css`: hero visual.
- `progress.css`: estados de progreso y calendario.
- `app.js`: navegación, validación, persistencia, progreso y seguimiento de oraciones.
- `privacy/index.html`: política de privacidad.
- `privacy/styles.css`: estilos de privacidad.
- `sitemap.xml`: rutas públicas indexables.

## Próxima etapa

El siguiente trabajo previsto es **mejorar el diario personal**: edición y eliminación de entradas, fechas consistentes y controles claros sobre los registros locales sin alterar los ejemplos demostrativos.

## Enlaces

- Web: https://neuronova-apps.github.io/mimomento-app/
- Política de privacidad: https://neuronova-apps.github.io/mimomento-app/privacy/
- Repositorio: https://github.com/neuronova-apps/mimomento-app
- Ecosistema: https://neuronova-apps.github.io/

## Autoría

Proyecto personal desarrollado dentro del ecosistema Neuronova Apps.
