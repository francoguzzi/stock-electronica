const KEY = 'stock_components_v1';
const $ = (id) => document.getElementById(id);
const loadLocal = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const load = () => (cloudOk && MEM ? MEM : loadLocal());
// Escritura directa: memoria en modo nube + siempre copia local de respaldo
const save = (items) => { if (cloudOk && MEM) MEM = items; try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} };

// ---- Nube compartida (Supabase, opcional) ----
const CFG_KEY = 'stock_cfg_v1';
// Clave PUBLICABLE: está diseñada para ir en el frontend. Con RLS desactivado
// cualquiera con URL+clave puede leer/escribir: bien para uso personal,
// activá RLS + rotá claves si la app se vuelve pública.
const SB_DEFAULTS = { url: 'https://lpztroezuksyiuptzdec.supabase.co', key: 'sb_publishable_x-N8dCh5JlMiTu8njyV0Og_3ku3tYVd' };
let SB = null, cloudOk = false, MEM = null; // MEM = caché en memoria; en modo nube NO se usa localStorage
const getCfg = () => { try { return Object.assign({}, SB_DEFAULTS, JSON.parse(localStorage.getItem(CFG_KEY)) || {}); } catch { return Object.assign({}, SB_DEFAULTS); } };
const setCfg = (c) => localStorage.setItem(CFG_KEY, JSON.stringify(c));
const toRow = (c) => ({ sku: c.sku, name: c.name, cat: c.cat || '', loc: c.loc || '', val: c.val || '', spec: c.spec || '', descr: c.desc || '', qty: c.qty || 0, min_stock: c.min || 0 });
const fromRow = (r) => ({ sku: r.sku, name: r.name, cat: r.cat || '', loc: r.loc || '', val: r.val || '', spec: r.spec || '', desc: r.descr || '', qty: r.qty || 0, min: r.min_stock || 0 });
function cloudStatus(t) { const el = $('cloud-status'); if (el) el.textContent = t; paintDot(); }
function paintDot() {
  const d = $('cloud-dot');
  if (!d) return;
  d.textContent = cloudOk ? '● nube' : '● local';
  d.style.color = cloudOk ? '#2fbf71' : '#999';
}
function loadSbLib() {
  return new Promise((res, rej) => {
    if (window.supabase && window.supabase.createClient) return res();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}
async function cloudConnect(silent) {
  const { url, key } = getCfg();
  cloudOk = false; SB = null;
  if (!url || !key) { if (!silent) cloudStatus('Pegá URL y clave, y tocá Conectar.'); return false; }
  try {
    await loadSbLib();
    SB = window.supabase.createClient(url, key);
    const { error } = await SB.from('components').select('sku', { count: 'exact', head: true });
    if (error) throw error;
    cloudOk = true;
    if (!silent) cloudStatus('Conectado. Tocá Sincronizar para traer/subir.');
    return true;
  } catch (e) {
    if (!silent) cloudStatus('No conecta: ' + (e.message || e) + ' (¿tabla creada? ¿internet?)');
    return false;
  }
}
async function cloudPull() {
  if (!cloudOk && !(await cloudConnect(true))) { cloudStatus('Sin nube: trabajo local.'); return; }
  try {
    const { data, error } = await SB.from('components').select('*');
    if (error) throw error;
    const rows = (data || []).map(fromRow);
    const bySku = new Map(rows.map((r) => [r.sku, r]));
    const base = (MEM && MEM.length ? MEM : loadLocal());
    const merged = [];
    const missing = [];
    for (const m of base) {
      if (bySku.has(m.sku)) merged.push(bySku.get(m.sku));
      else { merged.push(m); missing.push(m); }
    }
    for (const r of rows) if (!merged.some((x) => x.sku === r.sku)) merged.push(r);
    MEM = merged;
    render();
    if (missing.length) {
      const { error: e2 } = await SB.from('components').upsert(missing.map(toRow), { onConflict: 'sku' });
      if (e2) throw e2;
      cloudStatus('Sincronizado: ' + MEM.length + ' componentes.');
    } else cloudStatus('Sincronizado: ' + MEM.length + ' componentes.');
  } catch (e) { cloudStatus('Falló sincronizar: ' + (e.message || e) + ' — revisá tabla y RLS (supabase.sql).'); }
}
async function cloudPush(item) {
  if (!cloudOk) return;
  try {
    const { error } = await SB.from('components').upsert(toRow(item), { onConflict: 'sku' });
    if (error) throw error;
  } catch (e) { cloudStatus('No se pudo subir (' + (e.message || e) + '). Revisá tabla y RLS.'); }
}
async function cloudDel(sku) {
  if (!cloudOk) return true;
  try {
    const { error } = await SB.from('components').delete().eq('sku', sku);
    if (error) throw error;
    return true;
  } catch (e) { cloudStatus('No se pudo borrar en la nube (' + (e.message || e) + ').'); return false; }
}

function status(c) {
  if (c.qty <= 0) return { t: 'Sin stock', cls: 'bad' };
  if (c.qty <= c.min) return { t: 'Bajo stock', cls: 'warn' };
  return { t: 'OK', cls: '' };
}

function render() {
  const all = load();
  $('st-total').textContent = all.length;
  $('st-low').textContent = all.filter((c) => c.qty > 0 && c.qty <= c.min).length;
  $('st-out').textContent = all.filter((c) => c.qty <= 0).length;
  const q = ($('search').value || '').trim().toUpperCase();
  const fc = $('f-filter-cat').value;
  const lowOnly = $('f-low').checked;
  const items = all.filter((c) => {
    if (fc && c.cat !== fc) return false;
    if (lowOnly && !(c.qty <= c.min)) return false;
    if (q && !((c.name || '') + ' ' + (c.sku || '') + ' ' + (c.cat || '') + ' ' + (c.val || '') + ' ' + (c.spec || '') + ' ' + (c.loc || '') + ' ' + (c.desc || '')).toUpperCase().includes(q)) return false;
    return true;
  });
  $('count-line').textContent = (q || fc || lowOnly) ? ('Mostrando ' + items.length + ' de ' + all.length) : '';
  const empty = $('empty');
  if (!all.length) { empty.style.display = 'block'; empty.innerHTML = '<strong>Aún no hay nada cargado.</strong><p>1. Tocá <b>+ Nuevo</b><br/>2. Cargá nombre y cantidad<br/>3. Usá Entrada / Salida para mover stock</p>'; }
  else if (!items.length) { empty.style.display = 'block'; empty.innerHTML = '<strong>Sin resultados.</strong><p>Probá otra palabra o limpiá los filtros.</p>'; }
  else empty.style.display = 'none';
  const ul = $('list');
  ul.innerHTML = '';
  items.forEach((c) => {
    const s = status(c);
    const li = document.createElement('li');
    li.className = 'item' + (c.qty <= 0 ? ' out' : c.qty <= c.min ? ' low' : '');
    li.innerHTML =
      '<div class="top"><strong></strong><span class="badge ' + s.cls + '">' + s.t + '</span></div>' +
      '<div class="meta"></div>' +
      '<div class="desc"></div>' +
      '<div class="qtybox"><div class="stepper"><button data-a="out">−</button><span class="qty"></span><button data-a="in">+</button></div><span class="min"></span></div>' +
      '<div class="row-actions"><button data-a="in5">Entrada +5</button><button data-a="out1">Salida −1</button><button data-a="del" class="danger">Eliminar</button></div>';
    li.querySelector('strong').textContent = c.name;
    li.querySelector('.meta').textContent = [c.sku, c.cat || 'Sin categoría', c.val || '', c.spec || '', c.loc || ''].filter(Boolean).join(' · ');
    li.querySelector('.desc').textContent = c.desc || '';
    li.querySelector('.desc').style.display = c.desc ? 'block' : 'none';
    li.querySelector('.qty').textContent = c.qty;
    li.querySelector('.min').textContent = 'Mín: ' + c.min;
    li.querySelector('[data-a="in"]').onclick = () => move(c.sku, 1);
    li.querySelector('[data-a="out"]').onclick = () => move(c.sku, -1);
    li.querySelector('[data-a="in5"]').onclick = () => move(c.sku, 5);
    li.querySelector('[data-a="out1"]').onclick = () => move(c.sku, -1);
    li.querySelector('[data-a="del"]').onclick = () => {
      if (confirm('¿Eliminar ' + c.name + '?')) del(c.sku);
    };
    ul.appendChild(li);
  });
}

function move(sku, d) {
  const items = load();
  const c = items.find((x) => x.sku === sku);
  if (!c) return;
  c.qty = Math.max(0, c.qty + d);
  save(items); render();
  cloudPush(c);
}
function del(sku) {
  const items = load();
  const gone = items.find((x) => x.sku === sku);
  save(items.filter((x) => x.sku !== sku)); render();
  if (cloudOk && gone) cloudDel(sku).then((ok) => {
    if (!ok) { save([...load(), gone]); render(); alert('No se pudo borrar en la nube. Revisá tabla y RLS.'); }
  });
}

function toggleForm(show) {
  $('card-form').classList.toggle('hidden', !show);
  if (show) $('f-name').focus();
}

$('btn-new').onclick = () => toggleForm($('card-form').classList.contains('hidden'));
$('btn-cancel').onclick = () => toggleForm(false);
const SKU_PREFIX = { "Resistencias": "RES", "Capacitores": "CAP", "Diodos / LED": "DIO", "Transistores": "TRA", "Tiristores": "TRI", "Reguladores": "REG", "ICs": "IC", "Drivers": "DRV", "Módulos / Placas": "MOD", "Conectores": "CON", "Sensores": "SEN", "Insumos": "INS" };
function genSKU() {
  const n = $('f-name').value.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cat = SKU_PREFIX[$('f-cat').value] || 'GEN';
  if (n) { $('f-sku').value = cat + '-' + n; skuAuto = true; }
}
$('btn-sku').onclick = genSKU;

$('form-add').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('f-name').value.trim();
  const sku = $('f-sku').value.trim();
  if (!name || !sku) return;
  const items = load();
  if (items.some((x) => x.sku.toLowerCase() === sku.toLowerCase())) { alert('Ese código SKU ya existe.'); return; }
  items.unshift({
    sku, name,
    cat: $('f-cat').value,
    loc: $('f-loc').value.trim(),
    val: normVal(), spec: normSpec(),
    desc: buildDesc(name, sku),
    qty: Math.max(0, parseInt($('f-qty').value || '0', 10)),
    min: Math.max(0, parseInt($('f-min').value || '0', 10)),
  });
  save(items); e.target.reset(); $('f-qty').value = 0; $('f-min').value = 1;
  aiAuto = false; skuAuto = false; pendingDesc = '';
  $('suggest').classList.add('hidden'); $('suggest').innerHTML = '';
  $('ai-hint').classList.add('hidden');
  toggleForm(false); render();
  cloudPush(items[0]);
});

