<?php

if (!empty($_POST['newStats'])) {
	$statFile = $_SERVER['DOCUMENT_ROOT'] . '/statistics.json';
	$newStats;

	if (filesize($statFile) > 1) {
		$newStats = ',' . $_POST['newStats'];
	} else {
		$newStats = $_POST['newStats'];
	}

	if (strlen($newStats) > 1) {
		$write = file_put_contents($statFile, $newStats.PHP_EOL, FILE_APPEND | LOCK_EX);

		if ($write > 0) {
			exit();
		}
	}
}

header("HTTP/1.1 500 Internal Server Error");
exit();

?>
