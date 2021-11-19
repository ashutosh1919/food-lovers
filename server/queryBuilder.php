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

function createUpdateEmailQuery($oldEmail, $newEmail){
    global $users;
    $query = "UPDATE $users SET EMAIL='$newEmail' WHERE EMAIL='$oldEmail';";
    return $query;
}

function createFindIdFromEmailQuery($email){
    global $users;
    $query = "SELECT * FROM $users where EMAIL='$email';";
    return $query;
}

function createUserUpdateQuery($id, $document){
    global $users;
    $query = "UPDATE $users SET";
    if(array_key_exists('name', $document)){
        $query .= " NAME='" . $document["name"] . "', ";
    }
    if(array_key_exists('profile_url', $document)){
        $query .= " PROFILE_URL='" . $document["profile_url"] . "', ";
    }
    if(array_key_exists('location', $document)){
        $query .= " LOCATION='" . $document["location"] . "', ";
    }
    if(array_key_exists('gender', $document)){
        $query .= " GENDER='" . $document["gender"] . "', ";
    }
    if(array_key_exists('caption', $document)){
        $query .= " CAPTION='" . $document["caption"] . "', ";
    }
    $query = trim($query, ", ");
    $query .= " WHERE ID=$id;";
    return $query;
}

?>