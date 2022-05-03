const CACHE_NAME = 'my-site-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

const FILES_TO_CACHE = [
    '/',
    './app.js',
    './index.html',
    './manifest.json',
    './assets/css/style.css',
    './assets/images/icons/icon-72x72.png',
    './assets/images/icons/icon-96x96.png',
    './assets/images/icons/icon-128x128.png',
    './assets/images/icons/icon-144x144.png',
    './assets/images/icons/icon-152x152.png',
    './assets/images/icons/icon-192x192.png',
    './assets/images/icons/icon-384x384.png',
    './assets/images/icons/icon-512x512.png'
];

// Install the service worker
self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Your files were pre-cached successfully!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    // self.skipwaiting will only have an effect if there's a newly installed service worker that might otherwise remain in the waiting state.
    self.skipWaiting();
});

// Activate the service worker and remove old data from the cache
self.addEventListener('activate', function(evt) {
    evt.waitUntil(
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

// Intercept fetch requests
self.addEventListener('activate', function(evt) {
    evt.waitUntil(
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
    self.clients.claim();
});
