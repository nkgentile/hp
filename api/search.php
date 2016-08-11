<?php

$query = filter_input(INPUT_GET, "query", FILTER_SANITIZE_STRING);

if(!$query){
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
		id, name, type
		FROM dictionary
		WHERE LOWER(name) LIKE LOWER(CONCAT("%", :query, "%"))
        ORDER BY name
		LIMIT 10
	;
SQL;
$query = db()->prepare($sql);
$query->bindValue(":query", $query, PDO::PARAM_STRING);
$query->execute();
$response = $query->fetch(PDO::FETCH_ASSOC);
$query->closeCursor();
echo json_encode($response, JSON_PRETTY_PRINT);

