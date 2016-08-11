<?php

require_once "database.php";

$db = new Database();
$sql = <<<SQL
select * from reviews limit 5
SQL;

$query = db()->query($sql);
$query->execute();

$reviews = $query->fetchAll(PDO::FETCH_ASSOC);
$query->closeCursor();

echo json_encode($reviews, JSON_PRETTY_PRINT);