<?php

if (empty($_GET['statsData'])) {
	header('HTTP/1.1 500 Internal Server Error');
	exit();
}

$statsFile = $_SERVER['DOCUMENT_ROOT'] . '/statistics.php';
$statsData = strip_tags($_GET['statsData']);

if (filesize($statsFile) > 1) {
	$statsData = ',' . $statsData;
}

$write = file_put_contents($statsFile, $statsData.PHP_EOL, FILE_APPEND | LOCK_EX);

if ($write > 0) {
	exit();
}

header('HTTP/1.1 500 Internal Server Error');
exit();

?>
