<?php
  if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    $contents = $_POST['content'];
    file_put_contents('../files/auth_copy.txt', $contents);
    copy('../files/auth.txt', '../files/auth.prev');
    copy('../files/auth_copy.txt', '../files/auth.txt');

    if (!unlink('../files/auth_copy.txt')) {
      echo ("Could not delete copy!");
    }
    else {
      echo ("Copy deleted!");
    }
  }
 ?>
