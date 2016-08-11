<?php


function db(){
	$dbh = new PDO("sqlite:../include/model.db");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

$db = db();
$sql = <<<SQL
	select
		id, name,
        (select name from cities where id = hotel.city_id) as city,
        (select name from countries where id = hotel.country_id) as country,
        (select filename from images where id = (select image_id from hotel_images where hotel_id = hotel.id)) as image,
        "hotel" as type
        from hotels as hotel
        order by most_recent DESC
        limit 10
	;
SQL;
$query = $db->prepare($sql);
$query->execute();
$hotels = $query->fetchAll(PDO::FETCH_ASSOC);
$query->closeCursor();

echo json_encode($hotels, JSON_PRETTY_PRINT);
