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

const STORAGE_KEY = 'mimomento-local-v1';
const STORAGE_VERSION = 1;
const LEGACY_PRAYERS_KEY = 'devotionalPrayers';
const LEGACY_JOURNAL_KEY = 'devotionalJournal';
const PRAYER_CATEGORIES = new Set(['Personal', 'Familia', 'Salud', 'Estudios', 'Trabajo', 'Decisiones', 'Gratitud']);
const PRAYER_STATUSES = new Set(['active', 'answered']);

const seedPrayers = [
  { id: 1, demo: true, title: 'Por mi familia', text: 'Que podamos acompañarnos con paciencia y comprensión en las decisiones de esta semana.', category: 'Familia', date: 'Hoy', status: 'active' },
  { id: 2, demo: true, title: 'Por una decisión importante', text: 'Pido claridad para elegir con calma y actuar de manera coherente con mis valores.', category: 'Decisiones', date: 'Ayer', status: 'active' },
  { id: 3, demo: true, title: 'Por mis estudios', text: 'Constancia para avanzar y serenidad frente a las evaluaciones pendientes.', category: 'Estudios', date: '7 ago', status: 'active' },
  { id: 4, demo: true, title: 'Agradecimiento por una respuesta', text: 'Esta petición quedó resuelta mejor de lo que esperaba. Quiero conservarla como memoria de gratitud.', category: 'Gratitud', date: '4 ago', status: 'answered' },
  { id: 5, demo: true, title: 'Por la recuperación de un familiar', text: 'La situación mejoró y hoy la guardo entre las oraciones respondidas.', category: 'Familia', date: '30 jul', status: 'answered' }
];

const seedJournal = [
  { id: 1, demo: true, date: '8 agosto 2026', text: 'Hoy recordé que avanzar despacio no significa estar detenido. Necesito valorar más los pequeños progresos.' },
  { id: 2, demo: true, date: '5 agosto 2026', text: 'Me quedo con la idea de escuchar antes de responder. Fue una reflexión simple, pero necesaria para esta semana.' }
];

let storageWritable = true;
let personalPrayers = [];
let personalJournals = [];
let prayerTab = 'active';

function emptyState() {
  return { version: STORAGE_VERSION, prayers: [], journal: [] };
}

function safeStorageGet(key) {
  if (!storageWritable) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    storageWritable = false;
    return null;
  }
}

function safeStorageSet(key, value) {
  if (!storageWritable) return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    storageWritable = false;
    return false;
  }
}

function safeStorageRemove(key) {
  if (!storageWritable) return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    storageWritable = false;
    return false;
  }
}

function parseJson(raw) {
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function normalizeId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function normalizeCreatedAt(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isLegacyDemoPrayer(record) {
  return record?.demo === true || [1, 2, 3, 4, 5].includes(Number(record?.id));
}

function isLegacyDemoJournal(record) {
  return record?.demo === true || [1, 2].includes(Number(record?.id));
}

function normalizePrayer(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record) || isLegacyDemoPrayer(record)) return null;

  const id = normalizeId(record.id);
  const title = cleanText(record.title, 120);
  const text = cleanText(record.text, 1200);
  const category = PRAYER_CATEGORIES.has(record.category) ? record.category : 'Personal';
  const status = PRAYER_STATUSES.has(record.status) ? record.status : 'active';
  const date = cleanText(record.date, 60) || 'Sin fecha';

  if (!id || !title || !text) return null;

  return {
    id,
    title,
    text,
    category,
    date,
    status,
    createdAt: normalizeCreatedAt(record.createdAt)
  };
}

function normalizeJournalEntry(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record) || isLegacyDemoJournal(record)) return null;

  const id = normalizeId(record.id);
  const text = cleanText(record.text, 600);
  const date = cleanText(record.date, 60) || 'Sin fecha';

  if (!id || !text) return null;

  return {
    id,
    date,
    text,
    createdAt: normalizeCreatedAt(record.createdAt)
  };
}

