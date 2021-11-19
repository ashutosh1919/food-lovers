<?php
  $db_host = 'localhost';
  $db_user = 'root';
  $db_password = 'root';
  $db_db = 'food_lovers';

  $bucketUrl = '../bucket/images/';
 
  $mysqli = @new mysqli(
    $db_host,
    $db_user,
    $db_password,
    $db_db
  );
	
  if ($mysqli->connect_error) {
    echo 'Errno: '.$mysqli->connect_errno;
    echo '<br>';
    echo 'Error: '.$mysqli->connect_error;
    exit();
  }

  mysqli_set_charset($mysqli, "utf8");

  function executeQuery($query){
      global $mysqli;
      $result = $mysqli->query($query);
      return $result;
  }

?>
