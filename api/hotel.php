<?php

$id = FILTER_INPUT(INPUT_GET, "id", FILTER_SANITIZE_NUMBER_INT);
if(!$id){
	echo "Invalid id...: ";
	echo $id;
	die();
}

require_once("../include/database.php");

/* GET HOTEL */
$db = db();
$query = $db->prepare("call hotel(:id)");
$query->bindValue(":id", $id, PDO::PARAM_INT);
$query->execute();

$hotel = $query->fetch(PDO::FETCH_ASSOC);
$query->closeCursor();

/* GET REVIEWS */
$db = db();
$query = $db->prepare("call reviews(:id)");

$user = new User();
$query->bindValue(":id", $hotel["id"], PDO::PARAM_INT);
$query->execute();

$reviews = $query->fetchAll(PDO::FETCH_ASSOC);
foreach($reviews as &$review){
	$review["body"] = html_entity_decode(
		$review["body"],
		ENT_HTML5 | ENT_QUOTES,
		"UTF-8"
	);
	
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

echo json_encode($hotel, JSON_PRETTY_PRINT);

/* HELPER CLASSES */
class User{
	private $db;
	private $query;
	
	function __construct(){
		$this->db = db();
		$this->query = $this->db->prepare(
			"select id, CONCAT_WS(\" \", first, last) as name, portrait as image from users where id = :id limit 1;"
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
		return $this->query->fetchAll(PDO::FETCH_ASSOC);
	}
}
