<?php
	include_once 'simplediff.php';
	if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    $file1 = file_get_contents($_POST['file1']);
    $file2= file_get_contents($_POST['file2']);

		$old = explode("\n", $file1);
		$new = explode("\n", $file2);
		$diffs = json_encode(diff($old, $new));
		echo $diffs;
		#echo json_encode(diff($old, $new));
  }
?>
