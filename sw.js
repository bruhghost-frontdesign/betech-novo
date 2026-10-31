const CACHE_NOVO = 'bethec-v6-preto-final-2025';
self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE_NOVO).then(c=>c.addAll([
      './',
      './index.html?v=6',
      './style.css?v=6',
      './script.js?v=6',
      './manifest.json?v=6',
      './logo_original.png?v=6'
    ]))
  );
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.map(k=>{
        if(k!==CACHE_NOVO) return caches.delete(k);
      })
    ))
  );
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    fetch(e.request).then(res=>{
      return res;
    }).catch(()=>caches.match(e.request))
  );
});
