<?php 

include('user_authentication.php');

// If user has logged in, he cannot re-login unless he log out.
if(isset($_SESSION['userID']) && isset($_SESSION['success'])){
    header('Location: index.php');
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/user_auth.css">
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
        </nav>
    </header>

    <div class="content">
        <form class="login_form" action="login.php" method="post">
            <h1>Login</h1>
            <div><input type="text" name="username" placeholder="Username" required></div>
            <div><input type="password" name="password" placeholder="Password" required></div>
            <div><button type="submit" name="login">LOGIN</button></div>
            <?php foreach($errors as $error) :?>
                <p id="error_msg"><?php echo $error ?></p>
            <?php endforeach ?>
            <p>Not a user? <a href="register.php"><b>Create an account</b></a></p>
        </form>
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
        </div>
        <script type="text/javascript" src="script/script.js"></script>    <!-- General script -->
    </footer>

</body>
</html>