function uniqueValidRecords(records, normalizer) {
  if (!Array.isArray(records)) return [];
  const seen = new Set();
  const valid = [];

  records.forEach(record => {
    const normalized = normalizer(record);
    if (!normalized || seen.has(normalized.id)) return;
    seen.add(normalized.id);
    valid.push(normalized);
  });

  return valid;
}

function normalizeState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== STORAGE_VERSION) return null;
  return {
    version: STORAGE_VERSION,
    prayers: uniqueValidRecords(value.prayers, normalizePrayer),
    journal: uniqueValidRecords(value.journal, normalizeJournalEntry)
  };
}

function writeState(state) {
  return safeStorageSet(STORAGE_KEY, JSON.stringify({
    version: STORAGE_VERSION,
    prayers: state.prayers,
    journal: state.journal
  }));
}

function migrateLegacyState() {
  const legacyPrayers = parseJson(safeStorageGet(LEGACY_PRAYERS_KEY));
  const legacyJournal = parseJson(safeStorageGet(LEGACY_JOURNAL_KEY));
  const state = {
    version: STORAGE_VERSION,
    prayers: uniqueValidRecords(legacyPrayers, normalizePrayer),
    journal: uniqueValidRecords(legacyJournal, normalizeJournalEntry)
  };

  if (writeState(state)) {
    safeStorageRemove(LEGACY_PRAYERS_KEY);
    safeStorageRemove(LEGACY_JOURNAL_KEY);
  }

  return state;
}

function loadState() {
  const raw = safeStorageGet(STORAGE_KEY);
  if (!storageWritable) return emptyState();

  if (raw === null) return migrateLegacyState();

  const parsed = parseJson(raw);
  if (!parsed) {
    const recovered = migrateLegacyState();
    writeState(recovered);
    return recovered;
  }

  if (parsed.version !== STORAGE_VERSION) {
    storageWritable = false;
    return emptyState();
  }

  const normalized = normalizeState(parsed) || emptyState();
  if (writeState(normalized)) {
    safeStorageRemove(LEGACY_PRAYERS_KEY);
    safeStorageRemove(LEGACY_JOURNAL_KEY);
  }
  return normalized;
}

function persistPersonalState() {
  return writeState({
    version: STORAGE_VERSION,
    prayers: personalPrayers,
    journal: personalJournals
  });
}

function visiblePrayers() {
  return [...personalPrayers, ...seedPrayers];
}

function visibleJournal() {
  return [...personalJournals, ...seedJournal];
}

function isDemoPrayer(prayer) {
  return prayer?.demo === true;
}

function isDemoJournal(entry) {
  return entry?.demo === true;
}

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
    <span class="eyebrow">Devocional demostrativo</span>
    <h2 id="modalTitle">Cuando necesito paciencia</h2>
    <p><strong>Eclesiastés 3:1</strong></p>
    <div class="devotional-step"><strong>Lee</strong><span>Detente un momento y vuelve a leer el texto base sin prisa.</span></div>
    <div class="devotional-step"><strong>Reflexiona</strong><span>La paciencia no siempre consiste en esperar sin hacer nada. A veces significa respetar procesos que todavía no podemos acelerar.</span></div>
    <div class="devotional-step"><strong>Pregúntate</strong><span>¿Qué situación estoy intentando apresurar y qué podría hacer hoy con mayor serenidad?</span></div>
    <div class="devotional-step"><strong>Ora</strong><span>Escribe con tus propias palabras aquello que deseas presentar hoy.</span></div>
    <p>Esta vista sirve para demostrar el flujo. La finalización del devocional todavía no se almacena ni modifica un progreso personal.</p>
    <button class="button primary modal-action" onclick="completeDevotional()">Finalizar demostración</button>
  `);
}

function completeDevotional() {
  closeModal();
  showToast('Demo finalizada. Este devocional todavía no se guarda como completado.');
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
    <span class="eyebrow">Plan demostrativo · ${p[1]}</span>
    <h2 id="modalTitle">${p[0]}</h2>
    <p>${p[2]}</p>
    <div class="devotional-step"><strong>Día 1</strong><span>Reconocer el punto de partida.</span></div>
    <div class="devotional-step"><strong>Día 2</strong><span>Nombrar aquello que ocupa mi mente.</span></div>
    <div class="devotional-step"><strong>Día 3</strong><span>Volver a lo que sí puedo hacer hoy.</span></div>
    <p>Esta es una vista de demostración. El plan todavía no se guarda, no avanza por días y no modifica el panel de progreso.</p>
    <button class="button primary modal-action" onclick="closeModal()">Cerrar vista del plan</button>
  `);
}

