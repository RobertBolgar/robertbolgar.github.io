export function showDetails(details) {
    // Populate and show details in the UI
}

export function showError(message) {
    // Display error message to the user
}

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

// Function to display a message with a specific color and auto-hide it
export function displayMessage(id, message, isSuccess = true) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = message;
        element.style.display = 'block';
        element.style.color = isSuccess ? 'green' : 'red';
        
        // Set a timeout to hide the element after 5000 milliseconds (5 seconds)
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}
