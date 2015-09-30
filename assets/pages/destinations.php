<?php
	$sql = "SELECT * ";
	$sql .= "FROM destinations ";
	$sql .= "ORDER BY name";
	$this->db->query($sql);
?>

<div id="destinations-wrap" class="gradient">
	<h1>Destinations</h1>
	<hr color="white" width="60%" noshade>
	<?php while($d = $this->db->get() ): ?>
	<a
		class="destination anim hover"
		href="?page=<?php echo "{$this->id}&countries={$d->id}"; ?>"
		data-background-image="<?php echo $d->image; ?>"
		data-badge="<?php echo $d->badge; ?>"
	>	
		<h2 class="name anim"><?php echo $d->name; ?></h2>
	</a>
	<?php endwhile; ?>
</div>

<script type="text/javascript" defer>
	function changeSiblings(element, fxn){
		if(element.nextSibling != null && element.nextSibling != element){
			fxn();
			changeSiblings(element.nextSibling, fxn);
		}
		if(element.previousSibling != null && element.previousSibling != element){
			fxn();
			changeSiblings(element.previousSibling, fxn);
		}
	}

	var destinations = document.getElementsByClassName("destination"),
		i, len = destinations.length;
	window.addEventListener("load", function(){
	for(i=0; i<len; i++){
		destinations[i].init = function(){
			var destination = this;	
			this.badge = 
				"url(assets/svg/" +
				this.getAttribute("data-badge") +
				")";
			this.image = 
				"url(assets/img/" +
				this.getAttribute("data-background-image") +
				")";
			this.style.backgroundImage = this.badge + ", " + this.image;
			this.container = document.getElementById("destinations-wrap");
			this.banner = this.getElementsByClassName("name")[0];
			this.mouseover = function(){
				this.style.borderColor = "rgba(255,255,255,1)";
				/*
				if(!this.h){
					this.h = parseInt(
						window.getComputedStyle(this,null).height
					);
					this.h*=1.2;
					this.style.height = this.h;
				}
				*/
				if(!this.w){
					this.h = parseInt(
						window.getComputedStyle(this,null).height
					);
					this.h += (this.h * 1);
					this.style.backgroundPosition = "0 " + this.h + ", center";
				}
				/*
				if(!this.style.margin)
					this.style.margin = String(this.h * -0.5) + " 0";
				*/
				this.banner.style.top = "10%";
				this.banner.style.backgroundColor = "rgba(255,255,255,0)";
				this.style.zIndex = 1;
				this.style.borderRadius = 0;
				this.style.marginTop = "-1em";
			}
			this.addEventListener("mouseover", this.mouseover);

			this.mouseout = function(){
				this.style.borderRadius = null;
				this.style.zIndex = null;
				this.style.width = null;
				this.style.height = null;
				this.style.borderColor = null;
				this.style.backgroundPosition = null;
				this.style.backgroundColor = null;
				this.style.margin = null;
				this.banner.style.top = null;
				this.w = this.h = null;
				this.banner.style.backgroundColor = null;
			}
			this.addEventListener("mouseout", this.mouseout);
		}
		destinations[i].init();
	}
	});
</script>
