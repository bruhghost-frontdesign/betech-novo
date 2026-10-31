const CACHE_NOVO = 'bethec-v7-final-pro';
self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE_NOVO).then(c=>c.addAll([
      './',
      './index.html?v=v7final',
      './style.css?v=v7final',
      './script.js?v=v7final',
      './manifest.json?v=v7final',
      './logo_original.png?v=v7final',
      './validar.html?v=v7final'
    ]))
  );
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>{if(k!==CACHE_NOVO) return caches.delete(k);}))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
