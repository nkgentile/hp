<?php
	require_once("include/database.php");
	require_once("include/functions.php");

	class Page {
		public $db;
		public $content;
		public $table;
		public $id;
		
		function __construct(){
			//connects to db
			$this->db = new Database();
			
			$this->table = array_keys($_GET);
			$this->table = $this->table[0];
			
			try{
				$this->id = filter_input(INPUT_GET, $this->table, FILTER_SANITIZE_STRING);
			}
			catch(Exception $e){
				echo $e->getMessage();
			}
			//check if the content exists in the db
			$sql  = "SELECT * ";
			$sql .= "FROM {$this->table}s ";
			$sql .= "WHERE id={$this->id}";
			$this->db->query($sql);
			try{
				$this->content = $this->db->get();
				$this->display();
			}
			catch(Exception $e){
				echo $e->getMessage();
			}
		}
		
		function __destruct(){
			//closes db connection
			$this->db = null;
		}
		
		function display(){
			include("include/head.php");
			if($this->content == null)
				throw new Exception("Content cannot be found...<br>");
			else
				include("include/body.php");
		}
	}	
?>