// Normaliza Valor/Detalle antes de leer/guardar: 100uf 25v -> 100uF 25V
function normValSpec() {
  try {
    const a = (typeof analyzePart === 'function') ? analyzePart($('f-name').value + ' ' + $('f-sku').value + ' ' + $('f-val').value + ' ' + $('f-spec').value) : null;
    if (a && typeof splitValSpec === 'function') {
      const parts = splitValSpec(a.cat, a.specs);
      return parts;
    }
  } catch {}
  return { val: $('f-val').value.trim(), spec: $('f-spec').value.trim() };
}
function normVal() { return normValSpec().val || $('f-val').value.trim(); }
function normSpec() { return normValSpec().spec || $('f-spec').value.trim(); }

function buildDesc(name, sku) {
  const a = (typeof analyzePart === 'function') ? analyzePart(name + ' ' + sku + ' ' + $('f-val').value + ' ' + $('f-spec').value) : null;
  let d = a ? a.desc : '';
  try {
    if (a && typeof splitValSpec === 'function') {
      const parts = splitValSpec(a.cat, a.specs);
      if (parts.val) $('f-val').value = parts.val;
      if (parts.spec) $('f-spec').value = parts.spec;
    }
  } catch {}
  if (pendingDesc) d = (d ? d + ' ' : '') + pendingDesc;
  const extra = [$('f-val').value.trim(), $('f-spec').value.trim()].filter(Boolean).join(' ');
  if (extra) d = (d ? d + ' ' : '') + '[' + extra + ']';
  return d;
}

