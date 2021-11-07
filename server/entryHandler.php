<?php
include 'queryBuilder.php';
include 'db.php';

function handleSignup(Array $document){
    $name = $document['name'];
    $email = $document['email'];
    $password = $document['password'];
    $query = createUserQuery($name, $email, $password);
    $code = executeQuery($query);
    if($code === TRUE){
        $code = 200;
    }
    else{
        $code = 500;
    }
    $response = Array('status' => $code, 'email' => $email);
    return $response;
}

function handleLogin(Array $document){
    $email = $document['email'];
    $password = $document['password'];
    $query = createLoginQuery($email, $password);
    $result = executeQuery($query);
    if($result->num_rows == 0){
        return Array('error' => 'Login Failed. Account does not exist with these credentials.');
    }
    $row = $result->fetch_assoc();
    $response = Array('email' => $row['EMAIL'], 'name' => $row['NAME'], 'profile' => $row['PROFILE']);
    return $response;
}

?>