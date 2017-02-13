<?php
	if ($_SERVER['REQUEST_METHOD'] == 'POST'){
		copy('../files/auth.txt', '../files/auth_copy.txt');
    $content = file_get_contents('../files/auth_copy.txt');
    echo $content;
	}
?>
