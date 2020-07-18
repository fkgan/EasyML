var // button to trigger the next step
    nextBtn = document.getElementById('nextBtn'),
    // button to trigger edit function
    editBtn = document.getElementById('editBtn'),
    // button to trigger windows file selector
    browseBtn = document.getElementById('browseBtn'),
    // the number of steps
    steps = [...document.querySelectorAll('.steps')],
    // access to the page of each step
    pages = [...document.querySelectorAll('.page')],
    // where user write their text
    ta = document.getElementById('text-area'),
    // where files are dropped
    dropRegion = document.getElementById("drop-region"),
    // the drop message
    dropMessage = document.getElementById("drop-message"),
    // where images are previewed
    textPreviewRegion = document.getElementById("text-preview"),
    // where the blob data will be store
    urls = [];

const MAX_STEPS = 1;
let currentStep = 1;

// before exiting the page
window.onbeforeunload = function () {
    // if user has uploaded anything, or has done asking
    if (urls.length > 0 && ta.value == "" && currentStep != 2) {
        return 'Changes you made may not be saved.';
    }
};

window.onclick = function () {
    // when text area is not selected on html window click
    if (ta !== document.activeElement) {
        // if there's nothing in text area and no file upload
        if (ta.value == "" && urls.length == 0) {
            // show drop message and enable browse button
            dropMessage.classList.remove('hidden');
            browseBtn.disabled = false;
        }
        // if there's file uploaded
        if (urls.length != 0) {
            browseBtn.disabled = false;     // make sure the browse button is enabled
        }
    }
};

// when the next button is click
nextBtn.addEventListener('click', () => {
    // On step 1
    if (currentStep == 1) {
        // Check if there's any text file uploaded
        if (urls.length < 1 && ta.value == "") {
            alert("Please upload at least 1 text file or write something!");
        }
        else {
            // create the view of the file on the last page
            inputfiles = document.getElementById('input-files');
            var txtView = document.createElement("div");
            txtView.className = "input-view";
            inputfiles.appendChild(txtView);

            if (ta.value != "") {
                var ifr = document.createElement("iframe");
                txtView.appendChild(ifr);
                ifr.src = encodeToBase64(ta.value, 'text/plain');
            }
            else if (urls.length > 0) {
                // append iframe to preview
                for (var i = 0; i < urls.length; i++) {
                    var ifr = document.createElement("iframe");
                    txtView.appendChild(ifr);
                    ifr.src = urls[i];
                }
            }

            ask();  // send the data
            editBtn.classList.add('hidden');
            browseBtn.classList.add('hidden');
        }
    }
});

editBtn.addEventListener('click', () => {
    // safety measure
    if (urls.length > 1 || urls.length < 0) {
        alert('Error. Edit is not available');
        return;
    }
    else {
        removeElementsByClass("text-view");
        // convert the blob url into plain text for editing
        var textdata = atob(urls[0].replace('data:text/plain;base64,', ''));
        ta.value = textdata;
        ta.style.zIndex = 1;
        urls = [];          // To empty urls array
        browseBtn.disabled = true;
        editBtn.classList.add('hidden');
    }
});

// Go to next step(page) when current step is done
function nextStep() {
    steps[currentStep - 1].classList.add('done');
    steps[currentStep - 1].classList.remove('doing');
    pages[currentStep - 1].classList.add('hidden');
    pages[currentStep].classList.remove('hidden');

    if (currentStep < MAX_STEPS) {
        steps[currentStep].classList.add('doing');
    }

    currentStep += 1;

    if (currentStep > MAX_STEPS) {
        nextBtn.disabled = true;
    }
}

function prevStep() {
    currentStep -= 1;
    steps[currentStep - 1].classList.add('doing');
    steps[currentStep].classList.remove('doing');
    steps[currentStep - 1].classList.remove('done');

    pages[currentStep].classList.add('hidden');
    pages[currentStep - 1].classList.remove('hidden');
}


// open file selector when clicked on the drop region
var input = document.createElement("input");
input.type = "file";
input.accept = "text/plain, application/pdf";
input.multiple = true;

browseBtn.addEventListener('click', function () {
    input.click();
    reset();
});

input.addEventListener("change", function () {
    reset();
    var files = input.files;
    handleFiles(files);
});

// To prevent the default browser behavior on handling file drop inside browser
function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
}

dropRegion.addEventListener('dragenter', preventDefault, false)
dropRegion.addEventListener('dragleave', preventDefault, false)
dropRegion.addEventListener('dragover', preventDefault, false)
dropRegion.addEventListener('drop', preventDefault, false)


function handleDrop(e) {
    var dt = e.dataTransfer,
        files = dt.files;

    handleFiles(files)
}

dropRegion.addEventListener('drop', handleDrop, false);