// Mini-IA: detecta qué es mientras escribís + pide V/F/Ohm + Wikipedia gratis
let aiAuto = false; // true si Valor/Detalle fueron puestos por Autocompletar
let skuAuto = false; // true si el SKU fue generado con Auto
let pendingDesc = ''; // descripción traída de Wikipedia, se guarda con el componente
function refreshAI(src) {
  // Si cambia el Nombre y lo anterior era auto, se descarta (evita el dato viejo)
  if (src === 'f-name') {
    if (aiAuto) { $('f-val').value = ''; $('f-spec').value = ''; aiAuto = false; }
    if (skuAuto) { $('f-sku').value = ''; skuAuto = false; }
    pendingDesc = '';
  }
  // SKU en vivo: si está vacío, se sugiere solo (sin pisar lo manual)
  if (!$('f-sku').value.trim() && $('f-name').value.trim().length >= 2) genSKU();
  const t = $('f-name').value + ' ' + $('f-sku').value + ' ' + $('f-val').value + ' ' + $('f-spec').value;
  const a = (typeof analyzePart === 'function') ? analyzePart(t) : null;
  const box = $('ai-hint');
  box.classList.remove('hidden');
  box.innerHTML = '';
  const name = $('f-name').value.trim() || 'esto';
  if (!a || !a.confident) {
    const s = document.createElement('span');
    s.textContent = 'No lo tengo en mi base (' + name + '). Cargalo manual o tocá Wikipedia.';
    const w = document.createElement('button');
    w.type = 'button';
    w.textContent = 'Buscar en Wikipedia';
    w.onclick = () => wikiLookup(name, box);
    box.appendChild(s); box.appendChild(w);
    return;
  }
  const s = document.createElement('span');
  let txt = (a.cat ? a.cat + ': ' : '') + a.desc;
  let pretty = a.specs;
  try { if (typeof prettySpecs === 'function') pretty = prettySpecs(a.specs); } catch {}
  const specTxt = Object.entries(pretty || {}).map(([k, v]) => k === 'len' ? 'Largo ' + v : k === 'size' ? 'Calibre ' + v : k === 'freq' ? 'Frec. ' + v : v).join(' ');
  if (specTxt) txt += ' Detectado: ' + specTxt + '.';
  if (a.missing && a.missing.length) txt += ' Falta: ' + a.missing.join(', ') + '.';
  if (a.pkg) txt += ' (' + a.pkg + ')';
  s.textContent = txt;
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = 'Autocompletar';
  b.onclick = () => {
    if (a.cat) $('f-cat').value = a.cat;
    $('f-min').value = a.min || 5;
    try {
      if (typeof splitValSpec === 'function') {
        const parts = splitValSpec(a.cat, a.specs);
        if (parts.val) $('f-val').value = parts.val;
        if (parts.spec) $('f-spec').value = parts.spec;
        aiAuto = true;
      }
    } catch {}
    if (!$('f-sku').value.trim()) genSKU();
    refreshAI();
  };
  const w = document.createElement('button');
  w.type = 'button';
  w.textContent = 'Ampliar en Wikipedia';
  w.onclick = () => wikiLookup($('f-name').value.trim(), box);
  box.appendChild(s); box.appendChild(b); box.appendChild(w);
}

