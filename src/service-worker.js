var appVersion = '5.3';
var cacheObject = 'ordboka-' + appVersion;

self.addEventListener('install', function(event) {
	self.skipWaiting();
	event.waitUntil(
		caches.open(cacheObject).then(function(cache) {
			return cache.addAll([
				'/',
				'/favicon.png',
				'/manifest.json',
				'/resources/css/app.css',
				'/resources/css/responsive.css',
				'/resources/data/words.json',
				'/resources/images/apple-touch-icon.png',
				'/resources/images/bars.svg',
				'/resources/images/icon-192-v2.png',
				'/resources/images/icon-512-v2.png',
				'/resources/images/ios-add-home-screen.png',
				'/resources/images/loading.svg',
				'/resources/images/star.svg',
				'/resources/images/times.svg',
				'/resources/js/controller.js',
				'/resources/js/helpers.js',
				'/resources/js/model.js',
				'/resources/js/view.js'
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
