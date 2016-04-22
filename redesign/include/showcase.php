<?php

require_once "database.php";

$db = new Database();

$sql = "SELECT * ";
$sql .= "FROM reviews ";
$sql .= "LIMIT 5";

// $sql  =  "SELECT TOP 5 * ";
// $sql .=	"FROM reviews ";
// $sql .= "GROUP BY dose ";
// $sql .= "ORDER BY max(time) desc;";

$db->query($sql);

$reviews = array();
while($r = $db->get()){
	$r->text = utf8_encode($r->text);
	array_push($reviews, $r);
}
echo json_encode($reviews);

?>