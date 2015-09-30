<?php
	$sql = "SELECT * ";
	$sql .= "FROM reviews ";
	$sql .= "WHERE id=1 ";
	$sql .= "LIMIT 1";
	$this->db->query($sql);
	$r = $this->db->get();
?>

<div id="review-wrap">
	<div id="review">
		<h1><?php echo $r->name; ?></h1>
		<h2>
			<?php echo $r->reviewer; ?>
			<span>&middot;</span>
			<?php echo $r->city; ?>, 
			<?php echo $r->country; ?>
		</h2>
		<hr color="white" width="60%" noshade>
		<p><?php echo $r->text; ?></p>
	</div>
</div>
