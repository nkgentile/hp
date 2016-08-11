<?php

$id = FILTER_INPUT(INPUT_GET, "id", FILTER_SANITIZE_NUMBER_INT);

if(!isset($id)){
	echo "Not a valid id";
	die();
}

function db(){
	$dbh = new PDO("sqlite:../include/model.db");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

/* GET USER */
$sql = <<<SQL
	SELECT
		user.id,
		first || " " || last AS name,
		portrait, background, profession,
		about, "@" || username AS username,
		(select name from cities as city where city.id = user.city_id) || ", " || 
		(select name from countries as country where country.id = (
				select city.country_id from cities as city where city.id = user.city_id
		)) as city
		
		FROM users AS user
        
		WHERE user.id = :id
		LIMIT 1
	;
SQL;

$query = db()->prepare($sql);
$query->bindValue(":id", $id, PDO::PARAM_INT);
$query->execute();
$user = $query->fetch(PDO::FETCH_ASSOC);
$query->closeCursor();

/* GET HOTEL IDS */
$query = db()->prepare("select hotel_id as id from reviews where user_id = :id order by date");
$query->bindValue(":id", $user["id"], PDO::PARAM_INT);
$query->execute();
$user["reviews"] = $query->fetchAll(PDO::FETCH_ASSOC);
$query->closeCursor();

/* POPULATE HOTELS */
$sql = <<<SQL
	select
		id, name,
		(select name from cities where id = hotel.city_id) || (select name from countries where id = hotel.country_id) as city,
		(select filename from images where id = (select image_id from hotel_images where hotel_id = hotel.id limit 1)) as image
		from hotels as hotel where id = :id
SQL;
$query = db()->prepare($sql);
$hotel_id = null;
$query->bindParam(":id", $hotel_id, PDO::PARAM_INT);
foreach($user["reviews"] as &$review){
	$hotel_id = $review["id"];
	$query->execute();
	$review = $query->fetch(PDO::FETCH_ASSOC);
}
unset($review);
$query->closeCursor();

echo json_encode($user, JSON_PRETTY_PRINT);
