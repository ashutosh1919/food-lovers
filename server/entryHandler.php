<?php
include 'queryBuilder.php';
include 'db.php';

function handleSignup(Array $document){
    $name = $document['name'];
    $email = $document['email'];
    $password = $document['password'];
    $createdAt = $document['created_at'];
    $query = createUserQuery($name, $email, $password, $createdAt);
    // echo $query;
    $code = executeQuery($query);
    if($code === TRUE){
        $code = 200;
    }
    else{
        $code = 500;
    }
    $response = Array('status' => $code, 'email' => $email, 'name' => $name, 'created_at' => $createdAt);
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
    $response = Array('email' => $row['EMAIL'], 'name' => $row['NAME'], 'profile' => $row['PROFILE_URL'], 'gender' => $row['GENDER'], 'location' => $row['LOCATION'], 'caption' => $row['CAPTION'], 'created_at' => $row['CREATED_AT']);
    return $response;
}

function updateUserEmail($oldEmail, $newEmail){
    $query = createUpdateEmailQuery($oldEmail, $newEmail);
    executeQuery($query);
}

function getIdFromEmail($email){
    $query = createFindIdFromEmailQuery($email);
    $result = executeQuery($query);
    $row = $result->fetch_assoc();
    // echo json_encode($row);
    return $row["ID"];
}

function buildUserResponse($email){
    $query = createFindIdFromEmailQuery($email);
    $result = executeQuery($query);
    $row = $result->fetch_assoc();
    $response = Array('email' => $row['EMAIL'], 'name' => $row['NAME'], 'profile' => $row['PROFILE_URL'], 'gender' => $row['GENDER'], 'location' => $row['LOCATION'], 'caption' => $row['CAPTION'], 'created_at' => $row['CREATED_AT']);
    return $response;
}

function handleUpdateUser(Array $document){
    global $bucketUrl;
    if(array_key_exists('oldEmail', $document)){
        updateUserEmail($document['oldEmail'], $document['newEmail']);
        if(count($document)===2){
            return buildUserResponse($document['newEmail']);
        }
    }
    $id = getIdFromEmail($document['newEmail']);
    $profileBucketPath = strval(time()) . strval($id) . ".png";
    $document["profile"] = str_replace('data:image/png;base64,', '', $document["profile"]);
    $document["profile"] = str_replace('data:image/jpeg;base64,', '', $document["profile"]);
    $document["profile"] = str_replace('data:image/jpg;base64,', '', $document["profile"]);
    $profileRaw = array_key_exists('profile', $document) ? base64_decode($document['profile']) : null;
    if($profileRaw!=null){
        file_put_contents($bucketUrl . $profileBucketPath, $profileRaw);
    }
    $profileUri = ($profileRaw != null) ? realpath($bucketUrl . $profileBucketPath) : null;
    if($profileUri!=null){
        $document["profile_url"] = $profileUri;
    }
    $updateQuery = createUserUpdateQuery($id, $document);
    executeQuery($updateQuery);
    // echo $updateQuery;
    // echo json_encode(buildUserResponse($document['newEmail']));
    return buildUserResponse($document['newEmail']);
}

?>