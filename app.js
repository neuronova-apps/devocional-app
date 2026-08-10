const screens = {
  home: document.getElementById('homeScreen'),
  devotionals: document.getElementById('devotionalsScreen'),
  prayers: document.getElementById('prayersScreen'),
  journal: document.getElementById('journalScreen'),
  progress: document.getElementById('progressScreen')
};

const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');
const toast = document.getElementById('toast');

const seedPrayers = [
  { id: 1, title: 'Por mi familia', text: 'Que podamos acompañarnos con paciencia y comprensión en las decisiones de esta semana.', category: 'Familia', date: 'Hoy', status: 'active' },
  { id: 2, title: 'Por una decisión importante', text: 'Pido claridad para elegir con calma y actuar de manera coherente con mis valores.', category: 'Decisiones', date: 'Ayer', status: 'active' },
  { id: 3, title: 'Por mis estudios', text: 'Constancia para avanzar y serenidad frente a las evaluaciones pendientes.', category: 'Estudios', date: '7 ago', status: 'active' },
  { id: 4, title: 'Agradecimiento por una respuesta', text: 'Esta petición quedó resuelta mejor de lo que esperaba. Quiero conservarla como memoria de gratitud.', category: 'Gratitud', date: '4 ago', status: 'answered' },
  { id: 5, title: 'Por la recuperación de un familiar', text: 'La situación mejoró y hoy la guardo entre las oraciones respondidas.', category: 'Familia', date: '30 jul', status: 'answered' }
];

const seedJournal = [
  { id: 1, date: '8 agosto 2026', text: 'Hoy recordé que avanzar despacio no significa estar detenido. Necesito valorar más los pequeños progresos.' },
  { id: 2, date: '5 agosto 2026', text: 'Me quedo con la idea de escuchar antes de responder. Fue una reflexión simple, pero necesaria para esta semana.' }
];

let prayers = JSON.parse(localStorage.getItem('devotionalPrayers') || 'null') || seedPrayers;
let journals = JSON.parse(localStorage.getItem('devotionalJournal') || 'null') || seedJournal;
let prayerTab = 'active';

function navigate(target) {
  Object.entries(screens).forEach(([key, el]) => el.classList.toggle('active', key === target));
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.nav === target));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (target === 'prayers') renderPrayers();
  if (target === 'journal') renderJournal();
  if (target === 'progress') updateMetrics();
}

document.addEventListener('click', (event) => {
  const nav = event.target.closest('[data-nav]');
  if (nav) navigate(nav.dataset.nav);

  const plan = event.target.closest('[data-open-plan]');
  if (plan) openPlan(plan.dataset.openPlan);

  const devotional = event.target.closest('[data-open-devotional]');
  if (devotional) openTodayDevotional();
});

document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.nav)));

function setDateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  document.getElementById('greeting').textContent = greeting;
  document.getElementById('dateLabel').textContent = new Intl.DateTimeFormat('es-PE', { weekday:'long', day:'numeric', month:'long' }).format(now);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function openModal(html) {
  modalContent.innerHTML = html;
  modalBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = '';
}

modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function openTodayDevotional() {
  openModal(`
    <button class="modal-close" onclick="closeModal()">×</button>
    <span class="eyebrow">Devocional de hoy</span>
    <h2 id="modalTitle">Cuando necesito paciencia</h2>
    <p><strong>Eclesiastés 3:1</strong></p>
    <div class="devotional-step"><strong>Lee</strong><span>Detente un momento y vuelve a leer el texto base sin prisa.</span></div>
    <div class="devotional-step"><strong>Reflexiona</strong><span>La paciencia no siempre consiste en esperar sin hacer nada. A veces significa respetar procesos que todavía no podemos acelerar.</span></div>
    <div class="devotional-step"><strong>Pregúntate</strong><span>¿Qué situación estoy intentando apresurar y qué podría hacer hoy con mayor serenidad?</span></div>
    <div class="devotional-step"><strong>Ora</strong><span>Escribe con tus propias palabras aquello que deseas presentar hoy.</span></div>
    <button class="primary-button" style="width:100%;background:var(--primary);color:white" onclick="completeDevotional()">Marcar como completado</button>
  `);
}

