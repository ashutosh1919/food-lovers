<?php
include './entryHandler.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if($_SERVER["REQUEST_METHOD"] == 'POST'){
    $_POST = json_decode(file_get_contents("php://input"), true);
    if(!isset($_POST["function"])){
        return json_encode(Array('status' => 500));
    }
    switch($_POST["function"]) {
        case 'create_user':
            $response = json_encode(handleSignup($_POST));
            echo $response;
            break;
    }
}

?>