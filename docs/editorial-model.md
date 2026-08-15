# Modelo editorial y de fuentes de Mi Momento

Este documento define cómo debe redactarse, revisar y publicar el contenido devocional y educativo de Mi Momento. Su objetivo es mantener una separación clara entre **texto bíblico**, **referencia bíblica**, **reflexión editorial** y **preguntas personales**.

## Principios

1. **Referencias verificables.** Cuando un contenido se apoye en un pasaje bíblico, debe indicar libro, capítulo y versículo o rango de versículos.
2. **Paráfrasis propia por defecto.** Las ideas bíblicas se explican principalmente con redacción propia. No se reproducen pasajes extensos ni se presenta una paráfrasis como si fuera una cita literal.
3. **Reflexión, no autoridad doctrinal.** Los devocionales y guías ofrecen preguntas y propuestas de reflexión. No deben presentar una tradición, interpretación debatida o experiencia personal como la única lectura universalmente válida.
4. **Sin promesas de resultado.** El contenido no promete curación, éxito, respuesta divina específica, reducción garantizada de ansiedad ni otros resultados espirituales, médicos o psicológicos.
5. **Privacidad y autonomía.** Las invitaciones a escribir oraciones o reflexiones deben recordar que la persona decide qué registrar. No se debe incentivar a guardar información que requiera mayor protección que el almacenamiento local del navegador.
6. **Lenguaje respetuoso.** Evitar culpa, coerción, miedo, presión para mantener rachas o afirmaciones que equiparen una métrica de la aplicación con crecimiento espiritual.

## Tipos de fuente

### 1. Referencia bíblica

Se registra como ancla del contenido, por ejemplo `Eclesiastés 3:1`. La referencia debe poder comprobarse en una edición bíblica legítima.

Si se utiliza texto literal de una traducción, debe identificarse la traducción y respetarse su licencia o condiciones de uso. Para la web pública se prioriza la paráfrasis propia acompañada de la referencia.

### 2. Reflexión editorial propia

Texto escrito para Mi Momento a partir del tema del contenido. Debe distinguirse visual y editorialmente de cualquier texto bíblico citado.

### 3. Pregunta o ejercicio personal

Invitación abierta como “¿Qué situación necesitas mirar con más calma?”. No se trata de una afirmación doctrinal ni de una evaluación clínica.

### 4. Fuente secundaria externa

Si en el futuro se utiliza un libro, artículo, estudio u otra fuente externa, debe registrarse autor, título, fecha cuando exista y enlace o dato bibliográfico suficiente. No se copiarán fragmentos extensos ni material sin atribución.

## Modelo mínimo de una pieza devocional

Cada pieza nueva debería documentar como mínimo:

- `id`: identificador estable;
- `title`: título breve;
- `theme`: tema principal;
- `summary`: propósito del contenido;
- `biblicalReferences`: cero o más referencias explícitas;
- `reflection`: reflexión redactada para Mi Momento;
- `questions`: preguntas abiertas de reflexión;
- `prayerPrompt`: invitación opcional a orar con palabras propias;
- `sourceNotes`: notas sobre traducciones o fuentes externas utilizadas;
- `status`: `draft`, `reviewed`, `published` o `retired`;
- `review`: comprobaciones editoriales realizadas.

## Revisión antes de publicar

Antes de marcar una pieza como `published` se debe comprobar:

- que las referencias bíblicas correspondan al tema descrito;
- que una paráfrasis no esté presentada entre comillas como cita textual;
- que el texto propio y la fuente bíblica estén claramente diferenciados;
- que no se afirme como universal una cuestión doctrinal discutida;
- que no existan promesas médicas, psicológicas, financieras o espirituales de resultado;
- que las preguntas sean abiertas y no coercitivas;
- que las fuentes externas, si existen, estén atribuidas;
- que el contenido siga siendo comprensible sin depender de una métrica, racha o función de la aplicación.

## Estado del contenido actual

La biblioteca pública de la demo continúa siendo limitada y demostrativa. Las duraciones conceptuales de los planes no equivalen a contenido completo publicado. El progreso solo debe calcularse sobre sesiones realmente disponibles.

Las nuevas guías públicas son contenido educativo estático: leerlas no modifica oraciones, diario, progreso ni `localStorage`.
