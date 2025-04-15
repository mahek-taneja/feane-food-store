const CACHE_NAME = 'feane-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/bootstrap.css',
    '/css/style.css',
    '/css/responsive.css',
    '/js/custom.js',
    '/js/bootstrap.js',
    '/images/hero-bg.jpg',
    '/images/icon-192.png',
    '/images/icon-512.png',
    '/images/favicon.png'
];

// Install event - Cache assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching app shell...');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});

// Fetch event - Serve cached content
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).catch((error) => {
                console.error('[Service Worker] Fetch failed:', error);
                // Optional: return fallback.html or offline image
            });
        })
    );
});


