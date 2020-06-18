// combining teach process and ask process
<?php
session_start();

if (isset($_REQUEST["operation"])){
    if (!isset($obj)) 
        $obj = new stdClass();

    if ($_REQUEST["operation"] == "ask"){
        $obj->tags = $_REQUEST["tags"];
        $obj->files = $_REQUEST["files"];
    }
    else if ($_REQUEST["operation"] == "teach"){
        $obj->tags = $_REQUEST["tags"];
        $obj->sentiment = $_REQUEST["sent"];
        $obj->files = $_REQUEST["img"];
    }

    $JSON_obj = json_encode($obj);
    echo $JSON_obj;
}


?>