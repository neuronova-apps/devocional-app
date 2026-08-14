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
- persistencia local versionada para oraciones y reflexiones personales;
- validación y normalización de datos restaurados;
- migración de las claves antiguas de la demo;
- funcionamiento en memoria si `localStorage` no está disponible;
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

La interfaz incluye oraciones y reflexiones precargadas para mostrar el diseño. Esos ejemplos viven únicamente en `seedPrayers` y `seedJournal` dentro de `app.js`.

**Los ejemplos ya no se guardan en `localStorage`.** La lista visible combina en memoria los registros personales con los ejemplos, pero el estado persistente contiene solamente datos creados por la persona usuaria.

Los ejemplos tampoco participan en los contadores personales y no pueden modificarse como si fueran registros propios.

## Persistencia local v1

La clave actual es:

`mimomento-local-v1`

Formato:

```json
{
  "version": 1,
  "prayers": [
    {
      "id": 1723660000000,
      "title": "Por mi familia",
      "text": "Texto escrito por la persona usuaria",
      "category": "Familia",
      "date": "Hoy",
      "status": "active",
      "createdAt": "2026-08-14T22:00:00.000Z"
    }
  ],
  "journal": [
    {
      "id": 1723660000001,
      "date": "14 agosto 2026",
      "text": "Reflexión personal",
      "createdAt": "2026-08-14T22:01:00.000Z"
    }
  ]
}
```

No se almacenan todavía rachas, progreso devocional, planes, notas de seguimiento ni preferencias.

## Validación y recuperación

Al restaurar datos, `app.js`:

- exige `version: 1` para el formato actual;
- acepta únicamente arrays para oraciones y diario;
- valida IDs numéricos positivos y evita duplicados;
- limita título de oración a 120 caracteres;
- limita texto de oración a 1200 caracteres;
- limita las reflexiones del diario a 600 caracteres;
- normaliza categorías desconocidas a `Personal`;
- normaliza estados desconocidos a `active`;
- descarta registros sin ID, título o texto válido;
- normaliza `createdAt` cuando contiene una fecha válida;
- continúa en memoria si el navegador no permite usar `localStorage`.

Un JSON ilegible no bloquea la aplicación: se intenta recuperar información personal válida desde el formato heredado y, si no existe, la demo comienza con un estado personal vacío.

Si se encuentra una versión futura distinta de `1`, esta versión de la aplicación no la sobrescribe y funciona en memoria durante la sesión.

## Migración desde la demo anterior

Las claves heredadas son:

- `devotionalPrayers`;
- `devotionalJournal`.

Cuando `mimomento-local-v1` todavía no existe, la aplicación intenta leer esas colecciones. Solo migra registros personales válidos; los ejemplos históricos identificados por `demo: true` o por sus IDs de muestra se excluyen.

Después de guardar correctamente el nuevo estado, las dos claves heredadas se eliminan. Si la escritura falla, no se eliminan para evitar perder la única copia disponible.

## Progreso

Mi Momento **no calcula todavía progreso devocional real**. Se retiraron de la interfaz pública las cifras que simulaban porcentajes, momentos, rachas y métricas acumuladas artificialmente.

El panel actual solo muestra contadores de oraciones y reflexiones personales creadas en la demo; finalización de devocionales, rachas y calendario permanecen marcados como no implementados.

## Privacidad

Los registros personales se conservan en el navegador y no existe actualmente cuenta, sincronización remota ni base de datos propia para oraciones y reflexiones.

La política pública está en `privacy/index.html` y distingue expresamente entre datos personales persistentes, ejemplos que solo existen en memoria y funciones futuras.

## Accesibilidad

La web utiliza el módulo central de accesibilidad de Neuronova Apps. Esto constituye una base técnica compartida, pero **no una certificación WCAG**. La accesibilidad específica de modales, pestañas, formularios y estados dinámicos se reforzará en una etapa posterior.

## Estructura

- `index.html`: presentación, demo funcional y estado explícito de funciones reales/demostrativas.
- `styles.css`: estilos base, componentes y diseño responsive.
- `hero-orbit.css`: geometría y animaciones del hero.
- `app.js`: navegación, validación, migración, persistencia versionada, modales, filtros y formularios.
- `privacy/index.html`: política de privacidad.
- `privacy/styles.css`: estilos de privacidad.
- `sitemap.xml`: rutas públicas indexables.
- `.nojekyll`: publicación estática mediante GitHub Pages.

## Próxima etapa

El siguiente trabajo previsto es **hacer real el progreso devocional**: registrar acciones efectivamente completadas y derivar de ellas los avances de planes, actividad y métricas, sin volver a introducir cifras simuladas.

## Enlaces

- Web: https://neuronova-apps.github.io/mimomento-app/
- Política de privacidad: https://neuronova-apps.github.io/mimomento-app/privacy/
- Repositorio: https://github.com/neuronova-apps/mimomento-app
- Ecosistema: https://neuronova-apps.github.io/

## Autoría

Proyecto personal desarrollado dentro del ecosistema Neuronova Apps.
