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
let RT = null; // canal realtime (cambios instantáneos entre dispositivos)
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
    rtStart();
    if (!silent) cloudStatus('Conectado. Tocá Sincronizar para traer/subir.');
    return true;
  } catch (e) {
    if (!silent) cloudStatus('No conecta: ' + (e.message || e) + ' (¿tabla creada? ¿internet?)');
    return false;
  }
}
// Realtime: la nube avisa cada cambio y se trae solo (con polling de respaldo)
function rtStart() {
  try {
    if (RT && SB) SB.removeChannel(RT);
    RT = null;
    RT = SB.channel('stock-components')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'components' }, () => { cloudPull(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deleted_skus' }, () => { cloudPull(); })
      .subscribe();
  } catch {}
}
function rtStop() { try { if (RT && SB) SB.removeChannel(RT); } catch {} RT = null; }
// Cola de pendientes: sobrevive offline y se vacía sola al reconectar
const PEND_KEY = 'stock_pending_v1';
const loadPend = () => { try { return JSON.parse(localStorage.getItem(PEND_KEY)) || { up: {}, del: {} }; } catch { return { up: {}, del: {} }; } };
const savePend = (p) => { try { localStorage.setItem(PEND_KEY, JSON.stringify(p)); } catch {} };
async function flushPending() {
  if (!cloudOk) return false;
  const p = loadPend();
  const sus = Object.keys(p.up), sds = Object.keys(p.del);
  if (!sus.length && !sds.length) return true;
  try {
    for (const sku of sus) {
      const { error } = await SB.from('components').upsert(toRow(p.up[sku]), { onConflict: 'sku' });
      if (error) throw error;
      delete p.up[sku]; savePend(p);
    }
    for (const sku of sds) {
      const { error: e1 } = await SB.from('deleted_skus').upsert({ sku }, { onConflict: 'sku' });
      if (e1) throw e1;
      const { error: e2 } = await SB.from('components').delete().eq('sku', sku);
      if (e2) throw e2;
      delete p.del[sku]; savePend(p);
    }
    return true;
  } catch (e) { cloudStatus('Pendientes sin subir (' + (e.message || e) + '). Se reintentan solos.'); return false; }
}
async function cloudPull() {
  if (!cloudOk && !(await cloudConnect(true))) { cloudStatus('Sin nube: trabajo local.'); return; }
  await flushPending();
  try {
    const got = await SB.from('components').select('*');
    const tbs = await SB.from('deleted_skus').select('sku');
    if (got.error) throw got.error;
    if (tbs.error) throw tbs.error;
    const tombs = new Set((tbs.data || []).map((x) => x.sku));
    const rows = (got.data || []).map(fromRow).filter((x) => !tombs.has(x.sku));
    const bySku = new Map(rows.map((r) => [r.sku, r]));
    const base = (MEM && MEM.length ? MEM : loadLocal()).filter((m) => !tombs.has(m.sku));
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
async function cloudTombstone(sku, remove) {
  if (!cloudOk) return true;
  try {
    const res = remove
      ? await SB.from('deleted_skus').delete().eq('sku', sku)
      : await SB.from('deleted_skus').upsert({ sku }, { onConflict: 'sku' });
    if (res.error) throw res.error;
    return true;
  } catch (e) { cloudStatus('Fallo lápida (' + (e.message || e) + ').'); return false; }
}
async function cloudPush(item) {
  const p = loadPend(); p.up[item.sku] = item; delete p.del[item.sku]; savePend(p);
  if (!cloudOk) return;
  try {
    const { error } = await SB.from('components').upsert(toRow(item), { onConflict: 'sku' });
    if (error) throw error;
    const q = loadPend(); delete q.up[item.sku]; savePend(q);
  } catch (e) { cloudStatus('No se pudo subir (' + (e.message || e) + '). Queda en cola.'); }
}
async function cloudDel(sku) {
  if (!cloudOk) return true;
  try {
    const { error: e1 } = await SB.from('deleted_skus').upsert({ sku }, { onConflict: 'sku' });
    if (e1) throw e1;
    const { error: e2 } = await SB.from('components').delete().eq('sku', sku);
    if (e2) throw e2;
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
  renderBuy(all);
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
      '<div class="qr hidden"></div>' +
      '<div class="qtybox"><div class="stepper"><button data-a="out">−</button><span class="qty"></span><button data-a="in">+</button></div><span class="min"></span></div>' +
      '<div class="row-actions"><button data-a="in5">Entrada +5</button><button data-a="out1">Salida −1</button><button data-a="edit">Editar</button><button data-a="qr">QR</button><button data-a="del" class="danger">Eliminar</button></div>';
    li.querySelector('strong').textContent = c.name;
    li.querySelector('.meta').textContent = [c.sku, c.cat || 'Sin categoría', c.val || '', c.spec || '', c.loc || ''].filter(Boolean).join(' · ');
    li.querySelector('.desc').textContent = c.desc || '';
    li.querySelector('.desc').style.display = c.desc ? 'block' : 'none';
    li.querySelector('.qty').textContent = c.qty;
    li.querySelector('.min').textContent = 'Mín: ' + c.min;
    li.querySelector('[data-a="in"]').onclick = () => move(c.sku, 1);
    li.querySelector('[data-a="out"]').onclick = () => move(c.sku, -1);
    li.querySelector('[data-a="out"]').disabled = c.qty <= 0;
    li.querySelector('[data-a="in5"]').onclick = () => move(c.sku, 5);
    li.querySelector('[data-a="out1"]').onclick = () => move(c.sku, -1);
    li.querySelector('[data-a="out1"]').disabled = c.qty <= 0;
    li.querySelector('[data-a="edit"]').onclick = () => startEdit(c.sku);
    li.querySelector('[data-a="qr"]').onclick = () => toggleQR(li, c.sku);
    li.querySelector('[data-a="del"]').onclick = () => {
      if (confirm('¿Eliminar ' + c.name + '?')) del(c.sku);
    };
    ul.appendChild(li);
  });
}

// Lista de compras: lo que está en o bajo el mínimo, con faltante y botón Comprado
function buyNeed(c) { return Math.max((c.min || 0) - (c.qty || 0), 0); }
function renderBuy(all) {
  const needy = (all || []).filter((c) => c.qty <= c.min);
  $('buy-count').textContent = needy.length ? '(' + needy.length + ')' : '';
  $('buy-empty').style.display = needy.length ? 'none' : 'block';
  $('btn-buy-copy').style.display = needy.length ? '' : 'none';
  const ul = $('buy-list');
  ul.innerHTML = '';
  needy.forEach((c) => {
    const need = buyNeed(c);
    const li = document.createElement('li');
    li.className = 'item low';
    li.innerHTML = '<div class="top"><strong></strong><span class="badge warn">' + (need > 0 ? 'Faltan: ' + need : 'En mínimo') + '</span></div>' +
      '<div class="meta"></div>' +
      '<div class="row-actions"><button data-a="bought">Comprado (+' + (need || 1) + ')</button><button data-a="deld" class="danger">Eliminar</button></div>';
    li.querySelector('strong').textContent = c.name;
    li.querySelector('.meta').textContent = [c.sku, c.cat || '', 'quedan ' + c.qty + ' / mín ' + c.min, c.loc || ''].filter(Boolean).join(' · ');
    li.querySelector('[data-a="bought"]').onclick = () => move(c.sku, need || 1);
    li.querySelector('[data-a="deld"]').onclick = () => {
      if (confirm('Eliminar ' + c.name + '?')) del(c.sku);
    };
    ul.appendChild(li);
  });
}
$('btn-buy').onclick = () => $('card-buy').classList.toggle('hidden');
$('btn-buy-copy').onclick = () => {
  const needy = load().filter((c) => c.qty <= c.min);
  const txt = needy.map((c) => '- ' + c.name + ' (' + c.sku + ') x' + (buyNeed(c) || 1)).join('\n');
  const done = () => { $('btn-buy-copy').textContent = 'Copiado'; setTimeout(() => { $('btn-buy-copy').textContent = 'Copiar lista'; }, 1500); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done).catch(() => fallbackCopy(txt, done));
  else fallbackCopy(txt, done);
};
function fallbackCopy(txt, done) {
  try {
    const ta = document.createElement('textarea');
    ta.value = txt; document.body.appendChild(ta); ta.select();
    if (document.execCommand('copy')) { document.body.removeChild(ta); done(); return; }
    document.body.removeChild(ta);
  } catch {}
  prompt('Copiá la lista manualmente:', txt);
}

// QR por componente: se genera al verlo. Escaneando abre la app filtrada por ese SKU.
function qrPayload(sku) {
  try {
    if (location.protocol.startsWith('http') && location.host) return location.origin + location.pathname + '?sku=' + encodeURIComponent(sku);
  } catch {}
  return 'STOCK:' + sku;
}
function toggleQR(li, sku) {
  const box = li.querySelector('.qr');
  box.classList.toggle('hidden');
  if (!box.classList.contains('hidden') && !box.dataset.done) {
    const url = qrPayload(sku);
    if (typeof qrcode === 'function') {
      try {
        const qr = qrcode(0, 'M');
        qr.addData(url);
        qr.make();
        box.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 0, scalable: true }) + '<small></small>';
        box.querySelector('small').textContent = url;
        box.dataset.done = '1';
      } catch { box.textContent = url; }
    } else box.textContent = url + ' (QR offline no disponible: abri una vez con internet)';
  }
}
// Deep-link ?sku=: al abrir, filtra por ese componente
function applyDeepLink() {
  try {
    const sku = new URLSearchParams(location.search).get('sku');
    if (sku && $('search')) { $('search').value = sku; render(); $('list').scrollIntoView({ block: 'start' }); }
  } catch {}
}

