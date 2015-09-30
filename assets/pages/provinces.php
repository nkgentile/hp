<?php
	$db = new Database();
	if( !$countryID = filter_input(INPUT_GET, "country", FILTER_SANITIZE_NUMBER_INT)):
		echo "Not a valid country id";	
	else:
		$sql = "SELECT * ";
		$sql .= "FROM provinces ";
		$sql .= "WHERE country_id={$countryID}";
		$db->query($sql);
		while($p = $db->get()):
			echo $p->name."\n";
		endwhile;
	endif;	
?>

