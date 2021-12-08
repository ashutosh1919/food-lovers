<?php

global $users, $dishes, $comments, $likes;
$users = 'users';
$dishes = 'dishes';
$comments = 'comments';
$likes = 'likes';

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

function updateDishQuery($document){
    global $dishes;
    $query = "UPDATE $dishes SET";
    if(array_key_exists('dish_name', $document)){
        $query .= " DISH_NAME='". $document['dish_name'] ."', ";
    }
    if(array_key_exists('cuisine_type', $document)){
        $query .= " CUISINE_TYPE='". $document['cuisine_type'] ."', ";
    }
    if(array_key_exists('dish_image', $document)){
        $query .= " DISH_IMG_URL='". $document['dish_image'] ."', ";
    }
    if(array_key_exists('dish_ingredients', $document)){
        $query .= " DISH_INGREDIENTS='". $document['dish_ingredients'] ."', ";
    }
    if(array_key_exists('dish_directions', $document)){
        $query .= " DISH_DIRECTIONS='". $document['dish_directions'] ."', ";
    }
    if(array_key_exists('dish_video', $document)){
        $query .= " DISH_VIDEO_URL='". $document['dish_video'] ."', ";
    }
    if(array_key_exists('dish_prepTime', $document)){
        $query .= " PREP_TIME='". $document['dish_prepTime'] ."', ";
    }
    $query = trim($query, ", ");
    $query .= " WHERE DISH_ID=". $document["dish_id"] ." AND OWNER_ID=". $document['owner_id'] .";";
    return $query;
}

function getUserDishesQuery($id){
    global $dishes;
    $query = "SELECT * FROM $dishes WHERE OWNER_ID=$id ORDER BY DISH_POSTED_AT DESC;";
    return $query;
}

function getRecentDishesQuery(){
    global $dishes;
    $query = "SELECT * FROM $dishes ORDER BY DISH_POSTED_AT DESC;";
    return $query;
}

function getDishFromIdQuery($dish_id){
    global $dishes;
    $query = "SELECT * FROM $dishes WHERE DISH_ID=$dish_id;";
    return $query;
}

function getPatternSearchDishQuery($pattern){
    global $dishes;
    $query = "SELECT * FROM $dishes WHERE DISH_NAME like '". $pattern ."' ORDER BY DISH_POSTED_AT DESC;";
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

function getLikeDishQuery($owner_id, $dish_id){
    global $likes;
    $query = "INSERT INTO $likes (DISH_ID, OWNER_ID) VALUES ($dish_id, $owner_id);";
    return $query;
}

function getUnlikeDishQuery($owner_id, $dish_id){
    global $likes;
    $query = "DELETE FROM $likes WHERE OWNER_ID = $owner_id AND DISH_ID = $dish_id;";
    return $query;
}

function getNumLikeDishQuery($dish_id){
    global $likes;
    $query = "SELECT COUNT(*) AS LIKES FROM $likes WHERE DISH_ID = $dish_id;";
    return $query;
}

function getNumLikeDishUserQuery($owner_id, $dish_id){
    global $likes;
    $query = "SELECT COUNT(*) AS LIKES FROM $likes WHERE DISH_ID = $dish_id AND OWNER_ID = $owner_id;";
    return $query;
}

function getTotalUserLikesQuery($user_id){
    global $likes, $dishes;
    $query = "SELECT COUNT(*) AS LIKES FROM $likes WHERE DISH_ID in (SELECT D.DISH_ID FROM $dishes as D WHERE D.OWNER_ID=$user_id);";
    return $query;
}

?>