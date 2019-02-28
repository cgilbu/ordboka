self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open('ordbok').then(function(cache) {
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
