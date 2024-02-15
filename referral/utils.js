// utils.js

// Function to show an element by its ID
function showElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'block';
    }
}

// Function to hide an element by its ID
function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'none';
    }
}

// Function to display a message with a specific color
function displayMessage(id, message, isSuccess = true) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = message;
        element.style.display = 'block';
        element.style.color = isSuccess ? 'green' : 'red';
    }
}

// Optionally, if using ES6 modules, export these functions
// export { showElement, hideElement, displayMessage };
