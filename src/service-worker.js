var appVersion = '1';
var cacheObject = 'ordbok-' + appVersion;

self.addEventListener('install', function(event) {
	self.skipWaiting();
	event.waitUntil(
		caches.open(cacheObject).then(function(cache) {
			return cache.addAll([
				'/',
				'/resources/css/app.css',
				'/resources/data/words.json',
				'/resources/images/favicon.png',
				'/resources/images/touch-icon-500px.png',
				'/resources/js/app.js',
				'/vendors/jquery-3.3.1.min.js'
			]);
		})
	);
});

self.addEventListener('fetch', function(event) {
	console.log(event.request.url);

	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName) {
					if (cacheName != cacheObject) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
