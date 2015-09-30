<?php
/*
 *
 *	Define global helper functions
 *
 *
 */

function getStylesheets(){
	// Open folder, and link each stylesheet
	echo "<style>";
	$path = "assets/css";
	if (is_dir($path))
  		if ($styles = opendir($path)){
    		while (($ss = readdir($styles)) !== false)
    			if(($ss !== '.') && ($ss !== '..')){
    				$css  = "@import \"{$path}/{$ss}\";";
    				echo $css, "\n";
    			}
    		closedir($styles);
    	}
    echo "</style>";
}
/*
function getJS(){
	$path = "assets/js";
	if(is_dir($path))
		if($scripts = opendir($path)){
			while(($js = readdir($scripts)) !== false)
				if(($js !== ".") && ($js !== ".."))
					echo "<script ",
						 "src=\"{$path}/{$js}\" defer>",
						 "</script>";
			closedir($scripts);
		}
}
*/
?>
