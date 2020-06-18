<?php include('server.php'); ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/teach.css">
    <link rel="stylesheet" href="styles/stepProgressBar.css">
    <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@1,800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet">
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
        <div class="progress-border">
            <div class="progress-container">
                <ul class="progressbar">
                    <li class="steps doing"><b>Upload</b></li>
                    <li class="steps"><b>Tagging</b></li>
                    <li class="steps"><b>Pick Sentiment</b></li>
                    <li class="steps"><b>Confirm</b></li>
                </ul>
            </div>
        </div>
        <div class="content-border">
            <div class="page" id="pg1">
                <div id="drop-region">
                    <div class="drop-message" id="drop-message">
                        <img src="resources/upload.png" alt="">
                        <p><span class="hl-deepblue">Drag & Drop</span> files here <br>or<br> <span class=underlined>click</span> to browse</p>
                    </div>
                    <div id="image-preview"></div>
                </div>
            </div>

            <div class="page hidden" id="pg2">
                <h3 class="underline-small">Insert the corresponding tags related to the uploaded content</h3>
                <div class="grid-container">
                    <div class="pg2-preview">
                        <img id="pg2-img" alt="image-preview"></img>
                        <div id="file-message"></div>
                    </div>
                    
                    <textarea placeholder="Enter tags and split by ','" name="tags" id="tags" cols="40" rows="15"></textarea>
                </div>
            </div>

            <div class="page hidden" id="pg3">
                <div id="tips"><h3 class="underline-small">Choose one of the sentiment that represents your content</h3></div>

                <input type="radio" name="sentiment" id="positive" class="input-button-hidden" value="positive"/>
                <label for="positive"><img src="resources/positive.png" alt="positive" /></label>

                <input type="radio" name="sentiment" id="neutral" class="input-button-hidden" value="neutral"/>
                <label for="neutral"><img src="resources/neutral.png" alt="neutral" /></label>

                <input type="radio" name="sentiment" id="negative" class="input-button-hidden" value="negative"/>
                <label for="negative"><img src="resources/negative.png" alt="negative" /></label>
            </div>

            <div class="page hidden" id="pg4">
                <div id="tips"><h3 class="underline-small">Confirm your input</h3></div>
                <div class="blackboard">
                    <div class="blackboard-content">
                        <div id="input-files">
                            <h1>Images</h1>
                        </div>
                        <div id="next-column">
                            <div id="input-tags">
                                <h1>Tags</h1>
                                <p id="tags-review"></p>
                            </div>
                            <div id="input-sentiment"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="button-area">
                <button class="button hidden" id="backBtn"><b>Back</b></button>
                <button class="button" id="nextBtn"><b>Next</b></button>
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
        <script type="text/javascript" src="script/teach_image.js"></script>
    </footer>

</body>
</html>