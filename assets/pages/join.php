<div id="join-wrap" class="gradient">
<div id="join">
<h1>Submit</h1>
<hr color="white" noshade>
<form action="include/upload.php" method="POST" enctype="multipart/form-data">
	<!-- HOTEL NAME -->
	<div class="left"><label for="name">Hotel</label></div>
	<div class="right"><input name="name" type="text"></div><br>
	
	<!-- REVIEWER NAME -->
	<div class="left"><label for="reviewer">Name</label></div>
	<div class="right"><input name="reviewer" type="text"></div><br>
	
	<!-- CITY -->
	<div class="left"><label for="city">City</label></div>
	<div class="right"><input name="city" type="text"></div><br>
	
	<!-- STATE -->
	<div class="left"><label for="state">State</label></div>
	<div class="right"><input name="state" type="text"></div><br>
	
	<!-- COUNTRY -->
	<div class="left"><label for="country">Country</label></div>
	<div class="right">
		<select name="country">
		<?php $sql  = "SELECT * "; ?>
		<?php $sql .= "FROM countries"; ?>
		<?php $this->db->query($sql); ?>
		<?php while($country = $this->db->get()): ?>
			<option value="<?php echo $country->name; ?>">
				<?php echo ucfirst($country->name); ?>
			</option>
		<?php endwhile; ?>
		</select>
	</div><br>
	
	<!-- DESTINATION -->
	<div class="left"><label for="destination">Destination</label></div>
	<div class="right">
		<select name="destination">
		<?php $sql  = "SELECT * "; ?>
		<?php $sql .= "FROM destinations"; ?>
		<?php $this->db->query($sql); ?>
		<?php while($destination = $this->db->get()): ?>
			<option value="<?php echo $destination->name; ?>">
				<?php echo ucfirst($destination->name); ?>
			</option>
		<?php endwhile; ?>
		</select>
	</div><br>
	
	<hr color="white" noshade>
	
	<!-- EXPERIENCE -->
	<div class="left"><label>Experiences</label></div>
	<div class="right">
		<?php $sql = "SELECT * FROM experiences"; ?>
		<?php $this->db->query($sql); ?>
		<?php while($experience = $this->db->get()): ?>
		<div>
		<label for="<?php echo $experience->name; ?>"><?php echo ucfirst($experience->name); ?></label>
		<input name="<?php echo $experience->name; ?>" type="checkbox" value="<?php echo $experience->name; ?>">
		</div>
		<?php endwhile; ?>
	</div><br>
	
	<hr color="white" noshade>
	<!-- TEXT CONTENT -->
	<label for="text" class="upload">
		<span>Select a Review</span>
		<input name="text" type="file" accept=".txt" class="file">
	</label><br>
	
	<!-- IMAGE -->
	<label for="img" class="upload">
		<span>Select an Image</span>
		<input name="img" type="file" accept=".jpg"  class="file">
	</label><br>
	<hr color="white" noshade>
	
	<!-- SUBMIT -->
	<input name="submit" type="submit" value="Submit">
</form>
</div>
</div>