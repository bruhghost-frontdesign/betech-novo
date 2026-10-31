self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open('bethec-v4-NOVO').then(c=>c.addAll([
      './',
      './index.html',
      './style.css',
      './script.js',
      './manifest.json',
      './logo_original.png',
      './bethec_final_preto.png'
    ]))
  );
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!=='bethec-v4-NOVO').map(k=>caches.delete(k))
    ))
  );
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=>{
      return r || fetch(e.request);
    })
  );
});
