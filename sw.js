const CACHE='ride-weather-v6';
const LOCAL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./app-icon.png','./hero-photo.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(LOCAL)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.hostname.includes('open-meteo.com')||u.hostname.includes('openstreetmap.de')||u.hostname.includes('nominatim.openstreetmap.org')||u.hostname.includes('tile.openstreetmap.org')||u.hostname.includes('unpkg.com')){
   e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))); return;
 }
 e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(CACHE).then(c=>c.put(e.request,x));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});