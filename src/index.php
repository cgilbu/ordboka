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

	<link rel="stylesheet" href="/vendors/fontawesome/css/all.min.css">
	<link rel="stylesheet" href="/resources/css/app.css">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,700">

	<link rel="manifest" href="/manifest.json">
</head>
<body>
	<input type="text" class="search" autocomplete="off">
	<div class="dictionary"></div>
	<div class="loading"><img src="/resources/images/loading.svg" alt="Laster"></div>

	<div class="definitions"></div>

	<div class="tip info"></div>
	<div class="tip close hidden">Tips: Klikk utenfor teksten for å gå tilbake</div>

	<div class="menuButton">
		<i class="fas fa-bars"></i>
		<i class="fas fa-times"></i>
	</div>

	<div class="popup menu hidden">
		<div class="popupContent">
			<div class="download">Last ned som app</div>
			<div class="contact">Kom med forslag</div>
			<div class="defining">Definering av ord</div>
			<div class="foss">Kode og personvern</div>
			<div class="share">Del med andre</div>
			<div class="about">Om Ordboka</div>
		</div>
	</div>

	<div class="popup welcome hidden">
		<div class="popupContent">
			<p>Velkommen til ordboka! <b>Klikk på ordene</b> for å se hva de betyr. Les om <b>hvordan vi definerer ord</b> i menyen, og kom gjerne med forslag til <b>nye ord</b> eller <b>endringer</b>.</p>
			<p>Du kan laste ned ordboka som en <b>app på mobilen</b> via menyen.</p>
			<div class="button close start">Sett i gang</div>
		</div>
	</div>

	<div class="popup update hidden">
		<div class="popupContent">
			<p>En ny versjon av ordboka er tilgjengelig!</p>
			<div class="button close update">Oppdater</div>
		</div>
	</div>

	<div class="popup download hidden">
		<div class="popupContent">
			<p class="androidChrome">Du burde allerede ha fått opp et spørsmål nederst på skjermen om du vil lagre ordboka på mobilen. Hvis du takket nei kan du fortsatt gjøre det via menyen i Chrome: <b>Legg til på startsiden</b>.</p>
			<p class="androidOther">Klikk på knappen nedenfor for å <b>åpne ordboka i Chrome</b>. Det vil da dukke opp et spørsmål nederst på skjermen om du vil lagre den på mobilen. Du kan også gjøre det via menyen i Chrome: <b>Legg til på startsiden</b>.</p>
			<p class="iosChrome">Åpne ordboka i Safari og følg oppskriften nedenfor. Du kan kopiere denne linken over i Safari: <a href="#">https://<?= $_SERVER['HTTP_HOST'] ?></a></p>
			<p class="ios"><img src="/resources/images/ios-add-home-screen.png" alt="Add to Home Screen"></p>
			<p class="telegram"><b>Viktig:</b> Fungerer ikke hvis du åpnet appen via Telegram. Kopier heller denne linken over i Safari: <a href="#">https://<?= $_SERVER['HTTP_HOST'] ?></a></p>

			<div class="button openInChrome">Åpne i Chrome</div>
			<div class="button close">Gå tilbake</div>
		</div>
	</div>

	<div class="popup contact hidden">
		<div class="popupContent">
			<p>Husk å lese hvordan vi definerer ord før du sender inn forslag (se i menyen). Alle henvendelser blir nøye vurdert og sjekket opp. Dersom forslaget ditt blir godkjent vil det bli synlig i ordboka innen en ukes tid.</p>
			<p>
				<input type="text" class="wordSuggestion" placeholder="Nytt eller eksisterende ord" maxlength="20">
				<textarea class="textSuggestion" placeholder="Forslag til definisjon eller endring" maxlength="150"></textarea>
			</p>
			<div class="button contact">Send inn</div>
			<div class="button close">Gå tilbake</div>
		</div>
	</div>

	<div class="popup suggestionSent hidden">
		<div class="popupContent">
			<p>Forslaget ditt har blitt sendt inn. Tusen takk! Dersom forslaget ikke blir godkjent, skyldes det mest sannsynlig at ordet ikke nevnes nok i bibelen og på møter, eller at det ikke er like relevant for yngre tenåringer, eller at det ikke er vesentlig for forståelsen av evangeliet. Vi er likevel takknemlige for alle forslagene vi får inn.</p>
			<div class="button close">Greit</div>
		</div>
	</div>

	<div class="popup defining hidden">
		<div class="popupContent">
			<p>Målet er å hjelpe unge tenåringer med å forstå vanskelige og kanskje utdaterte ord i bibelen og på møter. Vi fokuserer derfor på å gjøre forklaringene så enkle som mulig.</p>
			<p>En kan ha ulike oppfatninger om hva et ord betyr, også innad i menigheten. Vi har derfor valgt å forholde oss til norske ordbøker. En får dermed en grunnleggende forståelse av hva ordet betyr, og kan bygge på toppen av det, basert på det man hører og lærer i menigheten.</p>
			<p>Vi gjør vårt aller beste for at definisjonene skal bli så korrekte som mulig, men står ikke ansvarlige for feilaktige eller mangelfulle definisjoner. Alle som vil kan være med på å sende inn forslag til nye ord eller endringer.</p>
			<div class="button close">Greit</div>
		</div>
	</div>

	<div class="popup foss hidden">
		<div class="popupContent">
			<p>Denne appen har en <a href="https://github.com/cgilbu/ordbok" target="_blank" rel="noreferrer">åpen kildekode</a>. Ta gjerne en titt på koden og hjelp oss med å gjøre ordboka enda bedre!</p>
			<p>Personvern er viktig. Vi benytter oss derfor verken av Google Analytics eller informasjonskapsler (cookies). Vi sporer heller ikke IP-adressen din. Vi kan på ingen måte vite om det er du eller Frodo Baggins som bruker ordboka, med unntak av dersom du sender inn et forslag hvor du avslører deg selv i teksten.</p>
			<div class="button close">Greit</div>
		</div>
	</div>

	<div class="popup share hidden">
		<div class="popupContent">
			<p>Du kan dele ordboka med andre ved å sende dem linken nedenfor, eller du kan trykke på <b>delingsknappen</b> på mobilen.</p>
			<p><a href="#">https://<?= $_SERVER['HTTP_HOST'] ?></a></p>
			<div class="button close">Lukk</div>
		</div>
	</div>

	<div class="popup about hidden">
		<div class="popupContent">
			<p>Ordboka er et helt <b>privat initiativ</b>, og en <b>frittstående app</b> uten direkte tilknytning til BCC. Bakgrunnen for ideen er et ønske om å hjelpe unge tenåringer med å forstå vanskelige og kanskje utdaterte ord i bibelen og på møter.</p>
			<p>Vi gjør vårt aller beste for at definisjonene skal bli så korrekte som mulig, men står ikke ansvarlige for feilaktige eller mangelfulle definisjoner. Alle som vil kan være med på å sende inn forslag til nye ord eller endringer.</p>
			<div class="button close">Greit</div>
		</div>
	</div>

	<script src="/vendors/jquery-3.3.1.min.js"></script>
	<script src="/vendors/underscore-min.js"></script>
	<script src="/resources/js/app.js"></script>
</body>
</html>
