# Mi Momento

Mi Momento es un proyecto de Neuronova Apps orientado a devocionales, oraciones personales, diario de reflexión y seguimiento del recorrido espiritual.

## Estado actual

**Demo web funcional en desarrollo.**

La versión pública permite probar navegación, oraciones y diario dentro de una experiencia local. El contenido devocional, los planes y el panel de progreso siguen siendo demostrativos mientras se define la biblioteca y el modelo de seguimiento definitivo.

### Funciones reales de la demo

- navegación entre Inicio, Devocionales, Oraciones, Diario y Progreso;
- creación de oraciones personales;
- cambio de una oración activa a respondida;
- filtrado entre oraciones activas y respondidas;
- creación de entradas del diario;
- persistencia local de oraciones y reflexiones mediante `localStorage`;
- filtros visuales de la biblioteca devocional;
- saludo y fecha locales;
- base compartida de accesibilidad de Neuronova Apps.

### Contenido e interacciones demostrativas

- devocional del día y biblioteca actual;
- planes de 7, 10, 14 y 21 días;
- finalización de devocionales;
- guardado y avance de planes;
- notas de seguimiento de oraciones;
- rachas;
- porcentajes y calendario de actividad;
- progreso devocional;
- perfil, recordatorios, copias de seguridad y preferencias.

Estas funciones no deben interpretarse como historial personal persistente hasta que estén implementadas y verificadas.

## Datos de ejemplo

La interfaz incluye oraciones y reflexiones precargadas para mostrar el diseño. `app.js` las identifica como datos de demostración y no las incluye en los contadores personales.

Las nuevas oraciones y reflexiones creadas por la persona usuaria se marcan como registros personales y sí participan en los contadores locales de la demo.

La separación estructural del almacenamiento entre contenido de muestra y datos personales se reforzará en la siguiente etapa; el formato actual todavía utiliza las claves heredadas de la demo.

## Persistencia actual

La versión web utiliza:

- `devotionalPrayers` para la colección visible de oraciones;
- `devotionalJournal` para la colección visible del diario.

El código actual todavía no dispone de un esquema versionado ni de validación completa de datos restaurados. Ese endurecimiento corresponde a la siguiente mejora.

## Progreso

Mi Momento **no calcula todavía progreso devocional real**. Se retiraron de la interfaz pública las cifras que simulaban 72 %, 18 momentos, 8 días de racha y métricas acumuladas artificialmente.

El panel actual solo muestra contadores de oraciones y reflexiones personales creadas en la demo; finalización de devocionales, rachas y calendario permanecen marcados como no implementados.

## Privacidad

Los registros personales se conservan en el navegador y no existe actualmente cuenta, sincronización remota ni base de datos propia para oraciones y reflexiones.

La política pública está en `privacy/index.html` y distingue expresamente entre datos personales locales, ejemplos de demostración y funciones futuras.

## Accesibilidad

La web utiliza el módulo central de accesibilidad de Neuronova Apps. Esto constituye una base técnica compartida, pero **no una certificación WCAG**. La accesibilidad específica de modales, pestañas, formularios y estados dinámicos se reforzará en una etapa posterior.

## Estructura

- `index.html`: presentación, demo funcional y estado explícito de funciones reales/demostrativas.
- `styles.css`: estilos base, componentes y diseño responsive.
- `hero-orbit.css`: geometría y animaciones del hero.
- `app.js`: navegación, modales, filtros, formularios, datos de muestra, contadores y persistencia local.
- `privacy/index.html`: política de privacidad.
- `privacy/styles.css`: estilos de privacidad.
- `sitemap.xml`: rutas públicas indexables.
- `.nojekyll`: publicación estática mediante GitHub Pages.

## Próxima etapa

El siguiente trabajo previsto es **endurecer la persistencia local**: esquema versionado, validación, recuperación ante datos corruptos y separación estructural entre datos de demostración y registros personales.

## Enlaces

- Web: https://neuronova-apps.github.io/mimomento-app/
- Política de privacidad: https://neuronova-apps.github.io/mimomento-app/privacy/
- Repositorio: https://github.com/neuronova-apps/mimomento-app
- Ecosistema: https://neuronova-apps.github.io/

## Autoría

Proyecto personal desarrollado dentro del ecosistema Neuronova Apps.
