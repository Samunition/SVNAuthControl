<?php
    $sections_array = parse_ini_file('../files/auth.txt', true);
    $json_data = json_encode($sections_array);
    echo $json_data;
 ?>
