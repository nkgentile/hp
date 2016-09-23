<?php

function db(){
	$dbh = new PDO("sqlite:../include/model.db");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

$type = filter_input(INPUT_GET, "type", FILTER_SANITIZE_STRING);
$id = filter_input(INPUT_GET, "id", FILTER_SANITIZE_NUMBER_INT);

if(!isset($type) || !isset($id)) die();

function getExperience($id){
}

switch($type){
	case "experience":
		getExperience($id);
		break;
	default:
		 die();
}