function openPrayerForm() {
  openModal(`
    <button class="modal-close" onclick="closeModal()">×</button>
    <span class="eyebrow">Nueva petición local</span>
    <h2 id="modalTitle">Registrar oración</h2>
    <form class="modal-form" id="prayerForm">
      <label for="prayerTitle">Título</label>
      <input id="prayerTitle" maxlength="120" required placeholder="Ej. Por mi familia" />
      <label for="prayerCategory">Categoría</label>
      <select id="prayerCategory"><option>Personal</option><option>Familia</option><option>Salud</option><option>Estudios</option><option>Trabajo</option><option>Decisiones</option><option>Gratitud</option></select>
      <label for="prayerText">Petición o reflexión</label>
      <textarea id="prayerText" maxlength="1200" required placeholder="Escribe con tus propias palabras..."></textarea>
      <button class="button primary modal-action" type="submit">Guardar oración en este navegador</button>
    </form>
  `);
  document.getElementById('prayerForm').addEventListener('submit', e => {
    e.preventDefault();
    const now = new Date();
    const record = normalizePrayer({
      id: Date.now(),
      title: document.getElementById('prayerTitle').value,
      category: document.getElementById('prayerCategory').value,
      text: document.getElementById('prayerText').value,
      date: 'Hoy',
      status: 'active',
      createdAt: now.toISOString()
    });
    if (!record) return showToast('No se pudo guardar. Revisa el título y el texto.');

    personalPrayers.unshift(record);
    const persisted = persistPersonalState();
    closeModal();
    prayerTab = 'active';
    navigate('prayers');
    showToast(persisted ? 'Oración guardada localmente' : 'Oración disponible solo durante esta sesión');
  });
}

document.getElementById('newPrayerBtn').addEventListener('click', openPrayerForm);
document.getElementById('quickPrayerBtn').addEventListener('click', openPrayerForm);

function renderPrayers() {
  const list = document.getElementById('prayerList');
  const visible = visiblePrayers().filter(p => p.status === prayerTab);
  list.innerHTML = visible.length ? visible.map(p => {
    const demo = isDemoPrayer(p);
    return `
    <article class="prayer-card">
      <div class="prayer-card-top">
        <div>
          <span class="eyebrow">${demo ? 'Ejemplo de demostración · ' : ''}${escapeHtml(p.category)}</span>
          <h3>${escapeHtml(p.title)}</h3>
        </div>
        <span class="prayer-meta">${escapeHtml(p.date)}</span>
      </div>
      <p>${escapeHtml(p.text)}</p>
      <div class="prayer-meta"><span class="category-dot"></span>${demo ? 'Ejemplo · ' : ''}${p.status === 'active' ? 'En seguimiento' : 'Oración respondida'}</div>
      ${p.status === 'active' ? `<div class="prayer-actions"><button class="small-action" onclick="markAnswered(${p.id})">Marcar respondida</button><button class="small-action" onclick="addPrayerNote(${p.id})">Ver seguimiento (demo)</button></div>` : ''}
    </article>`;
  }).join('') : `<article class="prayer-card"><p>No hay registros en esta sección.</p></article>`;
}

document.querySelectorAll('[data-prayer-tab]').forEach(btn => btn.addEventListener('click', () => {
  prayerTab = btn.dataset.prayerTab;
  document.querySelectorAll('[data-prayer-tab]').forEach(b => b.classList.toggle('active', b === btn));
  renderPrayers();
}));

function markAnswered(id) {
  if (seedPrayers.some(p => p.id === id)) {
    showToast('Los ejemplos de demostración no se modifican ni se guardan.');
    return;
  }

  const index = personalPrayers.findIndex(p => p.id === id);
  if (index < 0) return;
  personalPrayers[index] = { ...personalPrayers[index], status: 'answered', date: 'Hoy' };
  const persisted = persistPersonalState();
  renderPrayers();
  updateMetrics();
  showToast(persisted ? 'La oración pasó a respondidas' : 'Cambio disponible solo durante esta sesión');
}

