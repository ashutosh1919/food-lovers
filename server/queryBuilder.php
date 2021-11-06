<?php
$users = 'users';

function createUserQuery($name, $email, $password){
    global $users;
    $query = "INSERT INTO $users (NAME, EMAIL, PASSWORD) VALUES ('$name', '$email', '$password');";
    return $query;
}

?>