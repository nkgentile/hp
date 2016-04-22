<?php

$id = FILTER_INPUT(INPUT_GET, "id", FILTER_SANITIZE_NUMBER_INT);

if(!$id){
	echo "Not a valid id";
	die();
}

require_once("../include/database.php");
$db = new Database();
$sql = "CALL user({$id})";
$db->query($sql);
$user = $db->get();
$reviews = explode(";", $user->reviews);
foreach($reviews as $key => $pair){
	$pair = explode(",", $pair);
	$review = [];
	$review["id"] = $pair[0];
	$review["image"] = $pair[1];
	$reviews[$key] = $review;
}
$user->reviews = $reviews;
echo json_encode($user);
