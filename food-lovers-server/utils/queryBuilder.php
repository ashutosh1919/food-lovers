<?php

global $users, $dishes;
$users = 'users';
$dishes = 'dishes';

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
    if(array_key_exists('profile', $document)){
        $query .= " PROFILE_URL='" . $document["profile"] . "', ";
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

function postDishQuery($document){
    global $dishes;
    $query = "INSERT INTO $dishes (DISH_NAME, CUISINE_TYPE, DISH_IMG_URL, DISH_INGREDIENTS, DISH_DIRECTIONS, DISH_VIDEO_URL, OWNER_ID, PREP_TIME) " .
        "VALUES ('" . $document['dish_name'] ."', '" . $document['cuisine_type'] . "', '" . $document['dish_image'] . "', " .
        "'" . $document['dish_ingredients'] . "', '" . $document['dish_directions'] . "', '" . $document['dish_video'] . "', " .
        "'" . $document['owner_id'] . "', '" . $document['dish_prepTime'] . "');";
    return $query;
}

function getUserDishesQuery($id){
    global $dishes;
    $query = "SELECT * FROM $dishes WHERE OWNER_ID=$id";
    return $query;
}

?>