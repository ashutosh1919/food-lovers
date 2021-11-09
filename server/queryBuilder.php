<?php
$users = 'users';

function createUserQuery($name, $email, $password, $createdAt){
    global $users;
    $query = "INSERT INTO $users (NAME, EMAIL, PASSWORD, CREATED_AT) VALUES ('$name', '$email', '$password', '$createdAt');";
    return $query;
}

function createLoginQuery($email, $password){
    global $users;
    $query = "SELECT * FROM $users where EMAIL='$email' AND PASSWORD='$password';";
    return $query;
}

?>