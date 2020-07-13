<?php
    include('config/login_check.php');  // Make sure user is logged in

    //Prevent user somehow jump to this page without chosing operation
    if ( !(isset($_GET['action'])) || $_GET['action'] == NULL ){
        header('Location: index.php');
    }

    if ($_GET['action'] == "ask"){
        $link = 'ask';
        include('config/ask_check.php');    // Check if user eligible to ask
    }
    else if ($_GET['action'] == "teach"){
        $link = 'teach';
    }
    else {
        header('Location: index.php');
    }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Start</title>
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
                    <!-- <li><a href="#about.php">About</a></li> -->
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
        <div class="datatype-container">
            <div class="img-link">
                <a <?php echo 'href="'. $link .'_text.php"' ?> ><img src="resources/text.jpg" alt="Text"></a>
                <span>Text</span>
            </div>
            <div class="img-link">
                <a <?php echo 'href="'. $link .'_image.php"' ?> ><img src="resources/image.jpg" alt="Image"></a>
                <span>Image with Text</span>
            </div>
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
                    <!-- <div><a href="#about.php">About</a></div> -->
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