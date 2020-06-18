// before exiting the page
window.onbeforeunload = function () {
    // if user has uploaded anything
    if (urls.length > 0) {
        return 'Changes you made may not be saved.';
    }
};

var // button to trigger the next step
    nextBtn = document.getElementById('nextBtn'),
    // button to go to previous step
    backBtn = document.getElementById('backBtn'),
    // button to trigger edit function
    editBtn = document.getElementById('editBtn'),
    // the number of steps
    steps = [...document.querySelectorAll('.steps')],
    // access to the page of each step
    pages = [...document.querySelectorAll('.page')],
    // where files are dropped + file selector is opened
    dropRegion = document.getElementById("drop-region"),
    // the drop message
    dropMessage = document.getElementById("drop-message"),
    // where images are previewed
    textPreviewRegion = document.getElementById("text-preview"),
    // where file are preview in page 2
    pg2Preview = document.getElementById("pg2-preview"),
    // file blob output
    urls = [];

const MAX_STEPS = 4;
let currentStep = 1;

// when the next button is click
nextBtn.addEventListener('click', () => {
    // On step 1
    if (currentStep == 1) {
        // Check if there's any text file uploaded
        if (urls.length < 1) {
            alert("Please upload at least 1 text file!");
        }
        else {
            nextStep();
        }
    }
    // On step 2
    else if (currentStep == 2) {
        // Check if at least 1 tag is inserted
        if (!(document.getElementById("tags").value == "")) {
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
            nextStep();
        }
    }
    // On step 4
    else if (currentStep == 4) {
        teach();        //sending data to server
        nextStep();     //proceed to done
        backBtn.classList.add('hidden');    // hide the back button
    }
});

backBtn.addEventListener('click', () => {
    nextBtn.innerHTML = "<b>Next</b>";

    if (currentStep == 2) {
        backBtn.classList.add("hidden");
    }

    prevStep();
});

// Proceed to next step(page)
function nextStep() {
    steps[currentStep - 1].classList.add('done');
    steps[currentStep - 1].classList.remove('doing');

    //pages[currentStep - 1].classList.add('hidden');   // For the page 5 : Thank you

    if (currentStep < MAX_STEPS) {
        steps[currentStep].classList.add('doing');

        pages[currentStep - 1].classList.add('hidden');
        pages[currentStep].classList.remove('hidden');
    }

    // Changing the file preview in page 2
    if (currentStep == 1) {
        var display = document.createElement("pg2-display");
        display.className = "pg2-display";
        pg2Preview.appendChild(display);

        if (urls.length == 1) {
            var i = document.createElement("iframe");
            display.append(i);
            i.src = urls[0];
        }
        else if (urls.length > 1) {
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

        editBtn.classList.add('hidden');
        backBtn.classList.remove('hidden');
    }
    // Changing text to Teach before step 4
    if (currentStep == 3) {
        nextBtn.innerHTML = "<b>Teach</b>";
    }

    currentStep += 1;

    if (currentStep > MAX_STEPS) {
        nextBtn.disabled = true;
    }
}

function prevStep() {
    if (currentStep == 2) {
        // delete the page 2 displaying element that is generated so it dont generate again when next is click
        removeElementsByClass("pg2-display");
    }

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

dropRegion.addEventListener('click', function () {
    input.click();
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
    empty();
    removeElementsByClass("text-view");
    removeElementsByClass("pg2-display");
    document.getElementById("tags").value = "";

    if (!editBtn.classList.contains('hidden')) {
        editBtn.classList.add('hidden');
    }

    // Controls the drop-region message indicator to tell user upload files
    if (files.length > 0) {
        // When at least 1 file is uploaded, hide the drop-region message
        dropMessage.classList.add('hidden');
    }
    else {
        // If there is no file uploaded, unhide the drop-region message back
        dropMessage.classList.remove('hidden');
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
        append_URLs(e.target.result);
    }
    reader.readAsDataURL(textfile);
}


// To delete all the element inside the class
function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

//To empty urls array
function empty() {
    urls = [];
}

//To append data into urls array
function append_URLs(url) {
    urls.push(url);
}

function teach() {
    //Extract the tags
    var text = document.getElementById("tags").value;
    var tags = text.split(",");
    for (var i = 0; i < tags.length; i++) {
        tags[i] = tags[i].trim();
    }

    // taking sentiment value
    var sentiment = document.querySelector('input[name="sentiment"]:checked').value;

    // create FormData
    var formData = new FormData();
    formData.append('operation', 'teach');
    formData.append('tags', JSON.stringify(tags));
    formData.append('sent', sentiment);
    formData.append('img', JSON.stringify(urls));

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