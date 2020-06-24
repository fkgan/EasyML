<?php 
    include('config/login_check.php');  // Make sure user is logged in
    include('config/db_connect.php');   // include database connection

    $userID = $_SESSION['userID'];
    $query = "SELECT td.* FROM user_model as um right join $data_table as td on um.userOwnModelID = td.userOwnModelID where um.userID = $userID and deleted = 0";
    $result = mysqli_query($db, $query);      // query the result from database
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setting</title>
    <link rel="stylesheet" href="styles/style.css">
    <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@1,800&display=swap" rel="stylesheet">
</head>

<body>
    <header>
        <nav class="navbar">
            <span class="toggle-button">
                <span class="bar1"></span>
                <span class="bar2"></span>
                <span class="bar3"></span>
            </span>
            <div class="brand-title"><a href="index.php">Easy ML</a></div>
            <div class="navbar-links">
                <ul>
                    <li><a href="index.php">Home</a></li>
                    <li><a href="#about.php">About</a></li>
                    <li><a href="start.php?action=ask">Ask</a></li>
                    <li><a href="start.php?action=teach">Teach</a></li>
                    <li><a class="dropbtn"><?php echo $_SESSION['name']; ?></a>
                        <div class="dropdown-content">
                            <a href="settings.php">Model Settings</a>
                            <a href="index.php?logout=1">Logout</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <div class="content">
        <div class="model-settings">
            <?php
            $action = isset($_GET['action']) ? $_GET['action'] : "";
            
            // if it was redirected from delete.php
            if($action == 'deleted'){
                echo "<div class='alert-success'>Record is successfully deleted.</div>";
            }

            ?>

            <table>
            <tr>
                <th>No.</th>
                <th style="width: 55%;">Data</th>
                <th>Tags</th>
                <th>Sentiment</th>
                <th>Date Trained</th>
                <th>Action</th>
            </tr>
            <?php
                // check if more than 0 record found
                if(mysqli_num_rows($result) > 0){
                    $counter = 0;
                    while ($row = mysqli_fetch_assoc($result)){
                        extract($row);
                        $counter += 1;
                        echo "<tr>";
                            echo "<td>{$counter}</td>";
                            echo "<td>{$rawTextData}</td>";
                            echo "<td>{$tags}</td>";
                            echo "<td>{$sentiment}</td>";
                            echo "<td>{$dateTrained}</td>";
                            echo "<td>";
                                echo "<a href='#' onclick='delete_data({$trainingID});'  class='btn-del'>Delete</a>";
                            echo "</td>";
                        echo "</tr>";
                    }
                }
                // if no records found
                else{
                    echo "<tr>";
                        echo "<td colspan='6'>No result to display, start teach some knowledge to your model.</td>";
                    echo "</tr>";
                }
            ?>
            </table>
        </div>
    </div>

    <footer>
        <div class="footer_panel">
            <div id="information_section">
                <h2>EasyML</h2>
                <span id="pc_view">Easy to Use Machine Learning Application<br /></span>
                <span id="mobile_view">Copyright &copy;
                    <script type="text/javascript">
                        var today = new Date()
                        var year = today.getFullYear()
                        document.write(year)
                    </script>
                    MIMOS Berhad.</span>
            </div>
            <div id="navigation_section">
                <h2>Navigations</h2>
                <div id="navigation_link_section">
                    <div><a href="#about.php">About</a></div>
                    <div><a href="start.php?action=ask">Ask</a></div>
                    <div><a href="policy.html" onclick="javascript:void window.open('policy.html','_blank','width=700,height=500,toolbar=0,menubar=1,location=0,status=0,scrollbars=0,resizable=1,left=0,top=0');return false;">Privacy Policy</a></div>
                    <div><a href="start.php?action=teach">Teach</a></div>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="script/script.js"></script>    <!-- General script -->
    </footer>

</body>
</html>