self.addEventListener('install', e=>{e.waitUntil(caches.open('bethec-v3').then(c=>c.addAll(['./','./index.html','./style.css','./script.js','./manifest.json','./logo_original.png'])));});
self.addEventListener('fetch', e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
