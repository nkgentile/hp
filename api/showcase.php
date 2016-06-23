<?php

require_once("../include/database.php");

$db = db();
$query = $db->prepare("call showcase()");
$query->execute();
$hotels = $query->fetchAll(PDO::FETCH_ASSOC);
$query->closeCursor();

echo json_encode($hotels, JSON_PRETTY_PRINT);
