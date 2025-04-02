import { RememberMe, showPassword, getCookie, logOut, registerUser } from "./utils.js";

// Main function
function main() {
    // Trigger register() once the form is submitted, e = event
    document.querySelector("#form").addEventListener("submit", (e) => {
        register(e);
    });

    // Show password when the eye had been clicked, listening on button click
    document.querySelector("#seePassword").addEventListener("mousedown", () => {
        showPassword(0);
    });
    // Show confirmed password when the eye had been clicked, listening on button click
    document.querySelector("#seeConfirmedPassword").addEventListener("mousedown", () => {
        showPassword(1);
    });
}

// Verify if username is correct
function verifyUsername(username) {
    const warning = document.querySelector("#idWarning");
    if (username.value == "") {
        warning.innerHTML = "*Ce champs est obligatoire";
        return 0;
    } else if (username.value.search(/\s/g) > -1) {
        warning.innerHTML = "*Le nom d'utilisateur ne doit pas contenir d'espaces.";
        return 0;
    }
    warning.innerHTML = "";
    return 1;
}

// Verify if email format is correct
function verifyEmail(email) {
    const warning = document.querySelector("#emailWarning");
    if (email.value == "") {
        warning.innerHTML = "*Ce champs est obligatoire.";
        return 0;
    } else if (email.value.search(/\w+@\w+/g) < 0 || email.value.search(/\s/g) > -1) {
        warning.innerHTML = "*Adresse Email Invalide";
        return 0;
    }
    warning.innerHTML = "";
    return 1;
}

// Verify if password respects criterias
function verifyPassword(password) {
    const warning = document.querySelector("#passwordWarning");
    if (password.value.length < 8) {
        warning.innerHTML = "*Votre mot de passe doit contenir au moins 8 caractères.";
        return 0;
    }
    if (password.value.search(/\s/g) > -1) {
        warning.innerHTML = "*Votre mot de passe ne doit pas contenir d'espaces.";
        return 0;
    }
    if (password.value.search(/[A-Za-z]/g) < 0) {
        warning.innerHTML = "*Votre mot de passe doit contenir des lettres.";
        return 0;
    }
    if (password.value.search(/([^A-Z0-9a-z\s*])/g) < 0) {
        warning.innerHTML = "*Votre mot de passe doit contenir un caractère spécial.";
        return 0;
    }
    if (password.value.search(/([0-9])/g) < 0) {
        warning.innerHTML = "*Votre mot de passe doit obligatoirement contenir un chiffre.";
        return 0;
    }
    warning.innerHTML = "";
    return 1;
}

// Verify if two passwords are identical
function verifyIdenticalPassword(password, confirmedP) {
    const warning = document.querySelector("#confirmPasswordWarning");
    if (password.value != confirmedP.value) {
        warning.innerHTML = "*Les mots de passe ne sont pas identiques.";
        return 0;
    }
    warning.innerHTML = "";
    return 1;
}

// Register user
async function register(e) {
    // Prevent form submitting automatically and page refreshing
    e.preventDefault();  // Ngăn không cho form gửi đi và trang refresh lại

    // Get values from form fields
    const username = document.querySelector("#username");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const confirmedPassword = document.querySelector("#confirmPassword");
    const rememberMe = document.querySelector("#rememberMe");

    let verif1 = verifyUsername(username);
    let verif2 = verifyEmail(email);
    let verif3 = verifyPassword(password);
    let verif4 = verifyIdenticalPassword(password, confirmedPassword);

    // If any verification isn't passed, the function stops here
    if (verif1 + verif2 + verif3 + verif4 != 4) return;

    // Call the registerUser function to send data to the backend API
    try {
        await registerUser(email.value, username.value, password.value);  // Call registerUser

        // Once registration is successful, you can proceed with RememberMe
        RememberMe({ email: email.value, username: username.value, password: password.value, rememberMe: rememberMe.checked });

        // Handle success and display message
        document.querySelector(".containerRegister").style.display = "none";
        document.querySelector("#signInAlertText").innerHTML = `Bienvenue à vos ressources de programmation, ${username.value}!`;
        document.querySelector(".successfulSignIn").style.display = "block"; // Show success message
        document.querySelector(".successfulSignIn").style.animation = "popUp linear 5s forwards"; // Animation
        document.querySelector(".register").style.animation = "blurOut linear 5s forwards"; // Animation

        // Redirect after 5 seconds
        setTimeout(() => {
            window.location = "../index.html";
        }, 5000);

    } catch (error) {
        alert("Đăng ký thất bại!"); // Display error if registration failed
    }
}


main();
