<div id="destination-banner-wrap">
	<div id="destination-banner">
		<h1><?php echo $this->content->name; ?></h1>
		<hr color="white" width="60%" noshade>
		<?php
			$sql  = "SELECT * ";
			$sql .= "FROM reviews ";
			$sql .= "WHERE destinations ";
			$sql .= "LIKE \"{$this->content->id}\"";
			$this->db->query($sql);
		?>
		<? while($destination = $this->db->get()): ?>
		
		<div class="destination-banner">
		<p><? echo $destination->name ?></p>
		</div>
		
		<? endwhile; ?>
	</div>
</div>
