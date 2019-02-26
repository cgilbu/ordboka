// ******************************************************
// Modules
// ******************************************************

var Core = {};
var DOM = {};
var Events = {};
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

	//localStorage.removeItem("returning");

	if (!localStorage.getItem("returning")) {
		View.showPopup(DOM.welcomePopup);
	}
});

// ******************************************************
// Core: Get words
// ******************************************************

Core.getWords = function(callback) {
	$.getJSON("/resources/data/words.json", function(data) {
		callback(data);
	}).fail(function() {
		alert("Something went wrong: Failed to load words");
	});
}

// ******************************************************
// View: Cache DOM
// ******************************************************

View.cacheDom = function() {
	DOM.backButton = $(".button.back");
	DOM.body = $("body");
	DOM.contactButton = $(".button.contact");
	DOM.contactMenuItem = $(".menu .contact");
	DOM.contactPopup = $(".popup.contact");
	DOM.definingMenuItem = $(".menu .defining");
	DOM.definingPopup = $(".popup.defining");
	DOM.fossMenuItem = $(".menu .foss");
	DOM.fossPopup = $(".popup.foss");
	DOM.menu = $(".popup.menu");
	DOM.menuButton = $(".menuButton");
	DOM.okButton = $(".button.ok");
	DOM.overlay = $(".overlay");
	DOM.popup = $(".popup");
	DOM.search = $(".search");
	DOM.startButton = $(".button.start")
	DOM.textSuggestion = $(".textSuggestion");
	DOM.tip = $(".tip");
	DOM.welcomePopup = $(".popup.welcome");
	DOM.wordSuggestion = $(".wordSuggestion");
}

// ******************************************************
// View: Load words
// ******************************************************

View.loadWords = function(words) {
	words.sort(function(wordObject) {
		var title = wordObject.Title.toLowerCase();
		title = title.replace("æ", "z").replace("ø", "zz").replace("å", "zzz"); // Norwegian characters
		return title.localeCompare(title);
	});

	DOM.dictionary = $(".dictionary");

	$.each(words, function(index, wordObject) {
		var title = wordObject.Title;
		var definition = wordObject.Definition;

		DOM.dictionary.append('<div class="word"><div class="title">' + title + '</div><div class="definition popup"><b>' + title + '</b><br>' + definition + '</div></div>');
	});

	DOM.word = $(".word");
	DOM.definition = $(".definition");

	Events.bindEvents();

	DOM.search.attr("placeholder", "Søk blant " + words.length + " ord");
}

// ******************************************************
// View: Search
// ******************************************************

View.search = function(term) {
	var term = term.toLowerCase();
	DOM.word.each(function() {
		var text = $(this).find(".title").text().toLowerCase();
		(text.indexOf(term) == 0) ? $(this).show() : $(this).hide();
	});
}

// ******************************************************
// View: Popups
// ******************************************************

View.showPopup = function(popup) {
	DOM.body.css("overflow", "hidden");
	DOM.overlay.show();
	popup.show();
}

View.hidePopups = function() {
	DOM.body.css("overflow", "visible");
	DOM.overlay.hide();
	DOM.popup.hide();
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
		View.showPopup(DOM.menu);
	}
}

// ******************************************************
// Events: Bind events
// ******************************************************

Events.bindEvents = function() {
	DOM.startButton.click(function() {
		localStorage.setItem("returning", "1");
		View.hidePopups();
	});

	DOM.okButton.click(function() {
		View.hidePopups();
	});

	DOM.backButton.click(function() {
		View.hidePopups();
	});

	DOM.search.keyup(function() {
		View.search($(this).val());
	});

	DOM.search.click(function() {
		if ($(this).val()) {
			$(this).val("");
			$(this).blur();
			View.search("");
		}
	});

	DOM.word.click(function() {
		DOM.body.css("overflow", "hidden");
		DOM.overlay.show();
		$(this).find(".definition").show();
		DOM.tip.show();
	});

	DOM.overlay.click(function() {
		if (DOM.definition.is(":visible")) {
			View.hidePopups();
			DOM.definition.hide();
			DOM.tip.hide();
		}
	});

	DOM.menuButton.click(function() {
		View.triggerMenu();
	});

	DOM.contactMenuItem.click(function() {
		View.triggerMenu();
		View.showPopup(DOM.contactPopup);
	});

	DOM.definingMenuItem.click(function() {
		View.triggerMenu();
		View.showPopup(DOM.definingPopup);
	});

	DOM.fossMenuItem.click(function() {
		View.triggerMenu();
		View.showPopup(DOM.fossPopup);
	});

	DOM.contactButton.click(function() {

		if (!DOM.wordSuggestion.val()) {
			return;
		}

		var content = DOM.wordSuggestion.val() + ": " + DOM.textSuggestion.val();

		$.ajax({
			type: "post",
			url: "/resources/php/sendMail.php",
			data: { subject: "Ordboka: Nytt forslag", message: content }
		}).done(function(data) {
			View.hidePopups();
			DOM.wordSuggestion.val("");
			DOM.textSuggestion.val("");
			alert("Forslaget har blitt sendt inn. Tusen takk.");
		}).fail(function() {
			alert("Something went wrong: Failed to send form");
		});
	});
}
