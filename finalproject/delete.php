<?php
include('config/login_check.php');  // Make sure user is logged in
include('config/db_connect.php');   // include database connection

try {
    $id = mysqli_real_escape_string($db, isset($_GET['id']) ? $_GET['id'] : die('ERROR: Record ID not found.'));

    //$query = "DELETE FROM $data_table WHERE trainingID = '$id'";         // To actually delete the data
    $query = "UPDATE $data_table SET deleted = 1 WHERE trainingID = '$id'";
    $result = mysqli_query($db, $query);

    if ($result){
        header('Location: settings.php?action=deleted');
    }
    else{
        die('Unable to delete record.');
    }


}
// show error
catch(PDOException $exception){
    die('ERROR: ' . $exception->getMessage());
}


?>