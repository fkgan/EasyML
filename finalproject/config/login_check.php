<?php
session_start();

// Make sure user is logged in
if(!isset($_SESSION['userID'])){
  header("Location: login.php");
}

if(isset($_GET["logout"])){
  $_SESSION = array();
  session_destroy();
  echo "<script type='text/javascript'>
    alert('Sucessfully log out!');
    window.location.href='login.php';
    </script>";
}
?>