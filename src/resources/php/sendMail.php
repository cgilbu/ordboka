<?php

include($_SERVER['DOCUMENT_ROOT'] . "/config.php");

if (empty($_POST['subject']) || empty($_POST['message'])) {
	return false;
}

$mailSent = mail($_config_admin_email, $_POST['subject'], $_POST['message']);

if (!$mailSent) {
	return false;
}

?>