function completeDevotional() {
  closeModal();
  showToast('Devocional completado. Tu reflexión queda para ti.');
}

const planCopy = {
  calma: ['Volver a la calma', '7 días', 'Una pausa diaria para bajar el ruido, ordenar pensamientos y reencontrar serenidad.'],
  gratitud: ['Gratitud cotidiana', '14 días', 'Pequeñas prácticas para reconocer lo recibido y cerrar el día con una mirada más agradecida.'],
  familia: ['Orar por los míos', '10 días', 'Un recorrido para pensar en la familia, sus necesidades, vínculos y motivos de gratitud.'],
  proposito: ['Caminar con propósito', '21 días', 'Reflexiones sobre decisiones, paciencia, dirección y coherencia con lo que valoras.']
};

function openPlan(key) {
  const p = planCopy[key] || planCopy.calma;
  openModal(`
    <button class="modal-close" onclick="closeModal()">×</button>
    <span class="eyebrow">Plan devocional · ${p[1]}</span>
    <h2 id="modalTitle">${p[0]}</h2>
    <p>${p[2]}</p>
    <div class="devotional-step"><strong>Día 1</strong><span>Reconocer el punto de partida.</span></div>
    <div class="devotional-step"><strong>Día 2</strong><span>Nombrar aquello que ocupa mi mente.</span></div>
    <div class="devotional-step"><strong>Día 3</strong><span>Volver a lo que sí puedo hacer hoy.</span></div>
    <p>En la versión final, cada día podría incluir lectura, reflexión, pregunta personal, oración y registro en el diario.</p>
    <button class="primary-button" style="width:100%;background:var(--primary);color:white" onclick="closeModal();showToast('Plan guardado en tu biblioteca')">Guardar plan</button>
  `);
}

function openPrayerForm() {
  openModal(`
    <button class="modal-close" onclick="closeModal()">×</button>
    <span class="eyebrow">Nueva petición</span>
    <h2 id="modalTitle">Registrar oración</h2>
    <form class="modal-form" id="prayerForm">
      <label>Título</label>
      <input id="prayerTitle" required placeholder="Ej. Por mi familia" />
      <label>Categoría</label>
      <select id="prayerCategory"><option>Personal</option><option>Familia</option><option>Salud</option><option>Estudios</option><option>Trabajo</option><option>Decisiones</option><option>Gratitud</option></select>
      <label>Petición o reflexión</label>
      <textarea id="prayerText" required placeholder="Escribe con tus propias palabras..."></textarea>
      <button class="primary-button" type="submit" style="background:var(--primary);color:white">Guardar oración</button>
    </form>
  `);
  document.getElementById('prayerForm').addEventListener('submit', e => {
    e.preventDefault();
    prayers.unshift({
      id: Date.now(),
      title: document.getElementById('prayerTitle').value.trim(),
      category: document.getElementById('prayerCategory').value,
      text: document.getElementById('prayerText').value.trim(),
      date: 'Hoy', status: 'active'
    });
    persistPrayers();
    closeModal();
    prayerTab = 'active';
    navigate('prayers');
    showToast('Oración guardada');
  });
}

document.getElementById('newPrayerBtn').addEventListener('click', openPrayerForm);
document.getElementById('quickPrayerBtn').addEventListener('click', openPrayerForm);

function persistPrayers() {
  localStorage.setItem('devotionalPrayers', JSON.stringify(prayers));
  updateMetrics();
}

function renderPrayers() {
  const list = document.getElementById('prayerList');
  const visible = prayers.filter(p => p.status === prayerTab);
  list.innerHTML = visible.length ? visible.map(p => `
    <article class="prayer-card">
      <div class="prayer-card-top">
        <div>
          <span class="eyebrow">${p.category}</span>
          <h3>${escapeHtml(p.title)}</h3>
        </div>
        <span class="prayer-meta">${p.date}</span>
      </div>
      <p>${escapeHtml(p.text)}</p>
      <div class="prayer-meta"><span class="category-dot"></span>${p.status === 'active' ? 'En seguimiento' : 'Oración respondida'}</div>
      ${p.status === 'active' ? `<div class="prayer-actions"><button class="small-action" onclick="markAnswered(${p.id})">Marcar respondida</button><button class="small-action" onclick="addPrayerNote(${p.id})">Añadir nota</button></div>` : ''}
    </article>`).join('') : `<article class="prayer-card"><p>No hay registros en esta sección.</p></article>`;
}

