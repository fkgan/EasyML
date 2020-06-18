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
    <title>Create an account</title>
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
        <form class="reg_form" action="register.php" method="post">
            <h1>Create an account</h1>
            <div><input type="text" name="username" placeholder="Username" required></div>
            <div><input type="text" name="email" placeholder="Email" required></div>
            <div><input type="text" name="fname" placeholder="First Name" required>
            <input type="text" name="lname" placeholder="Last Name" required></div>
            <div><input type="password" name="password_1" placeholder="Password" required></div>
            <div><input type="password" name="password_2" placeholder="Confirm password" required></div>
            <div><button type="submit" name="register">REGISTER</button></div>
            <?php foreach($errors as $error) :?>
                <p id="error_msg"><?php echo $error ?></p>
            <?php endforeach ?>
            <p>Already a user? <a href="login.php"><b>Log in</b></a></p>
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