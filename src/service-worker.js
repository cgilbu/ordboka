var appVersion = '76';
var cacheObject = 'ordbok-' + appVersion;

self.addEventListener('install', function(event) {
	self.skipWaiting();
	event.waitUntil(
		caches.open(cacheObject).then(function(cache) {
			return cache.addAll([
				'/',
				'/favicon.png',
				'/resources/css/app.css',
				'/resources/data/words.json',
				'/resources/images/apple-touch-icon.png',
				'/resources/images/icon-192.png',
				'/resources/images/icon-512.png',
				'/resources/images/ios-add-home-screen.png',
				'/resources/images/loading.svg',
				'/resources/js/app.js',
				'/vendors/jquery-3.3.1.min.js',
				'/vendors/underscore-min.js'
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
