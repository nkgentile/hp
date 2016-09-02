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
		"assets/images/original/marquee.jpg" as image

	FROM hotels
	LIMIT 10;
SQL;
$query = db()->prepare($sql);
$query->execute();
$response["hotels"] = $query->fetchAll(PDO::FETCH_ASSOC);

/* Reviews */
$sql = <<<SQL
	SELECT
		id, name,
		"assets/images/original/marquee.jpg" as image
	FROM experiences
	LIMIT 10;
SQL;
$query = db()->prepare($sql);
$query->execute();
$response["experiences"] = $query->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
