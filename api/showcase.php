<?php

require_once("../include/database.php");
$db = new Database();

$sql =	"CALL showcase()";
$db->query($sql);
$reviews = [];
while($r = $db->get())
	$reviews[] = $r;

echo json_encode($reviews);
