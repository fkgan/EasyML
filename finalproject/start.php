<?php
    include('server.php');

    //Prevent user somehow jump to this page without chosing operation
    if ( !(isset($_GET['op'])) || $_GET['op'] == NULL ){
        header('Location: index.php');
    }

    if ($_GET['op'] == "ask"){
        $link = 'ask';
    }
    else if ($_GET['op'] == "teach"){
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
    <link rel="stylesheet" href="styles/start.css">
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
                    <li><a href="start.php?op=ask">Ask</a></li>
                    <li><a href="start.php?op=teach">Teach</a></li>
                    <li><a class="dropbtn"><?php echo $_SESSION['name']; ?></a>
                        <div class="dropdown-content">
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
                    <div><a href="#about.php">About</a></div>
                    <div><a href="start.php?op=ask">Ask</a></div>
                    <div><a href="#privacy.php">Privacy Policy</a></div>
                    <div><a href="start.php?op=teach">Teach</a></div>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="script/script.js"></script>    <!-- General script -->
    </footer>

</body>
</html>