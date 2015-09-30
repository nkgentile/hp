<?php
//Populate badges
$sql  = "SELECT * ";
$sql .= "FROM destinations";
$this->db->query($sql);
?>

<div id="destinations-wrap" class="gradient">
	<h1>Destinations</h1>
	<hr color="white" width="60%" noshade>
	<?php while($destination = $this->db->get()): ?>
	<?php $name = $destination->name; ?>
	<div class="destination">
		<a class="anim hover" href="?destination=<?php echo $name; ?>">
			<span><?php echo $name; ?></span>
		</a>
	</div>
	<span class="spacer">&middot;</span>
	<?php endwhile; ?>
</div>