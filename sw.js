const CACHE_NOVO = 'bethec-vfinal-logo-original';
self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE_NOVO).then(c=>c.addAll([
      './',
      './index.html?v=final',
      './style.css?v=final',
      './script.js?v=final',
      './manifest.json?v=final',
      './logo_original.png?v=final'
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
