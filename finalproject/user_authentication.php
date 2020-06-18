<?php
session_start();

// Initialize variable
$errors = array();

// Connecting to MySQL database
DEFINE ('DB_HOST', 'localhost');    //server name
DEFINE ('DB_USER', 'root');         //database username
DEFINE ('DB_PASSWORD', '');         //password
DEFINE ('DB_NAME', 'ezml');         //database name to connect to
$user_table = "users";

// Establish the connection
$db = @mysqli_connect (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die('Could not connect to database: '.mysqli_connect_error() );

//Login user
if(isset($_POST['login'])){
  // removing all escape characters from input to avoid SQL injection
  $username = mysqli_real_escape_string($db, $_POST['username']);
  $password = mysqli_real_escape_string($db, $_POST['password']);

  // Check if any of the fields is empty
  if(empty($username))(array_push($errors, "Username is required"));
  if(empty($password))(array_push($errors, "Password is required"));

  //  if it is errors free
  if(count($errors) == 0){
    $password = hash("sha512", $password);    //hash the password
    $query = "SELECT * FROM $user_table WHERE username='$username' AND password='$password'";
    $result = mysqli_query($db, $query);      //query the result from database
    $user = mysqli_fetch_assoc($result);       //to access the result

    if(mysqli_num_rows($result) > 0){
      $_SESSION['userID'] = $user['userID'];               // store userID
      $_SESSION['username'] = $user['username'];           // store username
      $_SESSION['name'] = $user['firstName'] . " " . $user['lastName'];    // store user real name
      $_SESSION['success'] = "Logged in successfully";  // store message to indicate success login

      // update the lastLoginDate
      $query = "UPDATE $user_table SET lastLoginDate = NOW() WHERE username='$username'";
      mysqli_query($db, $query);

      // go back to homepage
      header('Location: index.php');
    }
    else {
      array_push($errors, "Wrong username or password, please try again");
    }
  }
}

// Register user
if(isset($_POST['register'])){
  //removing all escape characters from input to avoid SQL injection
  $username = mysqli_real_escape_string($db, $_POST['username']);
  $email = mysqli_real_escape_string($db, $_POST['email']);
  $fname = mysqli_real_escape_string($db, $_POST['fname']);
  $lname = mysqli_real_escape_string($db, $_POST['lname']);
  $password_1 = mysqli_real_escape_string($db, $_POST['password_1']);
  $password_2 = mysqli_real_escape_string($db, $_POST['password_2']);

  // Check if any of the fields is empty
  if (empty($username)) (array_push($errors, "Username is required"));
  if (empty($email)) (array_push($errors, "Email is required"));
  if (empty($fname)) (array_push($errors, "Fisrt Name is required"));
  if (empty($lname)) (array_push($errors, "Last Name is required"));
  if (empty($password_1)) (array_push($errors, "Password is required"));
  if (empty($password_2)) (array_push($errors, "Confirm password is required"));
  // Check if the confirm password is same with the first password
  if($password_1 != $password_2)(array_push($errors, "Passwords do not match"));

  // check db for existing user with same username or email
  $user_check_query = "SELECT * FROM $user_table WHERE `username` = '$username' LIMIT 1";
  $results = mysqli_query($db, $user_check_query);
  $user = mysqli_fetch_assoc($results);

  if($user){
    if ($user['username'] == $username)(array_push($errors, "Username already exists"));
    //if ($user['email'] == $email)(array_push($errors, "The email has been registered"));
  }

  //Register the user if no error
  if(count($errors) == 0){
    $password = hash("sha512", $password_1); // this will encrypt the password using sha512
    $query = "INSERT INTO $user_table (`firstName`, `lastName`, `username`, `password`, `registeredDate`, `lastLoginDate`) 
    VALUES ('$fname', '$lname', '$username', '$password', CURRENT_DATE(), NOW());";

    // insert the new user information into database
    mysqli_query($db, $query);

    // redirect user to log in now
    echo "<script type='text/javascript'>
    alert('Sucessfully registered! You can log in now');
    window.location.href='login.php';
    </script>";

    //header('Location: login.php');
  }
}

?>
