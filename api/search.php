<?php

$query = filter_input(INPUT_GET, "query", FILTER_SANITIZE_STRING);

if(!$query){
	echo "false";
	die();
}
require_once("../include/database.php");
$db = new Database();
$sql =	"SELECT name, reviewer, city, country, destination, img ".
	"FROM reviews ".
	"WHERE ".
	"LOWER(name) LIKE LOWER(\"%{$query}%\") OR ".
	"LOWER(reviewer) LIKE LOWER(\"%{$query}%\") OR ".
	"city LIKE \"%{$query}%\" OR ".
	"destination LIKE \"%{$query}%\" ".
	"LIMIT 10";
$db->query($sql);

$response = [];
while($r = $db->get())
	$response[] = $r;
echo json_encode($response);

