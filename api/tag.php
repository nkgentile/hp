<?php

require_once("../include/database.php");

$type = filter_input(INPUT_GET, "type", FILTER_SANITIZE_STRING);
$id = filter_input(INPUT_GET, "id", FILTER_SANITIZE_STRING);

if(!isset($type) || !isset($id)) die();

$db = db();
$query = $db->prepare("call tag(:type, :id)");
$query->bindValue(":type", $type, PDO::PARAM_STR);
$query->bindValue(":type", $id, PDO::PARAM_INT);
$query->execute();
$items = $query->fetchAll(PDO::FETCH_ASSOC);
$query->closeCursor();

echo json_encode($items, JSON_PRETTY_PRINT);
