<body>
	<div id="page-wrap">
		<div id="page">
			<?php include("include/header.php"); ?>
			<div id="content" data-pageName="<?php echo $this->content->name; ?>">
				<?php 
				if($this->table == "page")
					include("assets/pages/{$this->content->filename}");
				else
					include("include/{$this->table}.php");
				?>
			</div>
			<?php include("include/footer.php"); ?>
		</div>
	</div>
</body>
</html>
