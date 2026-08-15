# Mi Momento

Mi Momento es una aplicación de Neuronova Apps orientada a devocionales, oración personal, diario de reflexión y seguimiento local del recorrido espiritual.

## Estado del proyecto

- **Web:** demo funcional en desarrollo activo.
- **Publicación:** disponible mediante GitHub Pages.
- **Android:** la rama `android` es preparatoria y todavía no contiene un proyecto Android nativo compilable con Gradle, módulo `app` y `AndroidManifest.xml`.

## Alcance actual

La versión pública permite utilizar una muestra funcional de devocionales, oraciones, diario y seguimiento local. Las métricas representan actividad dentro de la aplicación y no se presentan como medida de crecimiento espiritual. El proyecto no promete resultados espirituales, médicos o psicológicos por completar sesiones, mantener rachas o registrar oraciones.

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
- cinco guías educativas públicas e indexables.

Los planes conceptuales pueden contemplar más días, pero el porcentaje actual se calcula únicamente sobre las 12 sesiones realmente publicadas.

## Modelo editorial y de fuentes

El contrato editorial se documenta en `docs/editorial-model.md`. Cada apoyo bíblico utiliza una referencia explícita; la web prioriza paráfrasis editorial propia; reflexión, texto fuente y preguntas personales se distinguen entre sí; y cualquier cita literal futura debe identificar su traducción y respetar sus condiciones de uso.

Las preguntas se formulan como invitaciones abiertas y no como interpretaciones doctrinales universales. Cualquier fuente secundaria externa futura debe documentar autor, título y referencia suficiente para su atribución.

## Tecnología

La versión web utiliza HTML5, CSS3, JavaScript en el navegador, `localStorage` para oraciones, diario y progreso, GitHub Pages y el módulo compartido de accesibilidad de Neuronova Apps más una capa local específica. No requiere un proceso de compilación para la versión web actual.

## Accesibilidad

Mi Momento utiliza patrones `tablist`, `tab` y `tabpanel`, navegación con teclado, diálogos accesibles, gestión del foco, cierre con `Escape`, regiones de estado, validación accesible de formularios, foco visible y respeto por `prefers-reduced-motion`.

La superficie pública forma parte de la auditoría automática central del ecosistema. Estas medidas no equivalen a una certificación WCAG. Continúan pendientes pruebas manuales sistemáticas con lectores de pantalla, zoom, alto contraste y diferentes dispositivos.

## Privacidad

Oraciones, notas, reflexiones y progreso permanecen actualmente en el navegador. No existe cuenta, sincronización remota ni base de datos propia para esos registros. Las guías son páginas estáticas y no añaden almacenamiento personal adicional.

Política pública: https://neuronova-apps.github.io/mimomento-app/privacy/

## Limitaciones conocidas

La biblioteca pública continúa siendo una muestra y no representa todavía el contenido definitivo previsto. El progreso se limita a las sesiones efectivamente publicadas. No existe sincronización entre dispositivos. La rama Android todavía no es un proyecto nativo compilable. La revisión manual completa de accesibilidad permanece pendiente.

## Roadmap

Las prioridades son ampliar y consolidar la biblioteca de contenidos y planes, mantener el modelo editorial y de fuentes, completar la documentación técnica de la arquitectura y los datos, profundizar las pruebas manuales de accesibilidad y definir una estrategia móvil antes de considerar una versión Android estable.

## Desarrollo local

```bash
git clone https://github.com/neuronova-apps/mimomento-app.git
cd mimomento-app
python3 -m http.server 8000
```

Después abre `http://localhost:8000`. La rama `main` corresponde a la versión web pública y la rama `android` sigue siendo preparatoria.

## Estructura principal

- `index.html`: interfaz, estructura semántica e integración de guías;
- `app.js`: navegación, persistencia, progreso, oraciones y diario;
- `app-a11y.js`: teclado, foco, ARIA y modales;
- hojas CSS: estilos base, progreso, accesibilidad local, footer y recursos;
- `docs/editorial-model.md`: política editorial y de fuentes;
- páginas HTML educativas: cinco guías públicas;
- `privacy/`: política pública;
- `assets/social/mimomento-social.png`: tarjeta social 1200 × 630;
- `sitemap.xml`: rutas públicas indexables.

## Enlaces

- **Web:** https://neuronova-apps.github.io/mimomento-app/
- **Guía de uso:** https://neuronova-apps.github.io/mimomento-app/guia-mi-momento.html
- **Privacidad:** https://neuronova-apps.github.io/mimomento-app/privacy/
- **Repositorio:** https://github.com/neuronova-apps/mimomento-app
- **Ecosistema:** https://neuronova-apps.github.io/

## Neuronova Apps

Mi Momento forma parte de Neuronova Apps y comparte con el resto del ecosistema criterios de diseño, accesibilidad, privacidad, documentación y publicación web, manteniendo su evolución funcional en un repositorio independiente.

## Autoría

Proyecto personal e independiente desarrollado por Gabriel Berrospi dentro del ecosistema Neuronova Apps.

## Última revisión

2026-08-15
