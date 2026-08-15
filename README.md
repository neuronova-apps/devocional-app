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
- accesibilidad específica para pestañas, formularios, modales, estados dinámicos y navegación por teclado.

Los planes conceptuales pueden contemplar más días, pero el porcentaje actual se calcula únicamente sobre las 12 sesiones realmente publicadas.

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

- `index.html`: interfaz y estructura semántica;
- `app.js`: navegación, persistencia, progreso, oraciones y diario;
- `app-a11y.js`: teclado, foco, ARIA y modales;
- `styles.css`: estilos base y responsive;
- `hero-orbit.css`: hero visual;
- `progress.css`: estados de progreso y calendario;
- `accessibility-local.css`: ajustes locales de accesibilidad;
- `footer-ecosystem.css`: footer común del ecosistema;
- `privacy/`: política pública;
- `assets/social/`: imagen social;
- `sitemap.xml`: rutas indexables.

## Enlaces

- **Web:** https://neuronova-apps.github.io/mimomento-app/
- **Privacidad:** https://neuronova-apps.github.io/mimomento-app/privacy/
- **Repositorio:** https://github.com/neuronova-apps/mimomento-app
- **Ecosistema:** https://neuronova-apps.github.io/

## Neuronova Apps

Mi Momento forma parte de **Neuronova Apps** y comparte con el resto del ecosistema criterios de diseño, accesibilidad, privacidad, documentación y publicación web.

## Autoría

Proyecto personal e independiente desarrollado por Gabriel Berrospi dentro del ecosistema Neuronova Apps.
