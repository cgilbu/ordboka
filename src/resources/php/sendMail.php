<?php

include($_SERVER['DOCUMENT_ROOT'] . "/config.php");

if (empty($_POST['subject']) || empty($_POST['message'])) {
	header("HTTP/1.1 500 Internal Server Error");
	exit();
}

$mailSent = mail($_config_admin_email, $_POST['subject'], $_POST['message']);

if ($mailSent) {
	exit();
}

header("HTTP/1.1 500 Internal Server Error");
exit();

?>
