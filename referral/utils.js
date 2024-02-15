// utils.js

// Function to show an element by its ID
export function showElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'block';
    }
}

// Function to hide an element by its ID
export function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'none';
    }
}

// Function to display a message with a specific color
export function displayMessage(id, message, isSuccess = true) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = message;
        element.style.display = 'block';
        element.style.color = isSuccess ? 'green' : 'red';
    }
}
