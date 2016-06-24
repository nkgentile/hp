<?php

$id = FILTER_INPUT(INPUT_GET, "id", FILTER_SANITIZE_NUMBER_INT);

if(!isset($id)){
	echo "Not a valid id";
	die();
}

require_once("../include/database.php");

/* GET USER */
$sql = db()->prepare("call user(:id)");
$sql->bindValue(":id", $id, PDO::PARAM_INT);
$sql->execute();
$user = $sql->fetch(PDO::FETCH_ASSOC);
$sql->closeCursor();

/* GET HOTEL IDS */
$sql = db()->prepare("select hotel_id as id from reviews where user_id = :id order by date");
$sql->bindValue(":id", $user["id"], PDO::PARAM_INT);
$sql->execute();
$user["reviews"] = $sql->fetchAll(PDO::FETCH_ASSOC);
$sql->closeCursor();

/* POPULATE HOTELS */
$sql = db()->prepare("select id, name, concat_ws(\", \", (select name from cities where id = hotel.city_id), (select name from countries where id = hotel.country_id)) as city, (select filename from images where id = (select image_id from hotel_images where hotel_id = hotel.id limit 1)) as image from hotels as hotel where id = :id");
$hotel_id = null;
$sql->bindParam(":id", $hotel_id, PDO::PARAM_INT);
foreach($user["reviews"] as &$review){
	$hotel_id = $review["id"];
	$sql->execute();
	$review = $sql->fetch(PDO::FETCH_ASSOC);
}
unset($review);
$sql->closeCursor();

echo json_encode($user, JSON_PRETTY_PRINT);
