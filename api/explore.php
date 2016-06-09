<?php

require_once("../include/database.php");

$response = [];

$db = new Database();
$sql = "CALL explore()";
$db->query($sql);
while($e = $db->get())
	$response[] = $e;

shuffle($response);
echo json_encode($response);
