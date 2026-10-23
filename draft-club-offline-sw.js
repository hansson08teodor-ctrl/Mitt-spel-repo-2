// Draft Club V10.5 offline cache. Dedicated cache and filename avoid modifying older builds.
const CACHE='draft-club-v10-5-offline-1';
const GAME='./Draft_Club_V10.5_Offline.html';
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.add(new Request(GAME,{cache:'reload'}))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(name=>name.startsWith('draft-club-v10-5-')&&name!==CACHE).map(name=>caches.delete(name)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/Draft_Club_V10.5_Offline.html')){
   event.respondWith(caches.open(CACHE).then(async cache=>{
     const saved=await cache.match(GAME);
     if(saved)return saved;
     const live=await fetch(request);
     if(live.ok)cache.put(GAME,live.clone());
     return live;
   }));
 }
});
