# Mi Momento

Mi Momento es un proyecto de Neuronova Apps orientado a devocionales, oraciones personales, diario de reflexión y seguimiento del recorrido espiritual.

## Estado actual

**Demo web funcional en desarrollo.**

La versión pública permite completar un devocional de muestra, avanzar por sesiones disponibles de planes, registrar oraciones y escribir reflexiones. Esas acciones se conservan localmente y el panel de progreso se calcula desde actividad real de la demo.

La biblioteca sigue siendo limitada: cada plan conserva una duración conceptual de 7, 10, 14 o 21 días, pero actualmente solo existen **tres sesiones utilizables por plan**. El proyecto no simula avance sobre contenido todavía no publicado.

### Funciones reales de la demo

- navegación entre Inicio, Devocionales, Oraciones, Diario y Progreso;
- finalización diaria del devocional de muestra;
- tres sesiones completables en cada uno de los cuatro planes de muestra;
- progreso por plan derivado de sesiones completadas;
- racha devocional derivada de fechas con actividad;
- calendario real de los últimos 28 días;
- creación de oraciones personales;
- cambio de una oración activa a respondida;
- filtrado entre oraciones activas y respondidas;
- creación de entradas del diario;
- persistencia local versionada para oraciones, reflexiones y progreso devocional;
- validación y normalización de datos restaurados;
- migración de las claves antiguas de la demo;
- funcionamiento en memoria si `localStorage` no está disponible;
- filtros visuales de la biblioteca devocional;
- saludo y fecha locales;
- base compartida de accesibilidad de Neuronova Apps.

### Funciones todavía demostrativas o pendientes

- contenido completo de los planes de 7, 10, 14 y 21 días;
- más de tres sesiones por plan;
- notas reales de seguimiento de oraciones;
- edición y eliminación individual de oraciones y diario;
- perfil, recordatorios, copias de seguridad y preferencias;
- cuentas, sincronización remota o ranking.

## Datos de ejemplo

La interfaz incluye oraciones y reflexiones precargadas para mostrar el diseño. Esos ejemplos viven únicamente en `seedPrayers` y `seedJournal` dentro de `app.js`.

**Los ejemplos no se guardan en `localStorage`.** La lista visible combina en memoria los registros personales con los ejemplos, pero el estado persistente contiene solamente datos creados por la persona usuaria y progreso devocional generado por acciones reales.

Los ejemplos tampoco participan en contadores personales y no pueden modificarse como registros propios.

## Persistencia local v1

La clave sigue siendo:

`mimomento-local-v1`

El paso de progreso devocional amplía de forma compatible el mismo formato `version: 1` con un bloque `devotional`. Los estados creados antes de este cambio, que solo contienen `prayers` y `journal`, se normalizan automáticamente con progreso vacío.

Formato resumido:

```json
{
  "version": 1,
  "prayers": [],
  "journal": [],
  "devotional": {
    "daily": [
      {
        "date": "2026-08-14",
        "completedAt": "2026-08-14T22:00:00.000Z"
      }
    ],
    "plans": {
      "calma": [
        {
          "session": 1,
          "date": "2026-08-14",
          "completedAt": "2026-08-14T22:05:00.000Z"
        }
      ],
      "gratitud": [],
      "familia": [],
      "proposito": []
    }
  }
}
```

No se almacenan todavía notas de seguimiento, preferencias de perfil ni contenido de sesiones futuras.

## Validación y recuperación

Al restaurar datos, `app.js`:

- exige `version: 1` para el formato actual;
- valida las colecciones de oraciones y diario;
- valida IDs numéricos positivos y evita duplicados;
- limita título de oración a 120 caracteres;
- limita texto de oración a 1200 caracteres;
- limita las reflexiones del diario a 600 caracteres;
- normaliza categorías desconocidas a `Personal`;
- normaliza estados desconocidos a `active`;
- descarta registros personales incompletos;
- normaliza fechas técnicas cuando son válidas;
- valida las fechas devocionales en formato `YYYY-MM-DD`;
- acepta una sola finalización del devocional diario por fecha;
- acepta únicamente sesiones de plan entre 1 y 3;
- conserva solo un prefijo secuencial válido de sesiones: `1`, `1–2` o `1–3`;
- continúa en memoria si el navegador no permite utilizar `localStorage`.

