<?php
  if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    $groups = json_decode(stripslashes($_POST['groups']));
    $repos = json_decode(stripslashes($_POST['repos']));
    $groupNames = array();

    $file = fopen('../files/new_auth.txt', 'w');
    fwrite($file, "[groups]");
    fwrite($file, "\n");
    for ($i = 0; $i < count($groups); ++$i) {
      $group = $groups[$i];
      if (count($group[1]) != 0) {
        array_push($groupNames, $group[0]);
        fwrite($file, $group[0]);
        fwrite($file, " = ");

        for ($j = 0; $j < count($group[1]); ++$j) {
          fwrite($file, $group[1][$j]);
          if($j != (count($group[1]) - 1)) {
            fwrite($file, ",");
          }
        }
        fwrite($file, "\n");
      }

    }

    // repos [i][0] = repo name
  	// repos [i][1] = 2D array of rules
  	// repos [i][1][0] = first rule e.g. "user10", "rw"
    fwrite($file, "\n");

    for($i = 0; $i < count($repos); ++$i) {
      fwrite($file, "[");
      fwrite($file, $repos[$i][0]);
      fwrite($file, "]");
      fwrite($file, "\n");
      for($j = 0; $j < count($repos[$i][1]); ++$j) {
        if(in_array((String)$repos[$i][1][$j][0], $groupNames)) {
          fwrite($file, "@");
        }
        fwrite($file, $repos[$i][1][$j][0]);
        fwrite($file, " = ");
        fwrite($file, $repos[$i][1][$j][1]);
        fwrite($file, "\n");
      }
      fwrite($file, "\n");
    }

    fclose($file);

    copy('../files/auth.txt', '../files/auth'.date('m-d-Y_hia').'.prev');
    copy('../files/new_auth.txt', '../files/auth.txt');

    if (!unlink('../files/new_auth.txt')) {
      echo json_encode(false);
    }
    else {
      echo json_encode(true);
    }

  }
 ?>
