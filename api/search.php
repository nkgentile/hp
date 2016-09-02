<?php

$q = filter_input(INPUT_GET, "q", FILTER_SANITIZE_STRING);

if(!$q){
	echo "false";
	die();
}

function db(){
	$dbh = new PDO("sqlite:../include/model.db");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

$sql = <<<SQL
	SELECT
		id, name || ", " || (select name from countries where countries.id = country_id limit 1) as name,
		"assets/images/small/" || image as image, "city" as type
		FROM cities
		WHERE lower(name) LIKE lower("%{$q}%")

	UNION

	SELECT
		id, name, "assets/images/small/" || image as image,
		"hotel" as type
		FROM hotels
		WHERE lower(name) LIKE lower("%{$q}%")

	ORDER BY name;
SQL;
$query = db()->prepare($sql);
$query->execute();
$response = $query->fetchAll(PDO::FETCH_ASSOC);
$query->closeCursor();
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

