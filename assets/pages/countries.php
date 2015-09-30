<?php
	$sql = "SELECT * ";
	$sql .= "FROM destinations ";
	$sql .= "WHERE id={$id} ";
	$sql .= "LIMIT 1";
	$this->db->query($sql);
	$destination = $this->db->get();

	$sql = "SELECT * ";
	$sql .= "FROM reviews ";
	$sql .= "WHERE destination_id={$id}";
	$this->db->query($sql);
?>
<div id="country-wrap">
<div id="badge" style="background-image: url(assets/svg/<?php echo $destination->badge; ?>)"></div>
<h1><?php echo $destination->name; ?></h1>
<hr color="white" width="60%" noshade>
<?php while($p=$this->db->get()): ?>
<a class="country anim"
	href="?review=<?php echo $p->id; ?>"
	data-background-image="<?php echo $p->img; ?>">
	<div class="overlay anim">
		<h2><?php echo $p->name."\n"; ?></h2>
	</div>
</a>
<?php endwhile; ?>
</div>

<script type="text/javascript" defer>
	"use strict";
	var reviews = document.getElementsByClassName("country");
	window.addEventListener("load", function(){
		for(var i=0; i<reviews.length; i++){
			reviews[i].init = function(){
				this.overlay = this.getElementsByClassName("overlay")[0];
				this.style.backgroundImage =
					"url(assets/img/" + 
					this.getAttribute("data-background-image") +
					")";
				this.addEventListener("mouseover", function(){
					this.overlay.style.backgroundColor = "rgba(0,0,0,0)";
				});
				this.addEventListener("mouseout", function(){
					this.overlay.style.backgroundColor = null;
				});
			}
			reviews[i].init();
		}
	});
</script>