// Wikipedia gratis, sin API key. Si no hay internet, avisa y listo.
async function wikiLookup(term, box) {
  box.innerHTML = '';
  const s = document.createElement('span');
  s.textContent = 'Buscando "' + term + '" en Wikipedia...';
  box.appendChild(s);
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    const sq = await fetch('https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(term) + '&srlimit=3&format=json&origin=*', { signal: ctrl.signal });
    const sj = await sq.json();
    clearTimeout(timer);
    const hits = (sj.query && sj.query.search) || [];
    if (!hits.length) { s.textContent = 'Wikipedia no encontró "' + term + '". Cargalo manual.'; return; }
    const title = hits[0].title;
    const ctrl2 = new AbortController();
    const timer2 = setTimeout(() => ctrl2.abort(), 10000);
    const eq = await fetch('https://es.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&exsentences=2&titles=' + encodeURIComponent(title) + '&format=json&origin=*', { signal: ctrl2.signal });
    const ej = await eq.json();
    clearTimeout(timer2);
    const pages = (ej.query && ej.query.pages) || {};
    const text = (Object.values(pages)[0] || {}).extract || '';
    box.innerHTML = '';
    const r = document.createElement('span');
    r.textContent = title + ': ' + (text || 'sin resumen.') + (hits.length > 1 ? ' (otras: ' + hits.slice(1).map((h) => h.title).join(', ') + ')' : '');
    const u = document.createElement('button');
    u.type = 'button';
    u.textContent = 'Usar esta descripción';
    u.onclick = () => { pendingDesc = text ? title + ': ' + text : ''; refreshAI(); };
    box.appendChild(r); box.appendChild(u);
  } catch {
    s.textContent = 'Sin conexión a Wikipedia (revisá internet). Igual podés cargarlo manual.';
  }
}
['f-name', 'f-sku', 'f-val', 'f-spec'].forEach((id) => $(id).addEventListener('input', (e) => {
  if (id === 'f-val' || id === 'f-spec') aiAuto = false; // edición manual rompe lo auto
  if (id === 'f-sku') skuAuto = false;
  refreshAI(id);
  if (id === 'f-name') renderSuggest();
}));
$('search').addEventListener('input', render);
$('f-filter-cat').addEventListener('change', render);
$('f-low').addEventListener('change', render);

