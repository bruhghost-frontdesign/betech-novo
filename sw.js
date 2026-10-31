const CACHE='bethec-v9-final-tudo-completo';
const ASSETS=['./','./index.html','./script.js','./logo_original.png','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.url.includes('cdnjs'))return e.respondWith(fetch(e.request));e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
