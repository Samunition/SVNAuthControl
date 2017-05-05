<?php
  if ($_SERVER['REQUEST_METHOD'] == 'GET'){
    $dir = "../files/";

    $files = scandir($dir);
    echo json_encode($files);
  }
 ?>
