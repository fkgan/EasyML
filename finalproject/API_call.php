<?php
session_start();

if (isset($_REQUEST["action"])){
    //Define variables
    $url = "http://110.159.177.152:5000/";                  // API Url
    $API_key = 'AMQI6w9oOb-bqH-9OVTIqurJ';                  // Website API Key for POST request
    $optional_headers = NULL;                               // required header
    $dir = "";                                              // directory to desired API url
    $php_errormsg = "";                                     // to store the error message

    if (!isset($obj))
        $obj = new stdClass();

    if ($_REQUEST["action"] == "ask" || $_REQUEST["action"] == "teach"){
        $dir = "api/predict";    // API to ask for prediction
        // change the content-type header to json file
        $optional_headers = "Content-Type: application/json";

        // Data to send
        $obj->API_key = $API_key;
        $obj->username =  $_SESSION['username'];
        $obj->userpw = $_SESSION['password'];
        $obj->action = $_REQUEST["action"];
        $obj->datatype = $_REQUEST["datatype"];
        $obj->data = json_decode($_REQUEST["data"]);
        $obj->tags = json_decode($_REQUEST["tags"]);

        // When it is teaching only
        if ($_REQUEST["action"] == "teach"){
            $dir = "api/train";         // API to teach/train the model
            $obj->sentiment = $_REQUEST["sent"];
        }

        // encode the js object into json string
        $JSON_data = json_encode($obj);

        // create a stream
        $params = array('http' => array(
            'method' => 'POST',
            'content' => $JSON_data
        ));
    }
    // If requested action is hint
    if ($_REQUEST["action"] == "hint"){
        // include database connection
        include('config/db_connect.php');

        // To get the user's model ID from DB
        $userID = $_SESSION['userID'];
        $query = "SELECT userOwnModelID FROM user_model WHERE userID=$userID";
        $result = mysqli_query($db, $query);      //query the result from database
        $user = mysqli_fetch_assoc($result);       //to access the result

        $obj->mid = $user['userOwnModelID'];
        $obj->tags = $_REQUEST["tags"];

        // create a stream
        $params = array('http' => array(
            'method' => 'GET'       // Get request
        ));

        // build the get query
        $dir = "api/suggestedTags?" . http_build_query($obj);
    }

    if ($optional_headers !== null) {
        $params['http']['header'] = $optional_headers;
    }

    $context = stream_context_create($params);

    // Read the content of the url using the HTTP headers set above as string
    $file = file_get_contents($url.$dir, false, $context);

    if (!$file) {
        throw new Exception("Problem with $url, $php_errormsg");
    }

    echo $file;     // return the output (if works correctly, it should be json string)
}

?>