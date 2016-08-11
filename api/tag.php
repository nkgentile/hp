<?php

function db(){
	$dbh = new PDO("sqlite:../include/model.db");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

$type = filter_input(INPUT_GET, "type", FILTER_SANITIZE_STRING);
$id = filter_input(INPUT_GET, "id", FILTER_SANITIZE_NUMBER_INT);

if(!isset($type) || !isset($id)) die();

$db = db();
$query = $db->prepare("select * from {$type}s where id = :id");
$query->bindValue(":id", $id, PDO::PARAM_INT);
$query->execute();
$items = $query->fetchAll(PDO::FETCH_ASSOC);
$query->closeCursor();

echo json_encode($items, JSON_PRETTY_PRINT);
