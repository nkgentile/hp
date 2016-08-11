<?php

function db(){
	$dbh = new PDO("sqlite:../include/model.db");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

$sql = <<<SQL
		SELECT
		id, name,
        "compass.svg" as badge,
        image, "region" as type,
        "#46ECD5" as color
		FROM regions
        WHERE published = 1
	UNION
    SELECT
		id, name, 
        "star.svg" as badge, image,
        "experience" as type,
		"#CB50CF" as color
        FROM experiences
        WHERE published = 1
	UNION
    SELECT
		id, name,
        "pin.svg" as badge, image,
        "city" as type,
        "#0ADCF3" as color
        FROM cities
	UNION
	SELECT
		id, name,
        "hotel.svg" as badge, image,
        "hotel" as type,
        "#66E887" as color
        FROM hotels
    LIMIT 25;
SQL;
$query = db()->prepare($sql);
$query->execute();
$response = $query->fetchAll(PDO::FETCH_ASSOC);
shuffle($response);
echo json_encode($response, JSON_PRETTY_PRINT);
