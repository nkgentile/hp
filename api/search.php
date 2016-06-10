<?php

$query = filter_input(INPUT_GET, "query", FILTER_SANITIZE_STRING);

if(!$query){
	echo "false";
	die();
}
require_once("../include/database.php");
$db = new Database();
$sql = "CALL search(\"{$query}\")";
$db->query($sql);

$response = [];
while($r = $db->get())
	$response[] = $r;
echo json_encode($response);

