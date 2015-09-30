<?php
	$sql = "SELECT * ";
	$sql .= "FROM reviews ";
	$sql .= "ORDER BY city ";
	$sql .= "LIMIT 5";
	$this->db->query($sql);
?>
<?php while($r = $this->db->get() ): ?>
<div class="review anim" style="background-image: url(assets/img/<?php echo $r->img; ?>);">
	<div class="desc-wrap anim">
		<div class="desc">
			<p class="name"><?php echo $r->name; ?></p>
			<p class="info">
				<a class="location"><?php echo $r->city; ?>, <?php echo $r->country; ?></a>
				<span>&middot;</span>
				<a class="reviewer"><?php echo $r->reviewer; ?></a>
			</p>
			<p class="blurb anim">
				<?php echo substr($r->text, 0, 1024)."..."; ?>
			</p>
		</div>
	</div>
	<p class="click-thru">
		<a href="?review=<?php echo $r->id; ?>">
			Continue<span>&Rarr;</span>
		</a>
	</p>
</div>
<?php endwhile; ?>
<div id="nav-wrapper" class="anim">
<span id="left" class="arrow anim">&Larr;</span>
<div id="nav">
</div>
<span id="right" class="arrow anim">&Rarr;</span>
</div>

<script type="text/javascript" defer>
	var reviews = document.getElementsByClassName("review"),
		i, len = reviews.length;
	
	for(i=0; i<len; i++){
		reviews[i].init = function(){
			var review = this;
			this.index = i;
			this.blurb = this.getElementsByClassName("blurb")[0];
			this.overlay = this.getElementsByClassName("desc-wrap")[0];
			this.blurb.styles = window.getComputedStyle(this.blurb, null);
			this.navWrap = document.getElementById("nav-wrapper");
			this.nav = document.getElementById("nav");
			this.navWrap.nav = this.nav;
			this.navWrap.addEventListener("mouseover", function(){
				this.style.opacity = 1;
			});
			this.navWrap.addEventListener("mouseout", function(){
				this.style.opacity = null; 
			});
			this.addEventListener("mouseover", function(){
				this.navWrap.dispatchEvent(new Event("mouseover"));
				this.navWrap.style.opacity = 0.75;
			});
			this.addEventListener("mouseout", function(){
				this.navWrap.dispatchEvent(new Event("mouseout"));
			});

			this.overlay.hide = function(){
				review.blurb.style.opacity = "0";
				this.style.backgroundColor = "";
				this.style.bottom = "-" + review.blurb.styles.height;
			}
			this.overlay.hide();

			this.overlay.show = function(){
				this.style.bottom = "";
				this.style.backgroundColor = "rgba(0,0,0,.8)";
				review.blurb.style.opacity = "1";
				review.navWrap.dispatchEvent(new Event("mouseout"));
			}
			
			this.overlay.addEventListener("mouseover", this.overlay.show);
			this.overlay.addEventListener("mouseout", this.overlay.hide);
			
			this.appendToNav = function(){
				this.navNode = document.createElement("span");
				this.navNode.className = "anim";
				this.navNode.innerHTML = "&middot;";
				this.navNode.review = this;
				this.navNode.navTo = function(e){
					var nav = e.target.parentNode,
						i, len = nav.childNodes.length;
					for(i=0; i<len; i++)
						nav.childNodes[i].className = "";
					reviews[0].style.marginLeft = "-" + this.review.index + "00%";
					this.className = "active";
					this.review.nav.currentIndex = this.review.index;
				}
				this.navNode.addEventListener("click", this.navNode.navTo);
				this.navNode.addEventListener("mouseover", function(){
					this.style.opacity = 1;
				});
				this.navNode.addEventListener("mouseout", function(){
					this.style.opacity = null;
				});
				this.nav.appendChild(this.navNode);
			}
			this.appendToNav();
		}
		reviews[i].init();
	}
</script>
