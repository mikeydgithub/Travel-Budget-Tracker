const CACHE_NAME = 'my-site-cache';
const DATA_CACHE_NAME = 'data-cache-v1';

const FILES_TO_CACHE = [
    '/',
    './js/idb.js',
    './js/index.js',
    './index.html',
    './assets/css/styles.css',
    './assets/images/icons/icon-72x72.png',
    './assets/images/icons/icon-96x96.png',
    './assets/images/icons/icon-128x128.png',
    './assets/images/icons/icon-144x144.png',
    './assets/images/icons/icon-152x152.png',
    './assets/images/icons/icon-192x192.png',
    './assets/images/icons/icon-384x384.png',
    './assets/images/icons/icon-512x512.png',
    './api/transaction',
    'manifest.json'
];


// Install the service worker
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
       return cache.addAll(FILES_TO_CACHE)
    })
  )
})

// Activate the service worker and remove old data from the cache
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('Removing old cache data', key);
            return caches.delete(key);
          }
        }) 
      )
    })
  );
  // when a service work is initially registered, pages won't use it until the next load.
  self.clients.claim();
});

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }
    })
  )
})