// CSV: exportar todo / importar masivo (upsert por SKU)
function csvEsc(v) {
  v = String(v == null ? '' : v);
  var QU = String.fromCharCode(34), LF = String.fromCharCode(10);
  var needs = v.indexOf(',') !== -1 || v.indexOf(';') !== -1 || v.indexOf(QU) !== -1 || v.indexOf(LF) !== -1;
  return needs ? QU + v.split(QU).join(QU + QU) + QU : v;
}
function exportCSV() {
  var LF = String.fromCharCode(10);
  var rows = [['sku', 'name', 'cat', 'loc', 'val', 'spec', 'desc', 'qty', 'min'].join(',')];
  load().forEach(function (c) {
    rows.push([c.sku, c.name, c.cat, c.loc, c.val, c.spec, c.desc, c.qty, c.min].map(csvEsc).join(','));
  });
  var blob = new Blob([String.fromCharCode(65279) + rows.join(LF)], { type: 'text/csv;charset=utf-8' });
  var a = document.createElement('a');
  var d = new Date();
  function p2(n) { return String(n).padStart(2, '0'); }
  a.href = URL.createObjectURL(blob);
  a.download = 'stock-' + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + '.csv';
  document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function parseCSV(text) {
  text = String(text || '');
  var LF = String.fromCharCode(10), CR = String.fromCharCode(13), QU = String.fromCharCode(34);
  if (text.charCodeAt(0) === 65279) text = text.slice(1);
  text = text.split(CR + LF).join(LF).split(CR).join(LF);
  var head = (text.split(LF)[0] || '').toLowerCase();
  var delim = detectDelim(head);
  var rows = [], row = [], field = '', inQ = false;
  for (var i = 0; i < text.length; i++) {
    var ch = text[i];
    if (inQ) {
      if (ch === QU) {
        if (text[i + 1] === QU) { field += QU; i++; }
        else inQ = false;
      } else field += ch;
    } else if (ch === QU) inQ = true;
    else if (ch === delim) { row.push(field); field = ''; }
    else if (ch === LF) { row.push(field); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  row.push(field); rows.push(row);
  var out = rows.filter(function (x) { return x.length > 1 || (x[0] || '').trim() !== ''; });
  out.warned = inQ;
  return out;
}
function detectDelim(head) {
  var c1 = 0, c2 = 0, inQ = false, QU = String.fromCharCode(34);
  for (var i = 0; i < head.length; i++) {
    var ch = head[i];
    if (ch === QU) inQ = !inQ;
    else if (!inQ && ch === ',') c1++;
    else if (!inQ && ch === ';') c2++;
  }
  if (c2 > 0 && c2 >= c1) return ';';
  return ',';
}
function importCSV(file) {
  var rd = new FileReader();
  rd.onload = function () {
    try {
      var rows = parseCSV(rd.result);
      if (!rows.length) { alert('CSV vacío.'); return; }
      var head = rows[0].map(function (h) { return (h || '').trim().toLowerCase(); });
      function idx(names) { return head.findIndex(function (h) { return names.indexOf(h) !== -1; }); }
      var ci = { sku: idx(['sku', 'codigo', 'código']), name: idx(['name', 'nombre']), cat: idx(['cat', 'categoria', 'categoría']), loc: idx(['loc', 'ubicacion', 'ubicación']), val: idx(['val', 'valor']), spec: idx(['spec', 'detalle']), desc: idx(['desc', 'descripcion', 'descripción']), qty: idx(['qty', 'cantidad', 'stock']), min: idx(['min', 'minimo', 'mínimo']) };
      if (ci.sku < 0 || ci.name < 0) { alert('El CSV necesita columnas sku y name (o nombre).'); return; }
      var items = load(), nNew = 0, nUpd = 0, k;
      function get(x, key, dflt) { return (ci[key] >= 0 && x[ci[key]] != null) ? String(x[ci[key]]).trim() : dflt; }
      function num(x, key, dflt) { var v = parseInt(get(x, key, ''), 10); return isNaN(v) ? dflt : Math.max(0, v); }
      for (var i = 1; i < rows.length; i++) {
        var x = rows[i];
        var sku = (x[ci.sku] || '').trim();
        var name = (x[ci.name] || '').trim();
        if (!sku || !name) continue;
        var obj = { sku: sku, name: name, cat: get(x, 'cat', ''), loc: get(x, 'loc', ''), val: get(x, 'val', ''), spec: get(x, 'spec', ''), desc: get(x, 'desc', ''), qty: num(x, 'qty', 0), min: num(x, 'min', 0) };
        var at = -1;
        for (k = 0; k < items.length; k++) { if ((items[k].sku || '').toLowerCase() === sku.toLowerCase()) { at = k; break; } }
        if (at >= 0) { items[at] = obj; nUpd++; } else { items.unshift(obj); nNew++; }
        cloudPush(obj);
        cloudTombstone(sku, true);
      }
      save(items); render();
      var msg = 'CSV: ' + nNew + ' nuevos, ' + nUpd + ' actualizados.' + (rows.warned ? ' Ojo: una comilla quedó abierta, revisá los datos.' : '');
      cloudStatus(msg);
      if (rows.warned) alert(msg);
    } catch (e) { alert('No se pudo importar: ' + (e.message || e)); }
  };
  rd.readAsText(file);
}
$('btn-csv-exp').onclick = exportCSV;
$('btn-csv-imp').onclick = function () { $('f-csv').click(); };
$('f-csv').addEventListener('change', function (e) {
  if (e.target.files && e.target.files[0]) importCSV(e.target.files[0]);
  e.target.value = '';
});

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
  if (!gone) return;
  save(items.filter((x) => x.sku !== sku)); render();
  const p = loadPend(); p.del[sku] = Date.now(); delete p.up[sku]; savePend(p);
  if (cloudOk) cloudDel(sku).then((ok) => {
    if (ok) { const q = loadPend(); delete q.del[sku]; savePend(q); }
  });
}

function toggleForm(show) {
  $('card-form').classList.toggle('hidden', !show);
  if (show) $('f-name').focus();
}
function startEdit(sku) {
  const c = load().find((x) => x.sku === sku);
  if (!c) return;
  editingSku = sku;
  $('form-title').textContent = 'Editar componente';
  $('btn-save').textContent = 'Guardar cambios';
  $('lbl-qty').textContent = 'Cantidad actual';
  $('f-name').value = c.name || '';
  $('f-sku').value = c.sku || '';
  $('f-sku').disabled = true;
  $('f-cat').value = c.cat || '';
  $('f-loc').value = c.loc || '';
  $('f-val').value = c.val || '';
  $('f-spec').value = c.spec || '';
  $('f-qty').value = c.qty || 0;
  $('f-min').value = c.min || 0;
  aiAuto = false; skuAuto = false; pendingDesc = '';
  $('suggest').classList.add('hidden'); $('suggest').innerHTML = '';
  $('ai-hint').classList.add('hidden');
  toggleForm(true);
  $('card-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function resetEdit() {
  editingSku = null;
  $('form-title').textContent = 'Nuevo componente';
  $('btn-save').textContent = 'Guardar componente';
  $('lbl-qty').textContent = 'Cantidad inicial';
  $('f-sku').disabled = false;
}
function resetFormFields() {
  $('form-add').reset(); $('f-qty').value = 0; $('f-min').value = 1;
  aiAuto = false; skuAuto = false; pendingDesc = '';
  $('suggest').classList.add('hidden'); $('suggest').innerHTML = '';
  $('ai-hint').classList.add('hidden');
}

$('btn-new').onclick = () => {
  const opening = $('card-form').classList.contains('hidden');
  resetEdit(); resetFormFields();
  toggleForm(opening);
};
$('btn-cancel').onclick = () => { resetEdit(); toggleForm(false); };
const SKU_PREFIX = { "Resistencias": "RES", "Capacitores": "CAP", "Diodos / LED": "DIO", "Transistores": "TRA", "Tiristores": "TRI", "Reguladores": "REG", "ICs": "IC", "Drivers": "DRV", "Módulos / Placas": "MOD", "Conectores": "CON", "Sensores": "SEN", "Insumos": "INS" };
function genSKU() {
  const n = $('f-name').value.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/Ω/g, 'OHM').replace(/[µμΜ]/g, 'U').toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cat = SKU_PREFIX[$('f-cat').value] || 'GEN';
  if (n) { $('f-sku').value = cat + '-' + n; skuAuto = true; }
}
$('btn-sku').onclick = genSKU;

$('form-add').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('f-name').value.trim();
  const sku = $('f-sku').value.trim();
  if (!name || !sku) { alert('Completá nombre y SKU.'); return; }
  const items = load();
  if (editingSku) {
    const i = items.findIndex((x) => x.sku === editingSku);
    if (i < 0) { resetEdit(); return; }
    items[i] = { sku: editingSku, name, cat: $('f-cat').value, loc: $('f-loc').value.trim(), val: normVal(), spec: normSpec(), desc: buildDesc(name, editingSku), qty: numVal($('f-qty').value, 0), min: numVal($('f-min').value, 0) };
    save(items); resetFormFields(); toggleForm(false); render();
    cloudPush(items[i]);
    cloudTombstone(items[i].sku, true);
    resetEdit();
    return;
  }
  if (items.some((x) => x.sku.toLowerCase() === sku.toLowerCase())) { alert('Ese código SKU ya existe.'); return; }
  items.unshift({
    sku, name,
    cat: $('f-cat').value,
    loc: $('f-loc').value.trim(),
    val: normVal(), spec: normSpec(),
    desc: buildDesc(name, sku),
    qty: numVal($('f-qty').value, 0),
    min: numVal($('f-min').value, 0),
  });
  save(items); resetFormFields(); toggleForm(false); render();
  cloudPush(items[0]);
  cloudTombstone(sku, true);
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
function numVal(v, dflt) { var n = parseInt(v, 10); return isNaN(n) ? dflt : Math.max(0, n); }
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
let editingSku = null; // SKU en edición (null = alta nueva)
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
applyDeepLink();

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
