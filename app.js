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

const PLAN_STEPS = [
  'Reconocer el punto de partida.',
  'Nombrar aquello que ocupa mi mente.',
  'Volver a lo que sí puedo hacer hoy.'
];

const PLAN_DEFINITIONS = {
  calma: {
    title: 'Volver a la calma',
    duration: '7 días',
    description: 'Una pausa diaria para bajar el ruido, ordenar pensamientos y reencontrar serenidad.'
  },
  gratitud: {
    title: 'Gratitud cotidiana',
    duration: '14 días',
    description: 'Pequeñas prácticas para reconocer lo recibido y cerrar el día con una mirada más agradecida.'
  },
  familia: {
    title: 'Orar por los míos',
    duration: '10 días',
    description: 'Un recorrido para pensar en la familia, sus necesidades, vínculos y motivos de gratitud.'
  },
  proposito: {
    title: 'Caminar con propósito',
    duration: '21 días',
    description: 'Reflexiones sobre decisiones, paciencia, dirección y coherencia con lo que valoras.'
  }
};

const PLAN_KEYS = Object.keys(PLAN_DEFINITIONS);
const AVAILABLE_PLAN_SESSIONS = PLAN_STEPS.length;
const TOTAL_AVAILABLE_PLAN_SESSIONS = PLAN_KEYS.length * AVAILABLE_PLAN_SESSIONS;

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
let devotionalProgress = emptyDevotionalProgress();
let prayerTab = 'active';

function emptyDevotionalProgress() {
  return {
    daily: [],
    plans: Object.fromEntries(PLAN_KEYS.map(key => [key, []]))
  };
}

