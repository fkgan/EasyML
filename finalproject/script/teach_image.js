var // button to trigger the next step
    nextBtn = document.getElementById('nextBtn'),
    // button to go to previous step
    backBtn = document.getElementById('backBtn'),
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
    // where suggested tags will be shown
    hint = document.getElementById('hint-text'),
    // where user will input the their tags
    tag_input = document.getElementById("tags"),
    // timeout for hint request
    timeout = null,
    // where the blob data will be store
    urls = [];

const MAX_STEPS = 4;
let currentStep = 1;

// before exiting the page
window.onbeforeunload = function () {
    // if user has uploaded anything, or has done teaching
    if (urls.length > 0 && currentStep != 5) {
        return 'Changes you made may not be saved.';
    }
};

// when the next button is click
nextBtn.addEventListener('click', () => {
    // On step 1
    if (currentStep == 1) {
        // Check if there's any image uploaded
        if (urls.length < 1) {
            alert("Please upload at least 1 image!");
        }
        else if (ta.value == "") {
            alert("Maybe you want to write some text before proceed?");
        }
        else {
            // Prepare the file preview in page 2
            if (urls.length == 1) {
                document.getElementById('pg2-img').src = urls[0];
                document.getElementById('pg2-img').style.position = "absolute";
                document.getElementById('pg2-img').style.width = "auto";
                document.getElementById('pg2-img').style.height = "auto";
                document.getElementById('pg2-img').style.paddingTop = "0%";
                document.getElementById('file-message').innerHTML = "";
            }
            else if (urls.length > 1) {
                document.getElementById('pg2-img').src = "resources/filebox.svg";
                document.getElementById('pg2-img').style.position = "relative";
                document.getElementById('pg2-img').style.width = "50%";
                document.getElementById('pg2-img').style.height = "50%";
                document.getElementById('pg2-img').style.paddingTop = "20%";
                document.getElementById('file-message').innerHTML = "<b>" + urls.length + "</b>" + " files selected.";
            }

            backBtn.classList.remove('hidden'); // show the back button
            browseBtn.classList.add('hidden');  // hide the browse button
            nextStep();
        }
    }
    // On step 2
    else if (currentStep == 2) {
        // Check if at least 1 tag is inserted
        var text = document.getElementById("tags").value;
        var tags = tag_processing(text);

        if (!(tags.length < 1)) {
            nextStep();
        }
        else {
            alert("Please enter at least 1 tag!");
        }
    }
    // On step 3
    else if (currentStep == 3) {
        // Check if one of the sentiment is checked
        if (document.querySelector('input[name="sentiment"]:checked') == null) {
            alert("Please choose one of the sentiment");
        }
        else {
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

            // extract the tags value
            var text = document.getElementById("tags").value;
            var tags = tag_processing(text);
            var tags_str = tags[0];

            for (var i = 1; i < tags.length; i++) {
                tags_str = tags_str + ", " + tags[i];
            }

            document.getElementById('tags-review').innerHTML = tags_str;

            // taking sentiment value
            var sentiment = document.querySelector('input[name="sentiment"]:checked').value;
            document.getElementById('input-sentiment').innerHTML = "Sentiment: " + sentiment;

            nextBtn.innerHTML = "<b>Teach</b>";     // Changing text to confirm before step 4
            nextStep();
        }
    }
    // On step 4
    else if (currentStep == 4) {
        teach();                            // sending data to server
    }
});

backBtn.addEventListener('click', () => {
    if (currentStep == 2) {
        backBtn.classList.add("hidden");        // hide the back button
        browseBtn.classList.remove("hidden");   // show the browse button
    }

    if (currentStep == 4) {
        removeElementsByClass("input-view");
    }

    nextBtn.innerHTML = "<b>Next</b>";
    prevStep();
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


// Proceed to next step(page)
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
    reset();
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

    // Validate if the file is image, and if it is, spawn the image preview
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
    document.getElementById("tags").value = "";
}

//To extract the tag from input text
function tag_processing(text) {
    //Extract the tags
    var temp_tags = text.split(",");
    var tags = [];

    for (var i = 0, j = 0; i < temp_tags.length; i++) {
        if (temp_tags[i].trim() != "") {
            tags[j] = temp_tags[i].trim();
            j++;
        }
    }

    return tags;
}

// Listen for keystroke events and requests for hint (suggested tags)
tag_input.addEventListener('keyup', function (e) {
    // Clear the timeout if it has already been set.
    // This will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(timeout);

    if (tag_input.value != "") {
        var tags = tag_processing(tag_input.value);

        // Make a new timeout set to go off in 1000ms (1 second)
        timeout = setTimeout(function () {
            var formData = new FormData();
            formData.append('action', 'hint');
            formData.append('tags', tags);

            var uploadLocation = 'API_call.php';
            var ajax = new XMLHttpRequest();
            ajax.open("POST", uploadLocation, true);

            ajax.onreadystatechange = function () {
                if (ajax.readyState === 4) {
                    if (ajax.status === 200) {
                        // done!
                        try {
                            var obj = JSON.parse(ajax.responseText);
                            if (obj['data']['suggested'].length > 0) {
                                var formatedTags = obj['data']['suggested'].join(", ");
                                hint.innerHTML = "Maybe you want to try <b>" + formatedTags + "</b>?";
                            }
                            else {
                                hint.innerHTML = "No suggested tags. Continue teaching or try to type more.";
                            }
                        } catch (e) {
                            // if ajax.responseText is failed to parse to js object
                            hint.innerHTML = "Server is not responding right now. Please try again later.";
                            console.log(ajax.responseText);
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
        }, 1500);
    }
    else {
        hint.innerHTML = "Try to type something.";
    }
});

function onErrorPageChange() {
    // hide buttonS
    browseBtn.classList.add('hidden');

    steps[currentStep - 1].classList.add('fail');
    pages[currentStep - 1].classList.add('hidden');
    document.getElementById('page_error').classList.remove('hidden');   // show error page
}

function teach() {
    // perform some changes on UI
    backBtn.classList.add('hidden');    // hide the back button
    nextBtn.disabled = true;
    nextBtn.innerHTML = "<b><span id='processing'></span></b>";

    // Extracting the tags
    var text = document.getElementById("tags").value;
    var tags = tag_processing(text);

    // taking sentiment value
    var sentiment = document.querySelector('input[name="sentiment"]:checked').value;

    // create FormData
    var formData = new FormData();
    formData.append('action', 'teach');
    formData.append('datatype', 'text')
    formData.append('data', JSON.stringify(ta.value));
    formData.append('tags', JSON.stringify(tags));
    formData.append('sent', sentiment);

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
                        nextStep();                         // proceed to done
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