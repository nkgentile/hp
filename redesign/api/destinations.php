<?php

require_once("../include/database.php");
$db = new Database();

$sql =	"CALL destinations()";
$db->query($sql);
$destinations = [];
while($d = $db->get())
	$destinations[] = $d;

echo json_encode($destinations);
