<?php

global $users, $dishes, $comments;
$users = 'users';
$dishes = 'dishes';
$comments = 'comments';

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

function getUserQuery($email){
    global $users;
    $query = "SELECT * FROM $users WHERE EMAIL='$email';";
    return $query;
}

function getUserFromIdQuery($id){
    global $users;
    $query = "SELECT * FROM $users WHERE ID=$id;";
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
    $query = "SELECT * FROM $dishes WHERE OWNER_ID=$id ORDER BY DISH_POSTED_AT DESC;";
    return $query;
}

function getRecentDishesQuery(){
    global $dishes;
    $query = "SELECT * FROM $dishes ORDER BY DISH_POSTED_AT DESC LIMIT 8;";
    return $query;
}

function postDishCommentQuery($text, $user_id, $dish_id){
    global $comments;
    $query = "INSERT INTO $comments (OWNER_ID, DISH_ID, COMMENT_TEXT) VALUES ($user_id, $dish_id, '". $text ."');";
    return $query;
}

function getDishCommentsQuery($dish_id){
    global $comments;
    $query = "SELECT * FROM $comments WHERE DISH_ID = $dish_id ORDER BY COMMENT_DATETIME DESC;";
    return $query;
}

?>