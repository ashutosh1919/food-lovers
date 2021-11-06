<?php
include 'queryBuilder.php';
include 'db.php';

function handleSignup(Array $document){
    $name = $document['name'];
    $email = $document['email'];
    $password = $document['password'];
    $query = createUserQuery($name, $email, $password);
    $code = executeQuery($query);
    $response = Array('status' => $code);
    return $response;
}

?>