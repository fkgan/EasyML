<?php

// Connecting to MySQL database
DEFINE ('DB_HOST', 'localhost');    //server name
DEFINE ('DB_USER', 'root');         //database username
DEFINE ('DB_PASSWORD', '');         //password
DEFINE ('DB_NAME', 'ezml');         //database name to connect to

// Establish the connection
$db = @mysqli_connect (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die('Could not connect to database: '.mysqli_connect_error() );

// Assign variables to use in query
$user_table = "users";                  // user account information
$data_table = 'training_data';          // trained data

?>