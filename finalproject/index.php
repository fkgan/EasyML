<?php include('server.php'); ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/index.css">
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
        <div class="text-holder">
            <h1>Teach Your Own Machine Learning !</h1><br/>
            <h3>Can you teach a neural network to recognize paragraph of text and digital image?</h3><br/>
            <h3>Start teaching your machine now or challenge ur machine to answer your question!</h3>
            <div>
                <a href="start.php?op=ask">&nbsp;Ask&nbsp;</a>
                <a href="start.php?op=teach">Teach</a>
            </div>
        </div>
        <div class="circle_red"></div>
        <div class="circle_white"></div>
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