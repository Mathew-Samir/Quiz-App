// Load users from a JSON file
let users = [];
fetch('./json/users.json')
    .then(response => response.json())
    .then(data => {
        users = data;
    })
    .catch(error => console.error('Error loading users:', error));

// Validation and authentication function
function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Get error message elements for username and password
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');

    // Clear previous error messages
    usernameError.textContent = '';
    passwordError.textContent = '';

    // Username validation
    if (!isValidUsername(username)) {
        usernameError.textContent = 'Invalid username. Username must not contain spaces or underscores.';
        return false; // Prevent form submission
    }

    // Password validation
    if (!isValidPassword(password)) {
        passwordError.textContent = 'Invalid password. Password must be at least 8 characters, include one capital letter, one lowercase letter, and one special character.';
        return false; // Prevent form submission
    }

    // Check if the username and password match the JSON data
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        // Redirect to the dashboard page
        window.location.href = 'main.html';
        return false; // Prevent form submission
    } else {
        passwordError.textContent = 'Invalid username or password.';
        return false; // Prevent form submission
    }
}

// Username validation: no spaces and no underscores
function isValidUsername(username) {
    for (let i = 0; i < username.length; i++) {
        if (username[i] === ' ' || username[i] === '_') {
            return false;
        }
    }
    return true;
}

// Password validation: at least 8 characters, one capital letter, one lowercase letter, and one special character
function isValidPassword(password) {
    if (password.length < 8) {
        return false;
    }
    let hasUppercase = false;
    let hasLowercase = false;
    let hasSpecialCharacter = false;
    const specialCharacters = "!@#$%^&*()-_+=<>?";
    for (let i = 0; i < password.length; i++) {
        let char = password[i];
        if (char >= 'A' && char <= 'Z') {
            hasUppercase = true;
        }
        if (char >= 'a' && char <= 'z') {
            hasLowercase = true;
        }
        if (specialCharacters.indexOf(char) !== -1) {
            hasSpecialCharacter = true;
        }
        // If all conditions are met, break early
        if (hasUppercase && hasLowercase && hasSpecialCharacter) {
            return true;
        }
    }
    return hasUppercase && hasLowercase && hasSpecialCharacter;
}



// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function () {
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle the icon between "bx-hide" and "bx-show"
    this.classList.toggle('bx-hide');
    this.classList.toggle('bx-show');
});


