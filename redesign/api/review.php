<?php

$id = FILTER_INPUT(INPUT_GET, "id", FILTER_SANITIZE_NUMBER_INT);
if(!$id){
	echo "Invalid id...: ";
	echo $id;
	die();
}

require_once("../include/database.php");
$db = new Database();
$sql = "CALL review({$id})";
$db->query($sql);
$review = $db->get();
echo json_encode($review);
