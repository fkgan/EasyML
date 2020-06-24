var // button to trigger the next step
    nextBtn = document.getElementById('nextBtn'),
    // button to go to previous step
    backBtn = document.getElementById('backBtn'),
    // button to trigger windows file selector
    browseBtn = document.getElementById('browseBtn'),
    // the number of steps
    steps = [...document.querySelectorAll('.steps')],
    // access to the page of each step
    pages = [...document.querySelectorAll('.page')],
    // where files are dropped + file selector is opened
    dropRegion = document.getElementById("drop-region"),
    // the drop message
    dropMessage = document.getElementById("drop-message"),
    // where images are previewed
    imagePreviewRegion = document.getElementById("image-preview"),
    // file blob output
    urls = [];

const MAX_STEPS = 2;
let currentStep = 1;

// before exiting the page
window.onbeforeunload = function () {
    // if user has uploaded anything, or has done asking
    if (urls.length > 0 && currentStep != 3) {
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
        else {
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

            nextBtn.innerHTML = "<b>Ask</b>";
            backBtn.classList.remove('hidden'); // show the back button
            browseBtn.classList.add('hidden');  // hide the browse button
            nextStep();
        }
    }
    else if (currentStep == 2) {
        // Check if at least 1 tag is inserted
        if (!(document.getElementById("tags").value == "")) {
            ask();  // send the data
            nextStep();
            backBtn.classList.add('hidden');    // hide the back button
        }
        else {
            alert("Please enter at least 1 tag!");
        }
    }
});

backBtn.addEventListener('click', () => {
    if (currentStep == 2) {
        nextBtn.innerHTML = "<b>Next</b>";
        backBtn.classList.add("hidden");        // hide the back button
        browseBtn.classList.remove("hidden");   // show the browse button
    }
    prevStep();
});


// Go to next step(page) when current step is done
function nextStep() {
    steps[currentStep - 1].classList.add('done');
    steps[currentStep - 1].classList.remove('doing');

    //the page change, but the step don't change anymore
    //pages[currentStep - 1].classList.add('hidden');   // For the page 5 : Thank you

    if (currentStep < MAX_STEPS) {
        steps[currentStep].classList.add('doing');
        pages[currentStep - 1].classList.add('hidden');
        pages[currentStep].classList.remove('hidden');
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

function ask() {
    // Extracting the tags
    var text = document.getElementById("tags").value;
    var tags = tag_processing(text);

    // create FormData
    var formData = new FormData();
    formData.append('action', 'ask');
    formData.append('datatype', 'blob')
    formData.append('data', JSON.stringify(urls));
    formData.append('tags', JSON.stringify(tags));

    //var uploadLocation = 'API_call.php';
    var uploadLocation = 'process.php';
    var ajax = new XMLHttpRequest();
    ajax.open("POST", uploadLocation, true);

    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status === 200) {
                // done!
                console.log(ajax.responseText);
            } else {
                // error!
                alert("Error on sending request to the server, please try again later.");
            }
        }
    }

    ajax.send(formData);
}