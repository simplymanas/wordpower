const CACHE_NAME = 'word-game-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/wordpowergame.jpeg', 
  '/script.js',
  '/styles.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
