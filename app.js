const KEY = 'stock_components_v1';
const $ = (id) => document.getElementById(id);
const loadLocal = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const load = () => (cloudOk && MEM ? MEM : loadLocal());
// Escritura directa: memoria en modo nube + siempre copia local de respaldo
const save = (items) => { if (cloudOk && MEM) MEM = items; try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} };