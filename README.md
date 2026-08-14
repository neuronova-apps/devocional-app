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
- creación, edición y eliminación de entradas personales del diario;
- conservación de fechas de creación y registro de `updatedAt` al editar;
- persistencia local versionada y validada;
- migración de las claves antiguas de la demo;
- funcionamiento en memoria cuando `localStorage` no está disponible;
- accesibilidad específica para navegación, pestañas, modales, formularios y estados dinámicos.

## Funciones pendientes

- contenido completo de los planes de 7, 10, 14 y 21 días;
- más de tres sesiones por plan;
- edición o eliminación individual de notas de seguimiento;
- eliminación individual de eventos de progreso devocional;
- perfil, recordatorios, copias de seguridad y preferencias;
- cuentas y sincronización remota;
- validación manual exhaustiva con lectores de pantalla, zoom, alto contraste y otras tecnologías de asistencia.

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

Una oración personal puede contener `id`, `title`, `text`, `category`, `status`, `createdAt`, `updatedAt`, `answeredAt` y `notes`.

Cada oración puede acumular notas de hasta 600 caracteres. Marcarla como respondida conserva su contenido e historial. Eliminarla elimina también sus notas asociadas.

### Diario

Una reflexión personal puede contener `id`, `date`, `text`, `createdAt` y `updatedAt`.

La interfaz muestra la fecha derivada de `createdAt` cuando está disponible y usa `date` como respaldo para registros antiguos. Editar una entrada modifica solo el texto y `updatedAt`; eliminarla la retira de `journal` y actualiza el contador local.

## Validación

`app.js` valida y normaliza el estado antes de utilizarlo. Entre otras reglas:

- IDs positivos y no duplicados;
- título de oración de hasta 120 caracteres;
- texto de oración de hasta 1200 caracteres;
- notas de seguimiento de hasta 600 caracteres;
- reflexiones del diario de hasta 600 caracteres;
- fechas técnicas normalizadas cuando son válidas;
- categorías y estados desconocidos normalizados a valores seguros;
- sesiones devocionales limitadas al contenido realmente disponible;
- funcionamiento temporal en memoria si falla `localStorage`.

`app-a11y.js` añade una validación de interfaz adicional para evitar que campos requeridos compuestos solo por espacios se procesen como contenido válido y mueve el foco al campo que necesita corrección.

## Progreso devocional

Los cuatro planes disponen actualmente de tres sesiones reales de muestra. El porcentaje se calcula sobre las 12 sesiones publicadas, no sobre los días conceptuales todavía ausentes.

También se calculan desde eventos reales las sesiones devocionales, días con actividad, racha actual y calendario de los últimos 28 días.

## Privacidad

Oraciones, notas de seguimiento, reflexiones y progreso devocional permanecen en el navegador. No existe actualmente cuenta, sincronización remota ni base de datos propia para estos registros.

Las oraciones y las entradas personales del diario disponen de eliminación desde la interfaz. Los eventos de progreso devocional todavía requieren borrar los datos del sitio para eliminarlos.

La política pública se encuentra en `privacy/index.html`.

## Accesibilidad

Mi Momento conserva el módulo central de accesibilidad de Neuronova Apps y añade una capa específica para esta aplicación.

Actualmente se implementa:

- patrón `tablist` / `tab` / `tabpanel` en la navegación interna;
- estado `aria-selected`, `aria-controls` y tabulación móvil entre pestañas;
- navegación por `Flecha izquierda`, `Flecha derecha`, `Inicio` y `Fin` en los grupos de pestañas;
- foco programático al cambiar de sección desde controles externos al tablist;
- diálogos con `role="dialog"`, `aria-modal` y título asociado;
- foco inicial en el título del diálogo;
- trampa de `Tab` y `Shift+Tab` dentro del modal;
- cierre con `Escape` y restauración del foco al control que abrió el diálogo;
- regiones `role="status"` / `aria-live` para cambios de sección, mensajes y contador del diario;
- asociación del contador de caracteres con el campo del diario;
- foco visible específico para enlaces, botones, campos, pestañas, paneles y diálogos;
- respeto adicional por `prefers-reduced-motion` en la capa local.

Estas mejoras constituyen una implementación técnica, **no una certificación WCAG**. Sigue pendiente una revisión manual sistemática con lectores de pantalla, navegación solo por teclado, zoom, alto contraste y distintos navegadores/dispositivos.

## Estructura

- `index.html`: interfaz principal y semántica accesible de paneles/pestañas.
- `styles.css`: estilos base y responsive.
- `hero-orbit.css`: hero visual.
- `progress.css`: estados de progreso y calendario.
- `accessibility-local.css`: foco visible y ajustes locales de accesibilidad.
- `app.js`: navegación, validación, persistencia, progreso, seguimiento de oraciones y gestión del diario.
- `app-a11y.js`: foco, teclado, ARIA, modales y validación accesible de interfaz.
- `privacy/index.html`: política de privacidad.
- `privacy/styles.css`: estilos de privacidad.
- `sitemap.xml`: rutas públicas indexables.

## Próxima etapa

El siguiente trabajo previsto es **definir y ampliar el contenido público**: establecer un modelo editorial y de fuentes para los devocionales y crear recursos indexables sobre reflexión, oración, diario y uso responsable de la aplicación.

## Enlaces

- Web: https://neuronova-apps.github.io/mimomento-app/
- Política de privacidad: https://neuronova-apps.github.io/mimomento-app/privacy/
- Repositorio: https://github.com/neuronova-apps/mimomento-app
- Ecosistema: https://neuronova-apps.github.io/

## Autoría

Proyecto personal desarrollado dentro del ecosistema Neuronova Apps.