// Sugerencias letra por letra desde la base (clic para completar el nombre)
function renderSuggest() {
  const box = $('suggest');
  const q = $('f-name').value.trim().toUpperCase();
  if (q.length < 2 || typeof KNOWLEDGE === 'undefined') { box.classList.add('hidden'); box.innerHTML = ''; return; }
  const found = KNOWLEDGE.filter((k) =>
    k.name.toUpperCase().includes(q) ||
    k.keys.some((key) => key.includes(q) || (key.length >= 4 && q.includes(key)))
  ).slice(0, 6);
  box.innerHTML = '';
  if (!found.length) { box.classList.add('hidden'); return; }
  box.classList.remove('hidden');
  found.forEach((k) => {
    const b = document.createElement('button');
    b.type = 'button';
    const st = document.createElement('strong');
    st.textContent = k.name;
    const sp = document.createElement('span');
    sp.textContent = ' · ' + k.cat;
    b.appendChild(st); b.appendChild(sp);
    b.onclick = () => {
      $('f-name').value = k.name;
      box.classList.add('hidden'); box.innerHTML = '';
      refreshAI('f-name');
    };
    box.appendChild(b);
  });
}

render();

// Nube: UI + arranque
$('btn-cloud').onclick = () => {
  const card = $('card-cloud');
  card.classList.toggle('hidden');
  const cfg = getCfg();
  if ($('f-sb-url') && !(($('f-sb-url').value || '').trim())) $('f-sb-url').value = cfg.url || '';
  if ($('f-sb-key') && !(($('f-sb-key').value || '').trim())) $('f-sb-key').value = cfg.key || '';
};
$('btn-cloud-on').onclick = async () => {
  setCfg({ url: ($('f-sb-url').value || '').trim().replace(/[/]$/, ''), key: ($('f-sb-key').value || '').trim(), off: false });
  cloudStatus('Conectando…');
  if (await cloudConnect(false)) cloudPull();
};
$('btn-cloud-off').onclick = () => {
  setCfg({ off: true }); SB = null; cloudOk = false; MEM = null;
  cloudStatus('Desconectado. Queda lo local.');
  render();
};
$('btn-cloud-sync').onclick = () => { cloudStatus('Sincronizando…'); cloudPull(); };
window.addEventListener('focus', () => { if (cloudOk) cloudPull(); });
setInterval(() => { if (cloudOk && document.visibilityState === 'visible') cloudPull(); }, 20000);
(function initCloud() {
  const cfg = getCfg();
  if (cfg.url && cfg.key && !cfg.off) {
    $('f-sb-url').value = cfg.url; $('f-sb-key').value = cfg.key;
    cloudStatus('Conectando…');
    cloudConnect(true).then((ok) => { if (ok) cloudPull(); });
  } else paintDot();
})();
