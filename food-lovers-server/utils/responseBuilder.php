<?php

@include_once('utils/queryBuilder.php');

function buildUserResponse($email){
    $query = createFindIdFromEmailQuery($email);
    $result = DB::select($query);
    $row = (Array)$result[0];
    $response = Array('email' => $row['EMAIL'], 'name' => $row['NAME'], 'profile' => $row['PROFILE_URL'], 'gender' => $row['GENDER'], 'location' => $row['LOCATION'], 'caption' => $row['CAPTION'], 'created_at' => $row['CREATED_AT']);
    return $response;
}

function getIdFromEmail($email){
    $query = createFindIdFromEmailQuery($email);
    // echo $query;
    $result = DB::select($query);
    // echo $result;
    $row = (Array)$result[0];
    return $row["ID"];
}

?>