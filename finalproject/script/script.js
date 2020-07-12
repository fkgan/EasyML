const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    toggleButton.classList.toggle('active')
    navbarLinks.classList.toggle('active')
});

var counter = new Array();

function delete_data() {
    var chkbx = document.querySelectorAll("input[type=checkbox]");
    for (var i = 0; i < chkbx.length; i++) {
        if (chkbx[i].checked) {
            counter.push(chkbx[i].value)
        }
    }

    if (counter.length > 0) {
        var formData = new FormData();
        formData.append('action', 'retrain');
        formData.append('data', JSON.stringify(counter));

        var uploadLocation = 'API_call.php';
        var ajax = new XMLHttpRequest();
        ajax.open("POST", uploadLocation, true);

        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    // done!
                    try {
                        // If system return a JSON response
                        var obj = JSON.parse(ajax.responseText);
                        // Check the process status
                        if (obj['status'] == "success") {
                            window.location = "settings.php";   // Refresh the page
                        }
                        else {
                            // fail to retrain / delete data
                            // TODO: Say sorry?
                        }

                    } catch (e) {
                        // If system didn't return JSON response
                        // TODO: try catch decoded json response
                        // TODO: errors.php;
                        console.log("Caught exception: ", e);
                        // escape character. 
                        console.log("Server error: ", ajax.responseText);
                    }
                }
                else {
                    // error!
                    alert("Error on sending request to the server, please try again later.");
                }
            }
        }

        ajax.send(formData);
    }
    else {
        // user has not deleted a data
        alert("Please select a data to delete before performing this action.");
    }
}