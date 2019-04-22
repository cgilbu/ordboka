<!DOCTYPE html>
<html lang="no">
<head>
	<title>Ordboka</title>

	<meta charset="UTF-8">
	<meta name="theme-color" content="#08253b"> <!-- Dark blue -->
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="mobile-web-app-capable" content="yes">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<meta name="description" content="Er det mange vanskelige ord i menigheten? Finn forklaringene her!">

	<meta property="og:url" content="https://<?= $_SERVER['HTTP_HOST'] ?>">
	<meta property="og:title" content="Ordboka">
	<meta property="og:description" content="Er det mange vanskelige ord i menigheten? Finn forklaringene her!">
	<meta property="og:image" content="https://<?= $_SERVER['HTTP_HOST'] ?>/resources/images/apple-touch-icon.png">

	<link rel="shortcut icon" href="/favicon.png">
	<link rel="apple-touch-icon" href="/resources/images/apple-touch-icon.png">

	<link rel="stylesheet" href="/resources/css/app.css">
	<link rel="stylesheet" href="/resources/css/responsive.css">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,700">

	<link rel="manifest" href="/manifest.json">
</head>
<body>
	<input type="text" id="search" autocomplete="off">
	<div id="dictionary"></div>
	<div id="loading"><img src="/resources/images/loading.svg" alt="Laster"></div>

	<div id="definitions"></div>

	<div id="infoTip" class="tip"></div>
	<div id="closeTip" class="tip hidden">Tips: Klikk utenfor teksten for å gå tilbake</div>

	<div id="menuButton">
		<img id="openMenu" src="/resources/images/bars.svg" alt="Åpne meny">
		<img id="closeMenu" src="/resources/images/times.svg" alt="Lukk meny">
	</div>

	<div id="menu" class="popup hidden">
		<div class="popupContent">
			<div id="downloadMenuItem" data-popup-id="downloadPopup">Last ned som app</div>
			<div data-popup-id="contactPopup">Kom med forslag</div>
			<div data-popup-id="definingPopup">Definering av ord</div>
			<div data-popup-id="fossPopup">Kode og personvern</div>
			<div id="shareMenuItem" data-popup-id="sharePopup">Del med andre</div>
			<div data-popup-id="aboutPopup">Om Ordboka</div>
		</div>
	</div>

	<div id="welcomePopup" class="popup hidden">
		<div class="popupContent">
			<p>Velkommen til ordboka! <b>Klikk på ordene</b> for å se hva de betyr. Les om <b>hvordan vi definerer ord</b> i menyen, og kom gjerne med forslag til <b>nye ord</b> eller <b>endringer</b>.</p>
			<p>Du kan laste ned ordboka som en <b>app på mobilen</b> via menyen.</p>
			<div id="startButton" class="button close">Sett i gang</div>
			<div id="adminButton" class="button close"></div>
		</div>
	</div>

	<div id="updatePopup" class="popup hidden">
		<div class="popupContent">
			<p>En <b>ny versjon</b> av ordboka er tilgjengelig! <a href="https://github.com/cgilbu/ordbok/releases" target="_blank" rel="noreferrer">Klikk her</a> for å se hva som er nytt. Nye og oppdaterte ord vil i starten være <b>uthevet</b>.</p>
			<div id="updateButton" class="button close">Oppdater</div>
		</div>
	</div>

	<div id="downloadPopup" class="popup hidden">
		<div class="popupContent">
			<p id="androidChrome" class="hidden">Du burde allerede ha fått opp et spørsmål nederst på skjermen om du vil lagre ordboka på mobilen. Hvis du takket nei kan du fortsatt gjøre det via menyen i Chrome: <b>Legg til på startsiden</b>.</p>
			<p id="androidOther" class="hidden">Åpne ordboka i Chrome. Det vil da dukke opp et spørsmål nederst på skjermen om du vil lagre den på mobilen. Du kan kopiere denne linken over i Chrome: <b><?= $_SERVER['HTTP_HOST'] ?></b></p>
			<p id="iosChrome" class="hidden">Åpne ordboka i Safari og følg oppskriften nedenfor. Du kan kopiere denne linken over i Safari: <b><?= $_SERVER['HTTP_HOST'] ?></b></p>
			<p id="ios" class="hidden"><img src="/resources/images/ios-add-home-screen.png" alt="Add to Home Screen"></p>
			<p id="telegram" class="hidden"><b>Viktig:</b> Fungerer ikke hvis du åpnet appen via Telegram. Kopier heller denne linken over i Safari: <b><?= $_SERVER['HTTP_HOST'] ?></b></p>
			<div class="button close">Gå tilbake</div>
		</div>
	</div>

	<div id="contactPopup" class="popup hidden">
		<div class="popupContent">
			<p>Husk å lese hvordan vi definerer ord før du sender inn forslag (se i menyen). Alle henvendelser blir nøye vurdert og sjekket opp. Dersom forslaget ditt blir godkjent vil det bli synlig i ordboka innen en ukes tid.</p>
			<p>
				<input id="wordSuggestion" type="text" placeholder="Nytt eller eksisterende ord" maxlength="20">
				<textarea id="textSuggestion" placeholder="Forslag til definisjon eller endring" maxlength="150"></textarea>
			</p>
			<div id="contactButton" class="button">Send inn</div>
			<div class="button close">Gå tilbake</div>
		</div>
	</div>

	<div id="suggestionSentPopup" class="popup hidden">
		<div class="popupContent">
			<p>Takk for forslaget! Dersom forslaget ikke dukker opp skyldes det mest sannsynlig at ordet ikke nevnes nok i bibelen og på møter, eller ikke er vesentlig for forståelsen av evangeliet for yngre tenåringer. Vi ønsker ordboka så konsis som mulig. Merk også at vi forholder oss til norske ordbøker.</p>
			<div class="button close">Greit</div>
		</div>
	</div>

	<div id="definingPopup" class="popup hidden">
		<div class="popupContent">
			<p>Målet er å hjelpe unge tenåringer med å forstå vanskelige og kanskje utdaterte ord i bibelen og på møter. Vi fokuserer derfor på å gjøre forklaringene så enkle som mulig.</p>
			<p>En kan ha ulike oppfatninger om hva et ord betyr, også innad i menigheten. Vi har derfor valgt å forholde oss til norske ordbøker. En får dermed en grunnleggende forståelse av hva ordet betyr, og kan bygge på toppen av det, basert på det man hører og lærer i menigheten.</p>
			<p>Vi gjør vårt aller beste for at definisjonene skal bli så korrekte som mulig, men står ikke ansvarlige for feilaktige eller mangelfulle definisjoner. Alle som vil kan være med på å sende inn forslag til nye ord eller endringer.</p>
			<div class="button close">Greit</div>
		</div>
	</div>

	<div id="fossPopup" class="popup hidden">
		<div class="popupContent">
			<p>Denne appen har en <a href="https://github.com/cgilbu/ordbok" target="_blank" rel="noreferrer">åpen kildekode</a>. Ta gjerne en titt på koden og hjelp oss med å gjøre ordboka enda bedre!</p>
			<p>Personvern er viktig. Vi benytter oss derfor verken av Google Analytics eller informasjonskapsler (cookies). Vi sporer heller ikke IP-adressen din. Vi kan på ingen måte vite om det er du eller Frodo Baggins som bruker ordboka, med unntak av dersom du sender inn et forslag hvor du avslører deg selv i teksten.</p>
			<div class="button close">Greit</div>
		</div>
	</div>

	<div id="sharePopup" class="popup hidden">
		<div class="popupContent">
			<p>Du kan dele ordboka med andre ved å sende dem linken nedenfor, eller du kan trykke på <b>delingsknappen</b> på mobilen.</p>
			<p><b><?= $_SERVER['HTTP_HOST'] ?></b></p>
			<div class="button close">Lukk</div>
		</div>
	</div>

	<div id="aboutPopup" class="popup hidden">
		<div class="popupContent">
			<p>Ordboka er et helt <b>privat initiativ</b>, og en <b>frittstående app</b> uten direkte tilknytning til BCC. Bakgrunnen for ideen er et ønske om å hjelpe unge tenåringer med å forstå vanskelige og kanskje utdaterte ord i bibelen og på møter.</p>
			<p>Vi gjør vårt aller beste for at definisjonene skal bli så korrekte som mulig, men står ikke ansvarlige for feilaktige eller mangelfulle definisjoner. Alle som vil kan være med på å sende inn forslag til nye ord eller endringer.</p>
			<div class="button close">Greit</div>
		</div>
	</div>

	<script src="/resources/js/helpers.js"></script>
	<script src="/resources/js/app.js"></script>
</body>
</html>