function emptyState() {
  return {
    version: STORAGE_VERSION,
    prayers: [],
    journal: [],
    devotional: emptyDevotionalProgress()
  };
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

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeDateKey(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return value;
}

function dateKeyToDayNumber(value) {
  const normalized = normalizeDateKey(value);
  if (!normalized) return null;
  const [year, month, day] = normalized.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
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

function normalizeDailyCompletion(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
  const date = normalizeDateKey(record.date);
  const completedAt = normalizeCreatedAt(record.completedAt);
  if (!date || !completedAt) return null;
  return { date, completedAt };
}

function normalizeDailyCompletions(records) {
  if (!Array.isArray(records)) return [];
  const byDate = new Map();
  records.forEach(record => {
    const normalized = normalizeDailyCompletion(record);
    if (normalized && !byDate.has(normalized.date)) byDate.set(normalized.date, normalized);
  });
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function normalizePlanCompletion(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
  const session = Number(record.session);
  const date = normalizeDateKey(record.date);
  const completedAt = normalizeCreatedAt(record.completedAt);
  if (!Number.isInteger(session) || session < 1 || session > AVAILABLE_PLAN_SESSIONS || !date || !completedAt) return null;
  return { session, date, completedAt };
}

function normalizePlanCompletions(records) {
  if (!Array.isArray(records)) return [];
  const bySession = new Map();
  records.forEach(record => {
    const normalized = normalizePlanCompletion(record);
    if (normalized && !bySession.has(normalized.session)) bySession.set(normalized.session, normalized);
  });

  const sequential = [];
  for (let session = 1; session <= AVAILABLE_PLAN_SESSIONS; session += 1) {
    if (!bySession.has(session)) break;
    sequential.push(bySession.get(session));
  }
  return sequential;
}

function normalizeDevotionalProgress(value) {
  const normalized = emptyDevotionalProgress();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return normalized;

  normalized.daily = normalizeDailyCompletions(value.daily);
  const plans = value.plans && typeof value.plans === 'object' && !Array.isArray(value.plans) ? value.plans : {};
  PLAN_KEYS.forEach(key => {
    normalized.plans[key] = normalizePlanCompletions(plans[key]);
  });
  return normalized;
}

function normalizeState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== STORAGE_VERSION) return null;
  return {
    version: STORAGE_VERSION,
    prayers: uniqueValidRecords(value.prayers, normalizePrayer),
    journal: uniqueValidRecords(value.journal, normalizeJournalEntry),
    devotional: normalizeDevotionalProgress(value.devotional)
  };
}

function writeState(state) {
  return safeStorageSet(STORAGE_KEY, JSON.stringify({
    version: STORAGE_VERSION,
    prayers: state.prayers,
    journal: state.journal,
    devotional: normalizeDevotionalProgress(state.devotional)
  }));
}

function migrateLegacyState() {
  const legacyPrayers = parseJson(safeStorageGet(LEGACY_PRAYERS_KEY));
  const legacyJournal = parseJson(safeStorageGet(LEGACY_JOURNAL_KEY));
  const state = {
    version: STORAGE_VERSION,
    prayers: uniqueValidRecords(legacyPrayers, normalizePrayer),
    journal: uniqueValidRecords(legacyJournal, normalizeJournalEntry),
    devotional: emptyDevotionalProgress()
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
    journal: personalJournals,
    devotional: devotionalProgress
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

function devotionalActivityDates() {
  const dates = new Set(devotionalProgress.daily.map(item => item.date));
  PLAN_KEYS.forEach(key => {
    devotionalProgress.plans[key].forEach(item => dates.add(item.date));
  });
  return dates;
}

function planCompletedSessions(key) {
  return devotionalProgress.plans[key]?.length || 0;
}

function totalCompletedPlanSessions() {
  return PLAN_KEYS.reduce((total, key) => total + planCompletedSessions(key), 0);
}

function totalDevotionalSessions() {
  return devotionalProgress.daily.length + totalCompletedPlanSessions();
}

function calculateDevotionalStreak() {
  const activity = devotionalActivityDates();
  if (!activity.size) return 0;

  const today = dateKeyToDayNumber(localDateKey());
  const activeDays = new Set([...activity].map(dateKeyToDayNumber).filter(Number.isInteger));
  let cursor = activeDays.has(today) ? today : today - 1;
  if (!activeDays.has(cursor)) return 0;

  let streak = 0;
  while (activeDays.has(cursor)) {
    streak += 1;
    cursor -= 1;
  }
  return streak;
}

function renderActivityGrid() {
  const grid = document.getElementById('activityGrid');
  if (!grid) return;

  const activeDates = devotionalActivityDates();
  const today = new Date();
  const cells = [];

  for (let offset = 27; offset >= 0; offset -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    const key = localDateKey(date);
    const active = activeDates.has(key);
    const label = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' }).format(date);
    cells.push(`<span class="${active ? 'active' : ''}" aria-hidden="true" title="${label}: ${active ? 'con actividad' : 'sin actividad'}"></span>`);
  }

  grid.innerHTML = cells.join('');
  const recentCount = [...activeDates].filter(key => {
    const day = dateKeyToDayNumber(key);
    const todayNumber = dateKeyToDayNumber(localDateKey(today));
    return Number.isInteger(day) && day >= todayNumber - 27 && day <= todayNumber;
  }).length;
  grid.setAttribute('aria-label', `Actividad devocional real de los últimos 28 días: ${recentCount} días con actividad.`);
}

function renderDevotionalProgress() {
  const todayKey = localDateKey();
  const completedToday = devotionalProgress.daily.some(item => item.date === todayKey);
  const dailyLabel = document.getElementById('dailyDevotionalLabel');
  const dailyButton = document.getElementById('dailyDevotionalButton');
  const streakNode = document.getElementById('streakCount');

  if (dailyLabel) dailyLabel.textContent = completedToday ? 'Devocional completado hoy' : 'Devocional de muestra de hoy';
  if (dailyButton) dailyButton.textContent = completedToday ? 'Revisar devocional' : 'Comenzar devocional';
  if (streakNode) streakNode.textContent = calculateDevotionalStreak();

  PLAN_KEYS.forEach(key => {
    const completed = planCompletedSessions(key);
    const percent = Math.round((completed / AVAILABLE_PLAN_SESSIONS) * 100);
    const status = document.getElementById(`planStatus-${key}`);
    const progress = document.getElementById(`planProgress-${key}`);
    const homeStatus = document.getElementById(`homePlan-${key}`);
    if (status) status.textContent = `${PLAN_DEFINITIONS[key].duration} · ${completed}/${AVAILABLE_PLAN_SESSIONS} sesiones disponibles`;
    if (progress) progress.style.width = `${percent}%`;
    if (homeStatus) homeStatus.textContent = `${completed}/${AVAILABLE_PLAN_SESSIONS} sesiones · ${PLAN_DEFINITIONS[key].duration}`;
  });

  const completedPlanSessions = totalCompletedPlanSessions();
  const percent = Math.round((completedPlanSessions / TOTAL_AVAILABLE_PLAN_SESSIONS) * 100);
  const ring = document.getElementById('devotionalProgressRing');
  const percentNode = document.getElementById('devotionalProgressPercent');
  const title = document.getElementById('devotionalProgressTitle');
  const summary = document.getElementById('devotionalProgressSummary');
  const devotionalMetric = document.getElementById('devotionalMetric');
  const activityDaysMetric = document.getElementById('activityDaysMetric');

  if (ring) ring.style.setProperty('--value', percent);
  if (percentNode) percentNode.textContent = `${percent}%`;
  if (title) title.textContent = `${completedPlanSessions} de ${TOTAL_AVAILABLE_PLAN_SESSIONS} sesiones de plan completadas`;
  if (summary) summary.textContent = 'El porcentaje usa únicamente las tres sesiones disponibles de cada plan de muestra. El devocional diario suma actividad, pero no altera este porcentaje.';
  if (devotionalMetric) devotionalMetric.textContent = totalDevotionalSessions();
  if (activityDaysMetric) activityDaysMetric.textContent = devotionalActivityDates().size;

  renderActivityGrid();
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
  const completedToday = devotionalProgress.daily.some(item => item.date === localDateKey());
  openModal(`
    <button class="modal-close" onclick="closeModal()" aria-label="Cerrar">×</button>
    <span class="eyebrow">Devocional de muestra</span>
    <h2 id="modalTitle">Cuando necesito paciencia</h2>
    <p><strong>Eclesiastés 3:1</strong></p>
    <div class="devotional-step"><strong>Lee</strong><span>Detente un momento y vuelve a leer el texto base sin prisa.</span></div>
    <div class="devotional-step"><strong>Reflexiona</strong><span>La paciencia no siempre consiste en esperar sin hacer nada. A veces significa respetar procesos que todavía no podemos acelerar.</span></div>
    <div class="devotional-step"><strong>Pregúntate</strong><span>¿Qué situación estoy intentando apresurar y qué podría hacer hoy con mayor serenidad?</span></div>
    <div class="devotional-step"><strong>Ora</strong><span>Escribe con tus propias palabras aquello que deseas presentar hoy.</span></div>
    <p>${completedToday ? 'Este devocional ya está registrado como completado hoy.' : 'Al marcarlo como completado, se añadirá una actividad devocional real de hoy en este navegador.'}</p>
    ${completedToday
      ? '<button class="button primary modal-action" type="button" disabled>Completado hoy</button>'
      : '<button class="button primary modal-action" type="button" onclick="completeDevotional()">Marcar como completado</button>'}
  `);
}

function completeDevotional() {
  const today = localDateKey();
  if (devotionalProgress.daily.some(item => item.date === today)) {
    closeModal();
    showToast('Este devocional ya estaba registrado hoy.');
    return;
  }

  devotionalProgress.daily.push({ date: today, completedAt: new Date().toISOString() });
  devotionalProgress.daily = normalizeDailyCompletions(devotionalProgress.daily);
  const persisted = persistPersonalState();
  closeModal();
  updateMetrics();
  showToast(persisted ? 'Devocional completado y guardado localmente' : 'Devocional completado solo durante esta sesión');
}

function openPlan(key) {
  const plan = PLAN_DEFINITIONS[key];
  if (!plan) return;

  const completed = planCompletedSessions(key);
  const nextSession = completed + 1;
  const steps = PLAN_STEPS.map((step, index) => {
    const session = index + 1;
    const isCompleted = session <= completed;
    return `<div class="devotional-step ${isCompleted ? 'completed' : ''}"><strong>Sesión ${session}${isCompleted ? ' · completada' : ''}</strong><span>${step}</span></div>`;
  }).join('');

  openModal(`
    <button class="modal-close" onclick="closeModal()" aria-label="Cerrar">×</button>
    <span class="eyebrow">Plan de muestra · ${plan.duration}</span>
    <h2 id="modalTitle">${plan.title}</h2>
    <p>${plan.description}</p>
    ${steps}
    <p>Esta demo contiene ${AVAILABLE_PLAN_SESSIONS} sesiones reales de muestra. La duración de ${plan.duration} describe el concepto del plan completo; los días restantes todavía no tienen contenido publicado aquí.</p>
    ${nextSession <= AVAILABLE_PLAN_SESSIONS
      ? `<button class="button primary modal-action" type="button" onclick="completePlanSession('${key}')">Marcar sesión ${nextSession} como completada</button>`
      : '<button class="button primary modal-action" type="button" disabled>Sesiones disponibles completadas</button>'}
  `);
}

function completePlanSession(key) {
  if (!PLAN_DEFINITIONS[key]) return;
  const completed = planCompletedSessions(key);
  const nextSession = completed + 1;
  if (nextSession > AVAILABLE_PLAN_SESSIONS) {
    closeModal();
    showToast('Ya completaste las sesiones disponibles de este plan.');
    return;
  }

  devotionalProgress.plans[key].push({
    session: nextSession,
    date: localDateKey(),
    completedAt: new Date().toISOString()
  });
  devotionalProgress.plans[key] = normalizePlanCompletions(devotionalProgress.plans[key]);
  const persisted = persistPersonalState();
  closeModal();
  updateMetrics();
  showToast(persisted ? `Sesión ${nextSession} guardada en tu progreso` : `Sesión ${nextSession} disponible solo durante esta sesión`);
}

function openPrayerForm() {
  openModal(`
    <button class="modal-close" onclick="closeModal()" aria-label="Cerrar">×</button>
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
    <button class="modal-close" onclick="closeModal()" aria-label="Cerrar">×</button>
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
  document.getElementById('journalMetric').textContent = personalJournals.length;
  renderDevotionalProgress();
}

document.querySelectorAll('#devotionalFilters .chip').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('#devotionalFilters .chip').forEach(b => b.classList.toggle('active', b === btn));
  const filter = btn.dataset.filter;
  document.querySelectorAll('.devotional-item').forEach(item => item.style.display = filter === 'todos' || item.dataset.category === filter ? '' : 'none');
}));

document.getElementById('profileBtn').addEventListener('click', () => openModal(`
  <button class="modal-close" onclick="closeModal()" aria-label="Cerrar">×</button>
  <span class="eyebrow">Perfil conceptual</span>
  <h2 id="modalTitle">Funciones todavía no implementadas</h2>
  <p>Esta vista representa posibilidades futuras de configuración. Actualmente no guarda recordatorios, apariencia, copias de seguridad ni preferencias de contenido.</p>
  <div class="devotional-step"><strong>Privacidad por diseño</strong><span>Las oraciones, reflexiones y progreso devocional permanecen en este navegador en la demo actual.</span></div>
  <div class="devotional-step"><strong>Accesibilidad</strong><span>Tamaño de texto, contraste, lectura sencilla y controles claros deben validarse antes de realizar afirmaciones formales de conformidad.</span></div>
  <button class="button primary modal-action" onclick="closeModal()">Cerrar</button>
`));

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[ch]));
}

const initialState = loadState();
personalPrayers = initialState.prayers;
personalJournals = initialState.journal;
devotionalProgress = initialState.devotional;

setDateGreeting();
renderPrayers();
renderJournal();
updateMetrics();
