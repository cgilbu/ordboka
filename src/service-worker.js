var version = 1;
var cacheName = 'ordboka';
var cache = cacheName + '-' + version;

var filesToCache = [
	'/',
	'/resources/images/favicon.png',
	'/resources/images/touch-icon-500px.png',
	'https://fonts.googleapis.com/css?family=Open+Sans',
	'/vendors/fontawesome/css/all.min.css',
	'/resources/css/app.css',
	'/manifest.json',
	'/vendors/jquery-3.3.1.min.js',
	'/resources/js/app.js'
];

self.addEventListener('install', function(event) {
	console.log('[ServiceWorker] Installing');
	event.waitUntil(caches
		.open(cache)
		.then(function(cache) {
			console.log('[ServiceWorker] Caching files');
			cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
		.then(function(response) {
			if (response) {
				console.log('Fulfilling ' + event.request.url + ' from cache');
				return response;
			} else {
				console.log(event.request.url + ' not found in cache');
				return fetch(event.request);
			}
		})
	);
});

self.addEventListener('activate', function(event) {
	console.log('[ServiceWorker] Activating');
	event.waitUntil(
		caches.keys()
		.then(function(keyList) {
			Promise.all(keyList.map(function(key) {
				if (key !== cacheName) {
					console.log('[ServiceWorker] Removing old cache:', key);
					return caches.delete(key);
				}
			}));
		})
	);
});
