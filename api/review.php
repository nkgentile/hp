<?php

$id = FILTER_INPUT(INPUT_GET, "id", FILTER_SANITIZE_NUMBER_INT);
if(!$id){
	echo "Invalid id...: ";
	echo $id;
	die();
}

function db(){
	$dbh = new PDO("sqlite:../include/model.db");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

$sql = <<<SQL
	SELECT
		reviews.body AS review,
		
		users.first || " " || users.last AS user,
		users.portrait, users.id,
		users.city_id,
		
		hotels.name AS hotel,
		hotels.address AS address
		
		FROM reviews
		
		INNER JOIN users
			ON reviews.user_id = users.id
			
		INNER JOIN hotels
			ON reviews.hotel_id = hotels.id
		
		WHERE reviews.id = users.id
			AND reviews.published = 1
		LIMIT 1
	;
SQL;
$query = db()->prepare($sql);
$query->execute();
$review = $query->fetch(PDO::FETCH_ASSOC);
$review["review"] = html_entity_decode($review["review"], ENT_HTML5, "UTF-8");
echo json_encode($review, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
