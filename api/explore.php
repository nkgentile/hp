<?php

function db(){
	$dbh = new PDO("sqlite:../include/model.db");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

$sql = <<<SQL
    SELECT
	id, name, 
        "star.svg" as badge, image,
        "experience" as type,
		"#CB50CF" as color
        FROM experiences
        WHERE published = 1
    LIMIT 25;
SQL;
$query = db()->prepare($sql);
$query->execute();
$response = $query->fetchAll(PDO::FETCH_ASSOC);
shuffle($response);
echo json_encode($response, JSON_PRETTY_PRINT);
