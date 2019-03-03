// ******************************************************
// Modules
// ******************************************************

var Core = {};
var DOM = {};
var Events = {};
var Helpers = {};
var View = {};

'use strict';

// ******************************************************
// Service worker
// ******************************************************

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/service-worker.js");
}

// ******************************************************
// Init app
// ******************************************************

$(document).ready(function() {
	View.cacheDom();
	Core.getWords(View.loadWords);

	if (!localStorage.getItem("userID")) {
		View.showPopup("welcome");
	}

	Helpers.prepareDownload();
});

// ******************************************************
// Core: Get words
// ******************************************************

Core.getWords = function(callback) {
	$.getJSON("/resources/data/words.json", function(data) {
		callback(data);
	}).fail(function() {
		alert("Noe gikk galt: Kunne ikke laste ord");
	});
}

// ******************************************************
// View: Cache DOM
// ******************************************************

View.cacheDom = function() {
	DOM.body = $("body");
	DOM.closeButtons = $(".button.close");
	DOM.contactButton = $(".button.contact");
	DOM.downloadButton = $(".button.download");
	DOM.downloadMenuItem = $(".menu .download");
	DOM.downloadPopup = $(".popup.download");
	DOM.menu = $(".menu");
	DOM.menuButton = $(".menuButton");
	DOM.overlay = $(".overlay");
	DOM.popups = $(".popup");
	DOM.search = $(".search");
	DOM.shareMenuItem = $(".menu .share");
	DOM.startButton = $(".button.start");
	DOM.textSuggestion = $(".textSuggestion");
	DOM.tip = $(".tip");
	DOM.wordSuggestion = $(".wordSuggestion");
}

// ******************************************************
// View: Load words
// ******************************************************

View.loadWords = function(words) {
	words.sort(function(a, b) {
		var titleA = a.Title.toLowerCase().replace("æ", "z").replace("ø", "zz").replace("å", "zzz");
		var titleB = b.Title.toLowerCase().replace("æ", "z").replace("ø", "zz").replace("å", "zzz");

		return titleA.localeCompare(titleB);
	});

	DOM.dictionary = $(".dictionary");

	$.each(words, function(index, wordObject) {
		var title = wordObject.Title;
		var definition = wordObject.Definition;

		DOM.dictionary.append('<div class="word"><div class="title">' + title + '</div><div class="definition popup"><b>' + title + '</b><br>' + definition + '</div></div>');
	});

	DOM.words = $(".word .title");
	DOM.definitions = $(".word .definition");

	Events.bindEvents();

	DOM.search.attr("placeholder", "Søk blant " + words.length + " ord");
}

// ******************************************************
// View: Search
// ******************************************************

View.search = function(term) {
	var term = term.toLowerCase();
	DOM.words.each(function() {
		var word = $(this).text().toLowerCase();
		(word.indexOf(term) == 0) ? $(this).parent().show() : $(this).parent().hide();
	});
}

// ******************************************************
// View: Reset search
// ******************************************************

View.resetSearch = function() {
	if (DOM.search.val()) {
		DOM.search.val("");
		DOM.search.blur();
		View.search("");
	}
}

// ******************************************************
// View: Popups
// ******************************************************

View.showPopup = function(popupID) {
	DOM.body.css("overflow", "hidden");
	DOM.overlay.show();
	$(".popup." + popupID).show();
}

View.hidePopups = function() {
	DOM.body.css("overflow", "visible");
	DOM.overlay.hide();
	DOM.popups.hide();
}

// ******************************************************
// View: Trigger menu
// ******************************************************

View.triggerMenu = function() {
	var isOpen = DOM.menuButton.hasClass("isOpen");

	if (isOpen) {
		DOM.menuButton.removeClass("isOpen");
		DOM.menuButton.find(".fa-times").hide();
		DOM.menuButton.find(".fa-bars").show();
		View.hidePopups();
	} else {
		DOM.menuButton.addClass("isOpen");
		DOM.menuButton.find(".fa-bars").hide();
		DOM.menuButton.find(".fa-times").show();
		View.showPopup("menu");
	}
}

