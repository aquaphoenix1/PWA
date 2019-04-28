const cacheName = 'cache-v1';
const precacheResources = [
  'PWA/',
  'index.html',
  'image/apple-icon-57x57.png',
  'image/apple-icon-60x60.png',
  'image/apple-icon-72x72.png',
  'image/apple-icon-76x76.png',
  'image/apple-icon-114x114.png',
  'image/apple-icon-120x120.png',
  'image/apple-icon-144x144.png',
  'image/apple-icon-152x152.png',
  'image/apple-icon-180x180.png',
  'image/android-icon-192x192.png',
  'image/favicon-32x32.png',
  'image/favicon-96x96.png',
  'image/favicon-16x16.png',
  'image/ms-icon-144x144.png'
];

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
});

/*self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
});*/
