const CACHE = 'bethec-6digitos-v1';
const ASSETS = ['./','./index.html','./style.css','./script.js','./manifest.json','./logo_original.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE) return caches.delete(k); }))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => { e.respondWith(fetch(e.request).catch(() => caches.match(e.request))); });
