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

/* GET HOTEL */
$db = db();
$sql = <<<SQL
	select
		id, name,
        address, phone, website, latitude, longitude,
        (select name from cities where id= city_id) || ", " ||
        (select name from countries where id= country_id) as city,
        (select filename from images where id = (select image_id from hotel_images where hotel_id = :id)) as images,
        "" as reviews
	from hotels
	where id = :id
    limit 1;
SQL;
$query = $db->prepare($sql);
$query->bindValue(":id", $id, PDO::PARAM_INT);
$query->execute();

$hotel = $query->fetch(PDO::FETCH_ASSOC);
$query->closeCursor();

/* GET REVIEWS */
$db = db();
$sql = <<<SQL
	select
		id,
		date,
        blurb, body,
        user_id as user
	from reviews
    where hotel_id = :id;
SQL;
$query = $db->prepare($sql);

$user = new User();
$query->bindValue(":id", $hotel["id"], PDO::PARAM_INT);
$query->execute();

$reviews = $query->fetchAll(PDO::FETCH_ASSOC);
foreach($reviews as &$review){
	$review["blurb"] = html_entity_decode($review["blurb"], ENT_HTML5);
	$review["body"] = html_entity_decode($review["body"], ENT_HTML5);
	$review["user"] = $user->get($review["user"]);
}
unset($review);
$hotel["reviews"] = $reviews;
$query->closeCursor();

/* GET EXPERIENCES */
$sql = db()->prepare("select experience_id as id from hotel_experiences where hotel_id = :id");
$sql->bindValue(":id", $hotel["id"], PDO::PARAM_INT);
$sql->execute();
$hotel["experiences"] = $sql->fetchAll(PDO::FETCH_ASSOC);
$sql->closeCursor();

$sql = db()->prepare("select id, name, badge from experiences where id = :id");
foreach($hotel["experiences"] as &$experience){
	$sql->bindValue(":id", $experience["id"], PDO::PARAM_INT);
	$sql->execute();
	$experience = $sql->fetch(PDO::FETCH_ASSOC);
}
unset($experience);
$sql->closeCursor();

echo json_encode($hotel, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

/* HELPER CLASSES */
class User{
	private $db;
	private $query;
	
	function __construct(){
		$this->db = db();
		$this->query = $this->db->prepare(
			"select id, first as name, portrait from users where id = :id limit 1;"
		);
	}
	
	function __destruct(){
		$this->query->closeCursor();
	}
	
	function get($id){
		$this->query->bindValue(
			":id",
			$id,
			PDO::PARAM_INT
		);
		$this->query->execute();
		return $this->query->fetch(PDO::FETCH_ASSOC);
	}
}
