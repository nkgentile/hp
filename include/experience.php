<div id="experience-wrap">
	<div id="badge" style="background-image:url(assets/svg/<?php echo $this->content->badge;?>)"></div>
	<h1>
		<?php echo $this->content->name; ?>
	</h1>
	<hr color="white" width="60%" noshade>
	<?php
		$sql  = "SELECT * ";
		$sql .= "FROM reviews ";
		$sql .= "WHERE experiences ";
		$sql .= "LIKE \"{$this->content->id}\"";
		$this->db->query($sql);
	?>
	<? while($h = $this->db->get()): ?>
	<a 	class="experience-result anim hover"
		data-background-image="<?php echo $h->img; ?>"
		href="?review=<?php echo $h->id; ?>"
	>
		<div class="overlay anim">
			<h2><? echo $h->name ?></h2>
		</div>
	</a>
	<? endwhile; ?>
</div>

<script type="text/javascript" defer>
	"use strict";
	var experiences = document.getElementsByClassName("experience-result");
	var i, len = experiences.length;
	window.addEventListener("load", function(){
		function Experience(_html){
			this.html = _html;
			this.html.overlay = this.html.getElementsByClassName("overlay")[0];
			this.backgroundImage = this.html.getAttribute("data-background-image");
			this.html.style.backgroundImage = 
				"url(assets/img/" +
				this.backgroundImage +
				")";
			this.html.addEventListener("mouseover", function(){
				len = experiences.length;
				for(i=0; i<len; i++)
					experiences[i].overlay.style.backgroundColor = "rgba(0,0,0,0.75)";
				this.overlay.style.backgroundColor = "rgba(0,0,0,0)";
			});
			this.html.addEventListener("mouseout", function(){
				len = experiences.length;
				for(i=0; i<len; i++)
					experiences[i].overlay.style.backgroundColor = null;
			});
		}
		for(i=0; i<len; i++){
			experiences[i] = new Experience(experiences[i]);
		}
	});
</script>
