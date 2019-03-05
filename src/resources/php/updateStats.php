<?php

if (empty($_POST['newStats'])) {
	header("HTTP/1.1 500 Internal Server Error");
	exit();
}

$statsFile = $_SERVER['DOCUMENT_ROOT'] . '/statistics.php';
$newStats = "";

if (filesize($statsFile) > 1) {
	$newStats = ',' . $_POST['newStats'];
} else {
	$newStats = $_POST['newStats'];
}

$write = file_put_contents($statsFile, $newStats.PHP_EOL, FILE_APPEND | LOCK_EX);

if ($write > 0) {
	exit();
}

header("HTTP/1.1 500 Internal Server Error");
exit();

?>
