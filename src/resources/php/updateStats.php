<?php

if (!empty($_POST['newStats'])) {
	$statsFile = $_SERVER['DOCUMENT_ROOT'] . '/statistics.php';
	$newStats;

	if (filesize($statsFile) > 1) {
		$newStats = ',' . $_POST['newStats'];
	} else {
		$newStats = $_POST['newStats'];
	}

	if (strlen($newStats) > 1) {
		$write = file_put_contents($statsFile, $newStats.PHP_EOL, FILE_APPEND | LOCK_EX);

		if ($write > 0) {
			exit();
		}
	}
}

header("HTTP/1.1 500 Internal Server Error");
exit();

?>