// When a change is detected in drop-region
function handleFiles(files) {
    reset();    // Reset some element when new file is uploaded

    if (!editBtn.classList.contains('hidden')) {
        editBtn.classList.add('hidden');
    }

    // Controls the drop-region message indicator to tell user upload files
    if (files.length > 0) {
        // When at least 1 file is uploaded, hide the drop-region message
        dropMessage.classList.add('hidden');
        ta.style.zIndex = -1;
    }
    else {
        // If there is no file uploaded, unhide the drop-region message back
        dropMessage.classList.remove('hidden');
        ta.style.zIndex = 1;
    }

    //Validate if the file is text/pdf, and if it is, spawn the text preview using iframe
    for (var i = 0, len = files.length; i < len; i++) {
        if (validateTextFile(files[i])) {
            if (files[i].type == 'application/pdf') {
                previewTextFile(files[i]);
            }
            else {
                previewTextFile(files[i]);
                if (files.length == 1 && editBtn.classList.contains('hidden')) {
                    editBtn.classList.remove('hidden');     // Allow editing when it is only 1 file
                }
                else if ((files.length < 1 || files.length > 1) && !(editBtn.classList.contains('hidden'))) {
                    editBtn.classList.add('hidden');     // Disallow editing when it is more than 1 file
                }
            }
        }
    }
}


function validateTextFile(file) {
    // check the type
    var validTypes = ['text/plain', 'application/pdf'];
    if (validTypes.indexOf(file.type) === -1) {
        alert("Invalid Text File Type");
        return false;
    }
    return true;
}

function previewTextFile(textfile) {
    //container
    var txtView = document.createElement("div");
    txtView.className = "text-view";
    textPreviewRegion.appendChild(txtView);

    // previewing text file
    var i = document.createElement("iframe");
    txtView.appendChild(i);

    // read the file
    var reader = new FileReader();
    reader.onload = function (e) {
        urls.push(e.target.result);     //Append the results into urls array
    }
    reader.readAsDataURL(textfile);
}

ta.addEventListener('change', () => {
    if (ta.value == "") {
        // Show drop message
        dropMessage.classList.remove('hidden');
        browseBtn.disabled = false;
    }
    else {
        // Hide drop message
        dropMessage.classList.add('hidden');
        browseBtn.disabled = true;
    }
});


ta.addEventListener('click', () => {
    if (ta === document.activeElement) {
        // Hide drop message
        dropMessage.classList.add('hidden');
        browseBtn.disabled = true;
    }
});


// To delete all the element inside the class
function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

// Reset some element when new file is uploaded
function reset() {
    urls = [];          // To empty urls array
    ta.value = "";      // To empty the text area
    dropMessage.classList.remove('hidden');
    editBtn.classList.add('hidden');
    ta.style.zIndex = 1;
}

// Encoding string data into base64 blob data
function encodeToBase64(string, type) {
    var type = "data:" + type + ";base64,";
    return type + btoa(unescape(encodeURIComponent(string)));
    //return type + btoa(string);       // doesn't work for characters outside latin-1 range
}

function onErrorPageChange() {
    steps[currentStep - 1].classList.add('fail');
    pages[currentStep - 1].classList.add('hidden');
    document.getElementById('page_error').classList.remove('hidden');   // show error page
}

function ask() {
    // perform some changes on UI
    nextBtn.disabled = true;
    nextBtn.innerHTML = "<b><span id='processing'></span></b>";

    // create FormData
    var formData = new FormData();
    formData.append('action', 'ask');
    if (ta.value != "") {
        formData.append('datatype', 'text');
        formData.append('data', JSON.stringify(ta.value));
        // encode to blob instead
        // formData.append('files', JSON.stringify(encodeToBase64(ta.value, 'text/plain')));
    }
    else if (urls.length > 0) {
        formData.append('datatype', 'blob')
        formData.append('data', JSON.stringify(urls));
    }

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
                    if (obj['status']['error'] == false) {
                        console.log(obj['status']['message']);
                        if (obj['data']['suggested'] != "") {
                            if (obj['data']['suggested'] > 1) {
                                document.getElementById('tags-review').innerHTML = obj['data']['suggested'].join(", ");
                            }
                            else {
                                document.getElementById('tags-review').innerHTML = obj['data']['suggested'];
                            }
                        } else {
                            document.getElementById('tags-review').innerHTML = "There is no related tags in the database.";
                        }

                        document.getElementById('input-sentiment').innerHTML = "Sentiment: " + obj['data']['predictedSentiment'];
                        nextStep();
                    }
                    else {
                        // server fails to give success as response
                        console.log("Server error: ", ajax.responseText);
                        onErrorPageChange();
                    }
                } catch (e) {
                    // If system didn't return JSON response
                    console.log("Caught exception: ", e);
                    console.log("Server error: ", ajax.responseText);
                    onErrorPageChange();
                }
            } else {
                // error!
                steps[currentStep - 1].classList.add('fail');
                alert("Error on sending request to the server, please try again later.");
                onErrorPageChange();
            }
            nextBtn.classList.add('hidden');    // hide the next button
        }
    }

    ajax.send(formData);
}