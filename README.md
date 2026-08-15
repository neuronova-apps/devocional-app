# Mi Momento

Mi Momento es una aplicación de Neuronova Apps orientada a devocionales, oración personal, diario de reflexión y seguimiento local del recorrido espiritual.

## Estado del proyecto

- **Web:** demo funcional en desarrollo activo.
- **Publicación:** disponible mediante GitHub Pages.
- **Android:** existe una rama `android` preparatoria, pero todavía no contiene un proyecto Android nativo con Gradle, módulo `app` ni `AndroidManifest.xml`. Actualmente conserva una variante de la implementación web y no debe considerarse una aplicación móvil compilable.

## Funciones disponibles

- navegación entre Inicio, Devocionales, Oraciones, Diario y Progreso;
- cuatro planes de muestra con tres sesiones disponibles por plan;
- 12 sesiones utilizables en la demo actual;
- finalización del devocional diario de muestra;
- progreso, racha y calendario derivados de actividad real;
- creación, edición y eliminación de oraciones personales;
- cambio de estado entre oración activa y respondida;
- notas de seguimiento persistentes por oración;
- creación, edición y eliminación de entradas del diario;
- persistencia local versionada mediante `mimomento-local-v1`;
- funcionamiento temporal en memoria si `localStorage` no está disponible;
- accesibilidad específica para pestañas, formularios, modales, estados dinámicos y navegación por teclado;
- cinco guías educativas públicas e indexables sobre uso responsable, devocionales, oraciones, seguimiento y diario.

Los planes conceptuales pueden contemplar más días, pero el porcentaje actual se calcula únicamente sobre las 12 sesiones realmente publicadas.

## Modelo editorial y de fuentes

El contrato editorial se documenta en `docs/editorial-model.md`.

Principios principales:

- cada apoyo bíblico utiliza una referencia explícita de libro, capítulo y versículo o rango;
- la web prioriza **paráfrasis editorial propia** y evita presentar una paráfrasis como cita literal;
- si se incorpora texto literal de una traducción, debe identificarse la traducción y respetarse su licencia o condiciones de uso;
- reflexión editorial, texto fuente y preguntas personales deben distinguirse entre sí;
- las preguntas se formulan como invitaciones abiertas, no como una interpretación doctrinal universal;
- no se prometen resultados espirituales, médicos o psicológicos por completar una sesión, mantener una racha o registrar una oración;
- las métricas describen actividad de la aplicación y no se presentan como medida de crecimiento espiritual;
- cualquier fuente secundaria externa futura debe documentar autor, título y referencia suficiente para su atribución.

El ejemplo público basado en Eclesiastés 3:1 se presenta ahora como **paráfrasis editorial + referencia**, no como una cita bíblica sin traducción identificada.

## Guías públicas

Las guías son HTML estático. Leerlas no modifica `localStorage`, las oraciones, el diario ni el progreso.

- `guia-mi-momento.html`: uso responsable de la demo, privacidad y lectura de métricas;
- `como-usar-un-devocional.html`: diferencia entre referencia, paráfrasis, reflexión y pregunta personal;
- `organizar-oraciones-personales.html`: títulos, categorías, estados y criterios de privacidad;
- `seguimiento-de-oraciones.html`: notas fechadas, estado respondido y revisión del historial;
- `diario-de-reflexion.html`: estructura de entradas, edición, eliminación y privacidad.

Todas declaran `index, follow`, canonical propio, H1 único, navegación cruzada y acceso de regreso a la aplicación.

## Presentación social

Las siete páginas públicas —portada, cinco guías y privacidad— utilizan el mismo activo:

`assets/social/mimomento-social.png`

El PNG tiene dimensiones **1200×630**. La metadata social pública está normalizada con:

- `og:image` apuntando al PNG absoluto;
- `og:image:type="image/png"`;
- `og:image:width="1200"` y `og:image:height="630"`;
- `og:image:alt` consistente;
- `twitter:card="summary_large_image"`;
- `twitter:image` y `twitter:image:alt` con el mismo recurso;
- títulos y descripciones específicos para cada página.

El favicon permanece separado del activo social.

## Tecnología

La versión web utiliza:

- HTML5;
- CSS3;
- JavaScript en el navegador;
- `localStorage` para oraciones, diario y progreso;
- GitHub Pages;
- módulo de accesibilidad compartido de Neuronova Apps más una capa local específica.

No requiere un proceso de compilación para la versión web actual.

## Accesibilidad

Mi Momento utiliza patrones `tablist`, `tab` y `tabpanel`, navegación con teclado entre pestañas, diálogos accesibles, gestión del foco, cierre con `Escape`, regiones de estado, validación accesible de formularios, foco visible y respeto por `prefers-reduced-motion`.

Estas medidas no equivalen a una certificación WCAG. Continúan pendientes pruebas manuales sistemáticas con lectores de pantalla, zoom, alto contraste y diferentes dispositivos.

## Privacidad

Oraciones, notas, reflexiones y progreso permanecen actualmente en el navegador. No existe cuenta, sincronización remota ni base de datos propia para esos registros.

Las nuevas guías son páginas estáticas y no añaden almacenamiento personal ni tratamiento adicional de datos.

Política pública:

https://neuronova-apps.github.io/mimomento-app/privacy/

## Desarrollo local

```bash
git clone https://github.com/neuronova-apps/mimomento-app.git
cd mimomento-app
python3 -m http.server 8000
```

Después abre `http://localhost:8000`.

La rama `main` corresponde a la versión web pública. La rama `android` es actualmente preparatoria y requerirá crear la estructura Android nativa antes de poder compilarse como aplicación móvil.

## Estructura principal

- `index.html`: interfaz, estructura semántica e integración de las guías;
- `app.js`: navegación, persistencia, progreso, oraciones y diario;
- `app-a11y.js`: teclado, foco, ARIA y modales;
- `styles.css`: estilos base y responsive;
- `hero-orbit.css`: hero visual;
- `progress.css`: estados de progreso y calendario;
- `accessibility-local.css`: ajustes locales de accesibilidad;
- `footer-ecosystem.css`: footer común del ecosistema;
- `guide-cards.css`: tarjetas de recursos educativos en portada;
- `resources.css`: estilos compartidos de las guías públicas;
- `docs/editorial-model.md`: política editorial y de fuentes;
- `privacy/`: política pública;
- `assets/social/mimomento-social.png`: tarjeta social compartida de 1200×630;
- `sitemap.xml`: siete rutas públicas indexables.

## Próxima etapa

El siguiente trabajo previsto es **consolidar la documentación del proyecto**: alcance actual, arquitectura web, formato de datos, privacidad, accesibilidad, modelo editorial, publicación y roadmap, eliminando duplicaciones y dejando una referencia técnica única para el estado del MVP.

## Enlaces

- **Web:** https://neuronova-apps.github.io/mimomento-app/
- **Guía de uso:** https://neuronova-apps.github.io/mimomento-app/guia-mi-momento.html
- **Privacidad:** https://neuronova-apps.github.io/mimomento-app/privacy/
- **Repositorio:** https://github.com/neuronova-apps/mimomento-app
- **Ecosistema:** https://neuronova-apps.github.io/

## Neuronova Apps

Mi Momento forma parte de **Neuronova Apps** y comparte con el resto del ecosistema criterios de diseño, accesibilidad, privacidad, documentación y publicación web.

## Autoría

Proyecto personal e independiente desarrollado por Gabriel Berrospi dentro del ecosistema Neuronova Apps.
