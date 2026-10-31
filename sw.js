const CACHE = 'bethec-v7-final-fotos-pdf';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './logo_original.png',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Não cacheia o html2pdf CDN e requisições externas
  if (e.request.url.includes('cdnjs.cloudflare.com')) {
    return e.respondWith(fetch(e.request));
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
