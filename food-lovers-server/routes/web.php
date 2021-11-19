<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

@include_once('utils/queryBuilder.php');
@include_once('utils/responseBuilder.php');

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return "Hello world";
});

Route::post('/createUser', function(Request $request) {
    $document = json_decode($request->getContent(), true);
    $name = $document['name'];
    $email = $document['email'];
    $password = $document['password'];
    $createdAt = $document['created_at'];
    $query = createUserQuery($name, $email, $password, $createdAt);
    $code = DB::insert($query);
    if($code === TRUE){
        $code = 200;
    }
    else{
        $code = 500;
    }
    $response = Array('status' => $code, 'email' => $email, 'name' => $name, 'created_at' => $createdAt);
    return response()->json($response);
});

Route::post('/login', function(Request $request){
    $document = json_decode($request->getContent(), true);
    // info($document);
    // echo json_encode($document);
    $email = $document['email'];
    $password = $document['password'];
    $query = createLoginQuery($email, $password);
    $result = DB::select($query);
    if(count($result) == 0 || count($result) > 1){
        return json_encode(Array('error' => 'Login Failed. Account does not exist with these credentials.'));
    }
    $row = (Array)$result[0];
    $response = Array('email' => $row['EMAIL'],
        'name' => $row['NAME'],
        'profile' => $row['PROFILE_URL'],
        'gender' => $row['GENDER'],
        'location' => $row['LOCATION'],
        'caption' => $row['CAPTION'],
        'created_at' => $row['CREATED_AT']);
    return response()->json($response);
});

Route::post('/updateUser', function(Request $request){
    $document = json_decode($request->getContent(), true);

    if(array_key_exists('oldEmail', $document)){
        $updateQuery = createUpdateEmailQuery($document['oldEmail'], $document['newEmail']);
        DB::update($updateQuery);
        if(count($document)===2){
            return response()->json(buildUserResponse($document['newEmail']));
        }
    }
    $id = getIdFromEmail($document['newEmail']);
    if(array_key_exists('profile', $document)){
        $profileBucketPath = 'images/' . strval(time()) . strval($id) . ".png";
        $document["profile"] = str_replace('data:image/png;base64,', '', $document["profile"]);
        $document["profile"] = str_replace('data:image/jpeg;base64,', '', $document["profile"]);
        $document["profile"] = str_replace('data:image/jpg;base64,', '', $document["profile"]);
        $profileRaw = base64_decode($document['profile']);
        Storage::disk('local')->put($profileBucketPath, $profileRaw);
        $document["profile"] = asset($profileBucketPath);
    }
    $updateQuery = createUserUpdateQuery($id, $document);
    DB::update($updateQuery);
    return response()->json(buildUserResponse($document['newEmail']));

});

Route::get('/images/{file}', [ function ($file) {
    $path = public_path('storage/images/'.$file);
    if (file_exists($path)) {
        return response()->file($path, array('Content-Type' =>'image/png'));
    }
}]);
