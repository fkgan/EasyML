<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
include('config/db_connect.php');

$userID = $_SESSION['userID'];

// Get the user's model ID
$query = "SELECT userOwnModelID FROM user_model WHERE userID=$userID";
$result = mysqli_query($db, $query);       //query the result from database
$user = mysqli_fetch_assoc($result);       //to access the result
$modelID = $user['userOwnModelID'];

$query = "SELECT count(DISTINCT (sentiment)) AS 'scount' FROM training_data WHERE userOwnModelID = $modelID AND sentiment IN('positive', 'negative', 'neutral')";
$result = mysqli_query($db, $query);       //query the result from database

if ($result != false){
    $obj = mysqli_fetch_assoc($result);       //to access the result

    if ($obj['scount'] < 3){
        echo "<script type='text/javascript'>
        alert('You must teach at least 1 knowledge to all 3 type of sentiments before you can ask!');
        window.location.href='index.php';
        </script>";
    }
}
else{
    echo "<script type='text/javascript'>
        alert('You must teach at least 1 knowledge to all 3 type of sentiments before you can ask!');
        window.location.href='index.php';
        </script>";
}



?>