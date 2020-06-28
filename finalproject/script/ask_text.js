var // button to trigger the next step
    nextBtn = document.getElementById('nextBtn'),
    // button to go to previous step
    backBtn = document.getElementById('backBtn'),
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
    // where file are preview in page 2
    pg2Preview = document.getElementById("pg2-preview"),
    // where the blob data will be store
    urls = [];

const MAX_STEPS = 2;
let currentStep = 1;

// before exiting the page
window.onbeforeunload = function () {
    // if user has uploaded anything, or has done asking
    if (urls.length > 0 && ta.value == "" && currentStep != 3) {
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
            // Changing the file preview in page 2
            var display = document.createElement("pg2-display");
            display.className = "pg2-display";
            pg2Preview.appendChild(display);

            if (urls.length >= 1) {
                if (urls.length == 1) {
                    var i = document.createElement("iframe");
                    display.append(i);
                    i.src = urls[0];
                }
                else {
                    var i = document.createElement("img");
                    var fm = document.createElement("div");
                    fm.id = "file-message";
                    display.append(i);
                    display.append(fm);
                    i.src = "resources/filebox.svg";
                    i.style.position = "relative";
                    i.style.width = "50%";
                    i.style.height = "50%";
                    i.style.paddingTop = "20%";
                    fm.innerHTML = "<b>" + urls.length + "</b>" + " files selected.";
                }
            }
            else if (ta.value != "") {
                var i = document.createElement("iframe");
                display.append(i);
                i.src = encodeToBase64(ta.value, 'text/plain');
            }

            nextBtn.innerHTML = "<b>Ask</b>";
            editBtn.classList.add('hidden');
            browseBtn.classList.add('hidden');
            backBtn.classList.remove('hidden');
            nextStep();
        }
    }
    // On step 2
    else if (currentStep == 2) {
        // Check if at least 1 tag is inserted
        var text = document.getElementById("tags").value;
        var tags = tag_processing(text);

        if (!(tags.length < 1)) {
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
        }
        else {
            alert("Please enter at least 1 tag!");
        }
    }
});

backBtn.addEventListener('click', () => {
    if (currentStep == 2) {
        removeElementsByClass("pg2-display");   // delete the page 2 displaying element that is generated so it dont generate again when next is click
        backBtn.classList.add("hidden");        // hide the back button
        browseBtn.classList.remove("hidden");   // show the browse button
    }

    nextBtn.innerHTML = "<b>Next</b>";
    prevStep();
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
        i.src = e.target.result;
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
    removeElementsByClass("text-view");
    removeElementsByClass("pg2-display");
    dropMessage.classList.remove('hidden');
    editBtn.classList.add('hidden');
    document.getElementById("tags").value = "";
    ta.style.zIndex = 1;
}

// Encoding string data into base64 blob data
function encodeToBase64(string, type) {
    var type = "data:" + type + ";base64,";
    return type + btoa(string);
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

function ask() {
    // Extracting the tags
    var text = document.getElementById("tags").value;
    var tags = tag_processing(text);

    // create FormData
    var formData = new FormData();
    formData.append('action', 'ask');
    formData.append('tags', JSON.stringify(tags));

    if (ta.value != "") {
        formData.append('datatype', 'text');
        formData.append('data', JSON.stringify(ta.value));
        // encode to blob instead
        //formData.append('files', JSON.stringify(encodeToBase64(ta.value, 'text/plain')));
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
                    var obj = JSON.parse(ajax.responseText);
                    console.log(obj['status']);
                    if (obj['data']['suggested'] != "")
                        document.getElementById('tags-review').innerHTML = obj['data']['suggested'].join(", ");
                    else
                        document.getElementById('tags-review').innerHTML = "There is no related tags in the database.";

                    document.getElementById('input-sentiment').innerHTML = "Sentiment: " + obj['data']['predictedSentiment'];
                    nextStep();
                    backBtn.classList.add('hidden');    // hide the back button
                    nextBtn.classList.add('hidden');    // hide the next button
                } catch (e) {
                    // if ajax.responseText is failed to parse to js object
                    console.log(ajax.responseText);
                }
            } else {
                // error!
                alert("Error on sending request to the server, please try again later.");
            }
        }
    }

    ajax.send(formData);
}