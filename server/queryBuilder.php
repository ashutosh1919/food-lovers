<?php
$users = 'users';

function createUserQuery($name, $email, $password){
    global $users;
    $query = "INSERT INTO $users (NAME, EMAIL, PASSWORD) VALUES ('$name', '$email', '$password');";
    return $query;
}

function createLoginQuery($email, $password){
    global $users;
    $query = "SELECT * FROM $users where EMAIL='$email' AND PASSWORD='$password';";
    return $query;
}

?>