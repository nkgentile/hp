<?php


function db(){
	$dbh = new PDO("sqlite:../include/model.db");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

$db = db();
$sql = <<<SQL
	select
		id, name, "assets/images/large/" || image as image,
        (select name from cities where id = hotel.city_id) as city,
        (select name from countries where id = hotel.country_id) as country,
        "hotel" as type
        from hotels as hotel
	order by random()
        limit 5 
	;
SQL;
$query = $db->prepare($sql);
$query->execute();
$hotels = $query->fetchAll(PDO::FETCH_ASSOC);
shuffle($hotels);
$query->closeCursor();

echo json_encode($hotels, JSON_PRETTY_PRINT);
