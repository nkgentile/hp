<?php
//Populate badges
$sql  = "SELECT * ";
$sql .= "FROM experiences";
$this->db->query($sql);
?>

<div id="experiences-wrap" class="anim">
	<h1>Experiences</h1>
	<hr color="white" width="60%" noshade>
	<?php while($experience = $this->db->get()): ?>
	<a class="experience anim hover" data-badge="<?php echo $experience->badge; ?>" href="?experience=<?php echo $experience->id; ?>">
		<h2 class="anim"><?php echo $experience->name; ?></h2>
	</a>
	<?php endwhile; ?>
</div>

<script type="text/javascript" defer>
	window.addEventListener("load", function(){
		var experiences = document.getElementsByClassName("experience");
		var container = document.getElementById("experiences-wrap");
		function Experience(_html){
			this.html = _html;
			this.html.banner = this.html.getElementsByTagName("h2")[0];
			this.html.addEventListener("mouseover", function(){
				this.style.borderRadius = "100%";
				this.style.borderColor = "rgba(255,255,255,1)";
				this.style.backgroundColor = "rgba(255,255,255,0.25)";
				this.style.marginTop = "-1%";
				//this.style.boxShadow = "0em 2em 1em 0.5em rgba(255,255,255,0.15)";
				this.banner.style.bottom = "-100%";
			});
			this.html.addEventListener("mouseout", function(){
				this.style.borderRadius = null;
				this.style.borderColor = null;
				this.style.borderWidth = null;
				this.style.backgroundColor = null;
				this.style.marginTop = null;
				this.style.boxShadow = null;
				this.banner.style.bottom = null;
			}); 
			this.badge = this.html.getAttribute("data-badge");
			this.html.style.backgroundImage =
				"url(assets/svg/" +
				this.badge +
				")";
				
		}
		for(var i=0; i<experiences.length; i++)
			experiences[i] = new Experience(experiences[i]);	
	});
</script>
