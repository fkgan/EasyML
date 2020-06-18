<?php
session_start();

if (!isset($obj)) 
    $obj = new stdClass();

$obj->tags = $_REQUEST["tags"];
$obj->files = $_REQUEST["files"];

$JSON_obj = json_encode($obj);

echo $JSON_obj;
?>