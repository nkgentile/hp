<?php
	$review_id = $_GET["review"];
	$sql = "SELECT ".
			"reviews.*,".
			"experiences.badge,".
			"users.* ".
		"FROM reviews ".
		"INNER JOIN users ".
			"ON reviews.reviewer_id=users.id ".
		"INNER JOIN experiences ".
			"ON reviews.experiences=experiences.id ".
		"WHERE reviews.id={$review_id} ".
		"LIMIT 1";
	$this->db->query($sql);
	$r = $this->db->get();
?>

<div id="review-wrap">
	<div id="header">
		<h1><?php echo $r->name; ?></h1>
		<h2>
			<?php echo $r->city; ?>, 
			<?php echo $r->country; ?>
		</h2>
		<hr color="white" width="60%" noshade>
	</div>
	<div id="gallery"
	style="background-image:url(assets/img/<?php echo $r->img; ?>)">
	</div>
	<div id="experiences"
		style="background-image:url(assets/svg/<?php echo $r->badge; ?>)"
	>
	</div>
	<p id="review">
	"<?php echo $r->text; ?>"
	</p>
	<div id="user">
		<div class="portrait"
			style="background-image:url(assets/img/<?php echo $r->portrait; ?>)"
		>
		</div>
		<h2><?php echo $r->reviewer; ?></h2>
		<h3><?php echo $r->profession; ?> &middot; <?php echo $r->location; ?></h3>
	</div>
</div>
