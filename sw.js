self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open('bethec-v1').then(c=>c.addAll([
      './',
      './index.html',
      './style.css',
      './script.js',
      './logo_original.png',
      './manifest.json'
    ]))
  );
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});
