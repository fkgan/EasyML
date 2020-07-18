var // button to trigger the next step
    nextBtn = document.getElementById('nextBtn'),
    // button to trigger windows file selector
    browseBtn = document.getElementById('browseBtn'),
    // button to upload and send the image file for OCR
    uploadBtn = document.getElementById('uploadBtn'),
    // the number of steps
    steps = [...document.querySelectorAll('.steps')],
    // access to the page of each step
    pages = [...document.querySelectorAll('.page')],
    // where text area is placed for editing
    textRegion = document.getElementById("text-region"),
    // where user edit OCR return's text
    ta = document.getElementById('text-area'),
    // where files are dropped + file selector is opened
    dropRegion = document.getElementById("drop-region"),
    // the drop message
    dropMessage = document.getElementById("drop-message"),
    // where images are previewed
    imagePreviewRegion = document.getElementById("image-preview"),
    // where the blob data will be store
    urls = [];

const MAX_STEPS = 1;
let currentStep = 1;

// before exiting the page
window.onbeforeunload = function () {
    // if user has uploaded anything, or has done asking
    if (urls.length > 0 && currentStep != 2) {
        return 'Changes you made may not be saved.';
    }
};

// when the next button is click
nextBtn.addEventListener('click', () => {
    if (currentStep == 1) {
        // Check if there's any image file uploaded
        if (urls.length < 1) {
            alert("Please upload at least 1 image!");
        }
        else if (ta.value == "") {
            alert("Maybe you want to write some text before proceed?");
        }
        else {
            // create the view of the file on the last page
            inputfiles = document.getElementById('input-files');
            var imgView = document.createElement("div");
            imgView.className = "input-view";
            inputfiles.appendChild(imgView);

            // append image to preview
            for (var i = 0; i < urls.length; i++) {
                var img = document.createElement("img");
                imgView.appendChild(img);
                img.src = urls[i];
            }

            ask();
            browseBtn.classList.add('hidden');  // hide the browse button
        }
    }
});

// On click, call api to retrieve OCR's text
uploadBtn.addEventListener('click', function () {
    if (urls.length > 0) {
        // perform some changes on UI
        browseBtn.disabled = true;
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = "<b><span id='processing'></span></b>";

        // create FormData
        var formData = new FormData();
        formData.append('action', 'ocr');
        formData.append('datatype', 'blob');
        formData.append('data', JSON.stringify(urls));

        var uploadLocation = 'API_call.php';
        var ajax = new XMLHttpRequest();
        ajax.open("POST", uploadLocation, true);

        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    // done!
                    uploadBtn.classList.add('hidden');  // hide the upload button
                    try {
                        // If system return a JSON response
                        // Convert json string to js object to output the return value
                        var obj = JSON.parse(ajax.responseText);

                        // Check the process status
                        if (obj['status']['error'] == false) {
                            console.log(obj['status']['message']);
                            ta.value = obj["data"]["ocrtext"];
                            document.getElementById('pg1-tips').innerHTML = "Edit the content on the image to help your machine understand better";
                            dropRegion.classList.add('hidden');
                            textRegion.classList.remove('hidden');
                            browseBtn.disabled = false;
                            nextBtn.classList.remove('hidden');         // display the next button
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
            }
        }
        ajax.send(formData);
    }
    else {
        alert("Please upload at least 1 image.");
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
input.accept = "image/*";
input.multiple = true;

dropRegion.addEventListener('click', function () {
    input.click();
});

browseBtn.addEventListener('click', function () {
    var response = confirm("Are you sure you want to upload another image? Your existing text will be clear away.");
    if (response == true) {
        textRegion.classList.add('hidden');
        document.getElementById('pg1-tips').innerHTML = "Upload your text(s) in image format.";
        dropRegion.classList.remove('hidden');
        uploadBtn.disabled = false;
        uploadBtn.classList.remove('hidden');
        ta.value = "";
        nextBtn.classList.add('hidden');
    }
    else {
        return;
    }

    input.click();
    reset();
});

input.addEventListener("change", function () {
    var files = input.files;
    handleFiles(files);
});

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
    // Reset some element when new file is uploaded
    reset();

    // Controls the drop-region message indicator to tell user upload files
    if (files.length > 0) {
        // When at least 1 file is uploaded, hide the drop-region message
        dropMessage.classList.add('hidden');
    }
    else {
        // If there is no file uploaded, unhide the drop-region message back
        dropMessage.classList.remove('hidden');
    }

    for (var i = 0, len = files.length; i < len; i++) {
        if (validateImage(files[i])) {
            previewImage(files[i]);
        }
    }
}


function validateImage(image) {
    // check the type
    var validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (validTypes.indexOf(image.type) === -1) {
        alert("Invalid File Type");
        return false;
    }
    return true;
}

function previewImage(image) {
    // container
    var imgView = document.createElement("div");
    imgView.className = "image-view";
    imagePreviewRegion.appendChild(imgView);

    // previewing image
    var img = document.createElement("img");
    imgView.appendChild(img);

    // read the image...
    var reader = new FileReader();
    reader.onload = function (e) {
        img.src = e.target.result;
        urls.push(e.target.result);       // Append the results into urls array
    }
    reader.readAsDataURL(image);
}

// To delete all the element inside the class
function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

// Reset some element when new file is uploaded
function reset() {
    urls = [];      // To empty urls array
    removeElementsByClass("image-view");
    uploadBtn.innerHTML = "<b>Upload</b>";
}

function onErrorPageChange() {
    // hide buttonS
    browseBtn.classList.add('hidden');

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
    formData.append('datatype', 'text')
    formData.append('data', JSON.stringify(ta.value));

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
                        // server fails to give correct response
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