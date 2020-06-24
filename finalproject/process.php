<?php
session_start();

if (isset($_REQUEST["action"])){
    if (!isset($obj)) 
        $obj = new stdClass();
        $obj->userID = $_SESSION['userID'];
        $obj->action = $_REQUEST["action"];
        $obj->datatype = $_REQUEST["datatype"];
        $obj->data = json_decode($_REQUEST["data"]);
        $obj->tags = json_decode($_REQUEST["tags"]);

    if ($_REQUEST["action"] == "teach"){
        $obj->sentiment = $_REQUEST["sent"];
    }

    $JSON_obj = json_encode($obj);
    echo $JSON_obj;
}
else{
    header("Location: login.php");
}
?>