document.querySelectorAll('[data-prayer-tab]').forEach(btn => btn.addEventListener('click', () => {
  prayerTab = btn.dataset.prayerTab;
  document.querySelectorAll('[data-prayer-tab]').forEach(b => b.classList.toggle('active', b === btn));
  renderPrayers();
}));

function markAnswered(id) {
  prayers = prayers.map(p => p.id === id ? { ...p, status:'answered', date:'Hoy' } : p);
  persistPrayers();
  renderPrayers();
  showToast('La oración pasó a respondidas');
}

function addPrayerNote(id) {
  const p = prayers.find(x => x.id === id);
  openModal(`
    <button class="modal-close" onclick="closeModal()">×</button>
    <span class="eyebrow">Seguimiento</span>
    <h2 id="modalTitle">${escapeHtml(p.title)}</h2>
    <p>En una versión completa, aquí aparecería una línea de tiempo con notas, fechas, cambios y textos asociados a esta petición.</p>
    <div class="devotional-step"><strong>Hoy</strong><span>Puedes añadir una observación sobre cómo ha cambiado la situación.</span></div>
    <button class="primary-button" style="width:100%;background:var(--primary);color:white" onclick="closeModal();showToast('Nota de seguimiento simulada')">Añadir nota</button>
  `);
}

const journalText = document.getElementById('journalText');
journalText.addEventListener('input', () => document.getElementById('charCount').textContent = `${journalText.value.length}/600`);
document.getElementById('saveJournalBtn').addEventListener('click', () => {
  const text = journalText.value.trim();
  if (!text) return showToast('Escribe una reflexión antes de guardar');
  journals.unshift({ id: Date.now(), date: new Intl.DateTimeFormat('es-PE',{day:'numeric',month:'long',year:'numeric'}).format(new Date()), text });
  localStorage.setItem('devotionalJournal', JSON.stringify(journals));
  journalText.value = '';
  document.getElementById('charCount').textContent = '0/600';
  renderJournal(); updateMetrics(); showToast('Reflexión guardada');
});

function renderJournal() {
  document.getElementById('journalList').innerHTML = journals.map(j => `<article class="journal-entry"><time>${j.date}</time><p>${escapeHtml(j.text)}</p></article>`).join('');
}

function updateMetrics() {
  const active = prayers.filter(p => p.status === 'active').length;
  const answered = prayers.filter(p => p.status === 'answered').length;
  document.getElementById('activePrayerCount').textContent = active;
  document.getElementById('answeredCount').textContent = answered + 12;
  document.getElementById('prayerMetric').textContent = prayers.length + 15;
  document.getElementById('answeredMetric').textContent = answered + 12;
  document.getElementById('journalMetric').textContent = journals.length + 10;
}

document.querySelectorAll('#devotionalFilters .chip').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('#devotionalFilters .chip').forEach(b => b.classList.toggle('active', b === btn));
  const filter = btn.dataset.filter;
  document.querySelectorAll('.devotional-item').forEach(item => item.style.display = filter === 'todos' || item.dataset.category === filter ? 'flex' : 'none');
}));

document.getElementById('profileBtn').addEventListener('click', () => openModal(`
  <button class="modal-close" onclick="closeModal()">×</button>
  <span class="eyebrow">Perfil</span>
  <h2 id="modalTitle">Tu espacio personal</h2>
  <p>La propuesta contempla ajustes de recordatorios, tamaño de texto, apariencia, privacidad, copia de seguridad y preferencias de contenido.</p>
  <div class="devotional-step"><strong>Privacidad por diseño</strong><span>Las oraciones y reflexiones personales deberían mantenerse privadas por defecto.</span></div>
  <div class="devotional-step"><strong>Accesibilidad</strong><span>Tamaño de texto, contraste, lectura sencilla y controles claros desde la primera versión.</span></div>
  <button class="primary-button" style="width:100%;background:var(--primary);color:white" onclick="closeModal()">Cerrar</button>
`));

function escapeHtml(value='') {
  return value.replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
}

setDateGreeting();
renderPrayers();
renderJournal();
updateMetrics();
