// Offline: guarda la app para usarla sin internet (solo funciona publicada con https)
const V = 'stock-v1';
const FILES = ['./', 'index.html', 'styles.css', 'app.js', 'data.js', 'manifest.json', 'icon.svg'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
    const copy = res.clone();
    caches.open(V).then((c) => c.put(e.request, copy));
    return res;
  }).catch(() => caches.match('index.html'))));
});
