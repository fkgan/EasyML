const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    toggleButton.classList.toggle('active')
    navbarLinks.classList.toggle('active')
});

function delete_data(trainingID) {
    var response = confirm('Are you sure you want to delete this training data?\nThis cannot be undone.');

    if (response == true) {
        // delete data
        window.location = 'delete.php?id=' + trainingID;
    }
}