<?php

require_once("../include/database.php");

/* GET REVIEWS */
$query = db()->prepare("select id, user_id as user, hotel_id as hotel from reviews");
$query->execute();
$reviews = $query->fetchAll(PDO::FETCH_ASSOC);
$query->closeCursor();

/* GET USER FOR EACH REVIEW */
$query = db()->prepare("select first, portrait from users where id = :id");
$id = null;
$query->bindParam(":id", $id, PDO::PARAM_INT);
foreach($reviews as &$review){
	$id = $review["user"];
	$query->execute();
	$review["user"] = $query->fetch(PDO::FETCH_ASSOC);
}
unset($review);
$query->closeCursor();

/* GET HOTEL FOR EACH REVIEW */
$sql = <<<SQL
select
	id, name, latitude, longitude,
	(select filename from images where id = (
		select image_id from hotel_images where hotel_id = hotels.id limit 1
	)) as image,
	CONCAT_WS(
		", ",
		(select name from cities where id = city_id),
		(select name from countries where id = country_id)
	) as city
	from hotels where id = :id
SQL;
$query = db()->prepare($sql);
$id = null;
$query->bindParam(":id", $id, PDO::PARAM_INT);
foreach($reviews as &$review){
	$id = $review["hotel"];
	$query->execute();
	$review["hotel"] = $query->fetch(PDO::FETCH_ASSOC);
}
unset($review);
$query->closeCursor();

echo json_encode($reviews, JSON_PRETTY_PRINT);