Un JSON ilegible no bloquea la aplicación: se intenta recuperar información personal válida desde el formato heredado y, si no existe, la demo comienza con un estado personal vacío.

Si se encuentra una versión futura distinta de `1`, esta versión no la sobrescribe y funciona en memoria durante la sesión.

## Migración desde la demo anterior

Las claves históricas continúan reconocidas únicamente para migración:

- `devotionalPrayers`;
- `devotionalJournal`.

Cuando `mimomento-local-v1` todavía no existe, la aplicación intenta leer esas colecciones. Solo migra registros personales válidos; los ejemplos históricos se excluyen.

Después de guardar correctamente el nuevo estado, las claves heredadas se eliminan. Si la escritura falla, no se eliminan para evitar perder la única copia disponible.

## Progreso devocional real

El devocional de muestra puede marcarse como completado una vez por fecha local. Cada finalización guarda la fecha de actividad y una marca temporal técnica.

Los cuatro planes disponen actualmente de tres sesiones reales de muestra. El avance de cada plan se expresa como `0/3`, `1/3`, `2/3` o `3/3` y solo puede avanzar en orden.

El panel calcula:

- **porcentaje de planes disponibles:** sesiones de plan completadas / 12 sesiones actualmente publicadas;
- **sesiones devocionales:** finalizaciones del devocional diario + sesiones de plan completadas;
- **días con actividad:** fechas únicas con alguna acción devocional completada;
- **racha actual:** secuencia consecutiva de fechas con actividad devocional, admitiendo que la última actividad sea hoy o ayer;
- **calendario:** presencia o ausencia de actividad devocional en cada uno de los últimos 28 días.

La duración conceptual de los planes no forma parte del denominador mientras esos días no tengan contenido implementado.

## Privacidad

Oraciones, reflexiones y progreso devocional permanecen en el navegador mediante `localStorage`. No existe actualmente cuenta, sincronización remota ni base de datos propia para estos registros.

La política pública está en `privacy/index.html` y describe el bloque `devotional`, sus fechas y las limitaciones del almacenamiento local.

## Accesibilidad

La web utiliza el módulo central de accesibilidad de Neuronova Apps. Esto constituye una base técnica compartida, pero **no una certificación WCAG**. La accesibilidad específica de modales, pestañas, formularios y estados dinámicos se reforzará en una etapa posterior.

## Estructura

- `index.html`: presentación, demo funcional y progreso conectado a datos reales.
- `styles.css`: estilos base, componentes y diseño responsive.
- `hero-orbit.css`: geometría y animaciones del hero.
- `progress.css`: estados visuales específicos del progreso real y calendario.
- `app.js`: navegación, validación, migración, persistencia, progreso devocional, modales, filtros y formularios.
- `privacy/index.html`: política de privacidad.
- `privacy/styles.css`: estilos de privacidad.
- `sitemap.xml`: rutas públicas indexables.
- `.nojekyll`: publicación estática mediante GitHub Pages.

## Próxima etapa

El siguiente trabajo previsto es **completar el seguimiento de oraciones**: notas reales con fecha, historial persistente y controles coherentes para gestionar cada petición sin mezclar ejemplos con registros personales.

## Enlaces

- Web: https://neuronova-apps.github.io/mimomento-app/
- Política de privacidad: https://neuronova-apps.github.io/mimomento-app/privacy/
- Repositorio: https://github.com/neuronova-apps/mimomento-app
- Ecosistema: https://neuronova-apps.github.io/

## Autoría

Proyecto personal desarrollado dentro del ecosistema Neuronova Apps.
