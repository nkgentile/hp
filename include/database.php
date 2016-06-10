<?php  

function db(){
	$host = "localhost:3306";
	$usr = "root";
	$pass = "Monkey500@";
	$name = "hotelpoet";
	
	$db = new PDO("mysql:host={$host};dbname={$name};charset=utf8mb4", $usr, $pass);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	return $db;
}

class Database {
  	public $handler;
  	public $result;
  	
  	function __construct(){
  		$this->connect();
  	}
  	
  	function __destruct(){
  		$this->disconnect();
  	}
  	
  	function connect(){
  		$host = "localhost:3306";
  		$usr = "root";
  		$pass = "Monkey500@";
  		$name = "hotelpoet";
  	 
  		try {
    		$this->handler = new PDO("mysql:host={$host};dbname={$name};", $usr, $pass);
    		$this->handler->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    	}
		catch(PDOException $e) {
    		echo $e->getMessage(), "<br>";
    	}
  	}
    
    function disconnect(){
  		$this->handler = null;
    }
    
    function query($sql){
    	try{
    		$this->result = $this->handler->query($sql);
    	}
    	catch(Exception $e){
    		echo $e->getMessage();
    	}
    }
    
    function get(){
    	try {
    		return $this->result->fetch(PDO::FETCH_OBJ);
    	}
    	catch(PDOException $e){
    		echo $e->getMessage(), "<br>";
    	}
    }
  }
?>