function addPrayerNote(id) {
  const p = visiblePrayers().find(x => x.id === id);
  if (!p) return;
  openModal(`
    <button class="modal-close" onclick="closeModal()">×</button>
    <span class="eyebrow">Seguimiento demostrativo</span>
    <h2 id="modalTitle">${escapeHtml(p.title)}</h2>
    <p>La línea de tiempo de notas todavía no está implementada. Esta vista muestra cómo podría presentarse el seguimiento, pero no guarda observaciones.</p>
    <div class="devotional-step"><strong>Ejemplo</strong><span>Una futura nota podría registrar fecha, cambio observado y texto de seguimiento.</span></div>
    <button class="button primary modal-action" onclick="closeModal()">Cerrar demostración</button>
  `);
}

const journalText = document.getElementById('journalText');
journalText.addEventListener('input', () => document.getElementById('charCount').textContent = `${journalText.value.length}/600`);
document.getElementById('saveJournalBtn').addEventListener('click', () => {
  const now = new Date();
  const record = normalizeJournalEntry({
    id: Date.now(),
    date: new Intl.DateTimeFormat('es-PE', { day:'numeric', month:'long', year:'numeric' }).format(now),
    text: journalText.value,
    createdAt: now.toISOString()
  });
  if (!record) return showToast('Escribe una reflexión antes de guardar');

  personalJournals.unshift(record);
  const persisted = persistPersonalState();
  journalText.value = '';
  document.getElementById('charCount').textContent = '0/600';
  renderJournal();
  updateMetrics();
  showToast(persisted ? 'Reflexión guardada localmente' : 'Reflexión disponible solo durante esta sesión');
});

function renderJournal() {
  document.getElementById('journalList').innerHTML = visibleJournal().map(j => `<article class="journal-entry"><time>${isDemoJournal(j) ? 'Ejemplo de demostración · ' : ''}${escapeHtml(j.date)}</time><p>${escapeHtml(j.text)}</p></article>`).join('');
}

function updateMetrics() {
  const active = personalPrayers.filter(p => p.status === 'active').length;
  const answered = personalPrayers.filter(p => p.status === 'answered').length;
  document.getElementById('activePrayerCount').textContent = active;
  document.getElementById('answeredCount').textContent = answered;
  document.getElementById('prayerMetric').textContent = personalPrayers.length;
  document.getElementById('answeredMetric').textContent = answered;
  document.getElementById('journalMetric').textContent = personalJournals.length;
}

document.querySelectorAll('#devotionalFilters .chip').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('#devotionalFilters .chip').forEach(b => b.classList.toggle('active', b === btn));
  const filter = btn.dataset.filter;
  document.querySelectorAll('.devotional-item').forEach(item => item.style.display = filter === 'todos' || item.dataset.category === filter ? '' : 'none');
}));

document.getElementById('profileBtn').addEventListener('click', () => openModal(`
  <button class="modal-close" onclick="closeModal()">×</button>
  <span class="eyebrow">Perfil conceptual</span>
  <h2 id="modalTitle">Funciones todavía no implementadas</h2>
  <p>Esta vista representa posibilidades futuras de configuración. Actualmente no guarda recordatorios, apariencia, copias de seguridad ni preferencias de contenido.</p>
  <div class="devotional-step"><strong>Privacidad por diseño</strong><span>Las oraciones y reflexiones personales deberían mantenerse privadas por defecto.</span></div>
  <div class="devotional-step"><strong>Accesibilidad</strong><span>Tamaño de texto, contraste, lectura sencilla y controles claros deben validarse antes de realizar afirmaciones formales de conformidad.</span></div>
  <button class="button primary modal-action" onclick="closeModal()">Cerrar</button>
`));

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[ch]));
}

const initialState = loadState();
personalPrayers = initialState.prayers;
personalJournals = initialState.journal;

setDateGreeting();
renderPrayers();
renderJournal();
updateMetrics();
