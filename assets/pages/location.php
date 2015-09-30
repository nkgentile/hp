<?php
	$keyword = array_keys($_GET);
	$keyword = filter_var($keyword[1], FILTER_SANITIZE_STRING);
	$id = filter_input(INPUT_GET, $keyword, FILTER_SANITIZE_NUMBER_INT);
	if($keyword == "")
		include_once("destinations.php");
	else
		include_once("{$keyword}.php");
?>
