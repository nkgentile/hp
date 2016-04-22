<?php
	require_once("../include/database.php");
	$db = new Database();
	$sql = "SELECT * ";
	$sql .= "FROM reviews ";
	$sql .= "WHERE published=0";
	$db->query($sql);
?>
<html>
<head>
<title>Admin</title>
<style>
@import "admin.css";
</style>
</head>
<body>
<header>
	<h1>Unpublished Reviews</h1>
</header>

<ul class="table">
	<?php while($review = $db->get()): ?>
	<a href="review.php?id=<?php echo $review->id ?>">
	<li class="row">
		<div id="reviewer" class="col">
			<?php echo $review->reviewer; ?>
		</div>
		<div id="name" class="col">
			<?php echo $review->name; ?>
		</div>
		<div id="location" class="col">
			<?php echo $review->city; ?>, 
			<?php echo $review->country; ?>
		</div>
	</li>
	</a>
	<?php endwhile; ?>
</ul>

</body>
</html>