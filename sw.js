importScripts('./asset-list.js');
const CACHE = 'draft-club-v5-artwork-1';
const FILES = ['./', './index.html', './styles.css', './startup.js', './data.js', './content.js', './packs.js', './engine.js', './app.js', './pwa.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './image-manifest.js', './artwork.js', './asset-list.js', './artwork-credits.html', ...ART_ASSETS];
const urls = FILES.map(path => new URL(path, self.registration.scope).href);
self.addEventListener('install', event => {
  // Waiting workers remain waiting until a player explicitly accepts the update.
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('draft-club-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'CHECK_OFFLINE') {
    event.waitUntil(caches.open(CACHE).then(async cache => {
      const complete = (await Promise.all(urls.map(url => cache.match(url)))).every(Boolean);
      event.source?.postMessage({ type: 'OFFLINE_STATUS', complete, version: CACHE });
    }));
  }
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !urls.includes(url.href)) return;
  event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(event.request)) || fetch(event.request)));
});
