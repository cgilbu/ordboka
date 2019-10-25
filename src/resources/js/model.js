'use strict';

var Model = {
	CachedWords: {}
};

Model.getWords = function(callback) {
	fetch('/resources/data/words.json')
		.then(response => response.json())
		.then(function(data) {
			Model.CachedWords = data.sort((a, b) => a.Title.localeCompare(b.Title, 'nb-NO'));
			callback(Model.CachedWords);
		})
		.catch(error => alert('Noe gikk galt: Kunne ikke laste ord'));
}
