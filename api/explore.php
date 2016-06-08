<?php

require_once("../include/database.php");

$response = [];

$db = new Database();
$sql = "CALL experiences()";
$db->query($sql);
while($e = $db->get())
	$response[] = $e;

$db = new Database();
$sql = "CALL destinations()";
$db->query($sql);
while($d = $db->get())
	$response[] = $d;

shuffle($response);
echo json_encode($response);
