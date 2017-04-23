<?php
  if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    $contents = $_POST['content'];

    //$json_data = json_decode($contents);

    // $res = array();
    // foreach($contents as $key => $val)
    // {
    //     if(is_array($val))
    //     {
    //         $res[] = "[$key]";
    //         foreach($val as $skey => $sval) $res[] = "$skey = ".(is_numeric($sval) ? $sval : '"'.$sval.'"');
    //     }
    //     else $res[] = "$key = ".(is_numeric($val) ? $val : '"'.$val.'"');
    // }

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
