<?php

include($_SERVER['DOCUMENT_ROOT'] . '/config.php');

if (empty($_GET['subject']) || empty($_GET['message'])) {
	header('HTTP/1.1 500 Internal Server Error');
	exit();
}

$mailSent = mail($_config_admin_email, strip_tags($_GET['subject']), strip_tags($_GET['message']));

if ($mailSent) {
	exit();
}

header('HTTP/1.1 500 Internal Server Error');
exit();

?>
