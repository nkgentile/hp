<?php

require_once("database.php");
$db = new Database();
$destinations = array();

$sql = "SELECT * ";
$sql .= "FROM destinations ";
$sql .= "ORDER BY name";
$db->query($sql);
while($d = $db->get())
	array_push($destinations, $d);
echo json_encode($destinations);

?>

