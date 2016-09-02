<?php

function db(){
	$dbh = new PDO("sqlite:../include/model.db");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

$response = [];

/* Hotels */
$sql = <<<SQL
	SELECT
		id, name, 
		"assets/images/small/" || image as image

	FROM hotels
	LIMIT 9;
SQL;
$query = db()->prepare($sql);
$query->execute();
$response["hotels"] = $query->fetchAll(PDO::FETCH_ASSOC);

/* Experiences */
$sql = <<<SQL
	SELECT
		id, name, "assets/images/small/" || image as image
	FROM experiences
	LIMIT 9;
SQL;
$query = db()->prepare($sql);
$query->execute();
$response["experiences"] = $query->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
