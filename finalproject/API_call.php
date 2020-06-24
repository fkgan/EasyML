<?php
session_start();

if (isset($_REQUEST["action"])){
    //Define variables
    $url = "http://110.159.177.152:5000/";                  // API Url
    $APIkey = 'AMQI6w9oOb-bqH-9OVTIqurJ';                   // Website API Key
    $optional_headers = "Content-Type: application/json";   // required header
    $php_errormsg = "";                                     // to store the error message

    if (!isset($obj))
        $obj = new stdClass();
    $obj->API_key = $APIkey;
    $obj->username =  $_SESSION['username'];
    $obj->userpw = $_SESSION['password'];
    $obj->action = $_REQUEST["action"];
    $obj->datatype = $_REQUEST["datatype"];
    $obj->data = json_decode($_REQUEST["data"]);
    $obj->tags = json_decode($_REQUEST["tags"]);

    if ($_REQUEST["action"] == "teach"){
        $obj->sentiment = $_REQUEST["sent"];
    }

    // encode the js object into json string
    $JSON_data = json_encode($obj);

    // create a stream
    $params = array('http' => array(
        'method' => 'POST',
        'content' => $JSON_data
    ));

    if ($optional_headers !== null) {
        $params['http']['header'] = $optional_headers;
    }

    $ctx = stream_context_create($params);

    // Read the content of the url using the HTTP headers set above as string
    $file = file_get_contents($url, false, $ctx);

    if (!$file) {
        throw new Exception("Problem with $url, $php_errormsg");
    }

    echo $file;     // returning string
}

?>