// ******************************************************
// Events: Bind events
// ******************************************************

Events.bindEvents = function() {
	DOM.closeButtons.click(function() {
		View.hidePopups();
	});

	DOM.startButton.click(function() {
		Helpers.getStatistics();
	});

	DOM.search.keyup(function() {
		View.search($(this).val());
	});

	DOM.search.click(function() {
		View.resetSearch();
	});

	DOM.words.click(function() {
		DOM.body.css("overflow", "hidden");
		DOM.overlay.show();
		$(this).next().show();
		DOM.tip.show();

		Helpers.getStatistics($(this).text());
	});

	DOM.overlay.click(function() {
		if (DOM.definitions.is(":visible")) {
			View.hidePopups();
			DOM.definitions.hide();
			DOM.tip.hide();
		}
	});

	DOM.menuButton.click(function() {
		View.triggerMenu();
	});

	DOM.menu.children().click(function() {
		var targetPopup = $(this).attr("class");
		View.triggerMenu();
		View.showPopup(targetPopup);
	});

	DOM.shareMenuItem.click(function() {
		Helpers.shareApp();
	});

	DOM.downloadButton.click(function() {
		window.location.href = "googlechrome://ordbok.joinmyblog.com";
	});

	DOM.contactButton.click(function() {
		if (DOM.wordSuggestion.val()) {
			Helpers.sendSuggestion();
		}
	});
}

// ******************************************************
// Helpers: Prepare download
// ******************************************************

Helpers.prepareDownload = function() {
	if (Helpers.isStandalone()) {
		DOM.downloadMenuItem.hide();
		return;
	}

	var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

	if (iOS) {
		DOM.downloadButton.hide();
		DOM.downloadPopup.find(".android").hide();
		DOM.downloadPopup.find(".ios").show();
	}
}

// ******************************************************
// Helpers: Is standalone (launched from home screen)
// ******************************************************

Helpers.isStandalone = function() {
	if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone == true) {
		return true;
	}

	return false;
}

// ******************************************************
// Helpers: Send suggestion
// ******************************************************

Helpers.sendSuggestion = function() {
	var message = DOM.wordSuggestion.val();

	if (DOM.textSuggestion.val()) {
		message += ": " + DOM.textSuggestion.val();
	}

	$.ajax({
		type: "post",
		url: "/resources/php/sendMail.php",
		data: { subject: "Ordboka: Nytt forslag", message: message }
	}).done(function(data) {
		View.hidePopups();
		DOM.wordSuggestion.val("");
		DOM.textSuggestion.val("");
		alert("Forslaget ditt har blitt sendt inn. Tusen takk.");
	}).fail(function() {
		alert("Noe gikk galt: Kunne ikke sende inn forslag. Sjekk at du er koblet til nettet.");
	});
}

// ******************************************************
// Helpers: Share app
// ******************************************************

Helpers.shareApp = function() {
	var link = window.location.href.replace(/\/$/, ""); // Remove trailing slash

	if (navigator.share) {
		navigator.share({
			title: "Ordboka",
			text: "Er det mange vanskelige ord i menigheten? Finn forklaringene her!",
			url: link
		});
	}
}

// ******************************************************
// Helpers: Get statistics
// ******************************************************

Helpers.getStatistics = function(wordClicked) {
	if (!localStorage.getItem("userID")) {
		var randomID = new Uint32Array(1);
		window.crypto.getRandomValues(randomID);
		localStorage.setItem("userID", parseInt(randomID));
	}

	if (!wordClicked) {
		return;
	}

	var newStats = { word: wordClicked, userID: localStorage.getItem("userID") };

	$.ajax({
		type: "post",
		url: "/resources/php/updateStats.php",
		data: { newStats: JSON.stringify(newStats) },
		error: function(data) {
			console.log("Noe gikk galt: Kunne ikke oppdatere statistikk");
		}
	});
}
