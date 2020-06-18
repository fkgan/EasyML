<?php
session_start();

if (!isset($obj)) 
    $obj = new stdClass();

$obj->tags = $_REQUEST["tags"];
$obj->sentiment = $_REQUEST["sent"];
$obj->files = $_REQUEST["img"];

$JSON_obj = json_encode($obj);

echo $JSON_obj;
?>