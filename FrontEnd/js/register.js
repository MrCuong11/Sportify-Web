import {  showPassword } from "./utils.js";

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
    // Check empty username and warn
    if (username.value == "") {
        warning.innerHTML = "*Hãy điền đủ thông tin ";
        return 0;
    // Check if username contains space, warn if true
    } else if (username.value.search(/\s/g) > -1) {
        warning.innerHTML = "*Tên người dùng không được chứa khoảng trắng."
        return 0;
    }
    // Erase any previous warnings if all cases are met
    warning.innerHTML = "";
    return 1;
}

// Verify if email format is correct
function verifyEmail(email) {
    const warning = document.querySelector("#emailWarning");
    // Check if empty string was submitted
    if (email.value == "") {
        warning.innerHTML = "*Hãy điền đầy đủ thông tin";
        return 0;
    // Search for the presence of "text+@+text" and whitespaces. 
    // Email = invalid if it contains any whitespace or doesn't contain "text+@+text".
    } else if (email.value.search(/\w+@\w+/g) < 0 || email.value.search(/\s/g) > -1) {
        warning.innerHTML = "*Lỗi định dạng email.";
        return 0;
    // If user already exists, tells the user to login if true
    } 
    // Erase any previous warning if all cases are met
    warning.innerHTML = "";
    return 1;
}

// Verify if password respects criterias
function verifyPassword(password) {
    const warning = document.querySelector("#passwordWarning");
    switch (true) {
        // Check if password length > 8 chars
        case password.value.length < 8:
            warning.innerHTML = "*Mật khẩu của bạn phải chứa ít nhất 8 ký tự.";
            return 0;
        // Check empty spaces, and warn if true
        case password.value.search(/\s/g) > -1:
            warning.innerHTML = "*Mật khẩu của bạn không được chứa khoảng trắng.";
            return 0;
        // Check if password contains letters, and warn if not
        case password.value.search(/[A-Za-z]/g) < 0:
            warning.innerHTML = "*Mật khẩu của bạn phải chứa chữ cái.";
            return 0;
        // Check if password contains special characters, and warn if not
        case password.value.search(/([^A-Z0-9a-z\s*])/g) < 0:
            warning.innerHTML = "*Mật khẩu của bạn phải chứa ký tự đặc biệt.";
            return 0;
        // Check if password contains numbers, and warn if not
        case password.value.search(/([0-9])/g) < 0:
            warning.innerHTML = "*Mật khẩu của bạn phải chứa số.";
            return 0;
    }
    // Erase any previous warning if all cases are met
    warning.innerHTML = "";
    return 1;
}

// Verify if two passwords are identical
function verifyIdenticalPassword(password, confirmedP) {
    const warning = document.querySelector("#confirmPasswordWarning");
    // Check if two passwords are identical, if not, warn
    if (password.value != confirmedP.value) {
        warning.innerHTML = "*Mật khẩu không giống nhau.";
        return 0;
    }
    // Erase any previous warning if the case had been met
    warning.innerHTML = "";
    return 1;
}

// Register user
async function register(e) {
    e.preventDefault();

    const username = document.querySelector("#username");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const confirmedPassword = document.querySelector("#confirmPassword");
    const rememberMe = document.querySelector("#rememberMe");

    let verif1 = verifyUsername(username);
    let verif2 = verifyEmail(email);
    let verif3 = verifyPassword(password);
    let verif4 = verifyIdenticalPassword(password, confirmedPassword);

    if (verif1 + verif2 + verif3 + verif4 !== 4) return;
    console.log(username.value,email.value,password.value);

    // Gửi dữ liệu tới server
    try {
        const response = await axios.post("http://localhost:8080/users", {
            username: username.value,
            email: email.value,
            password: password.value
        });
    
        const result = response.data;
    
        if (response.status !== 200 && response.status !== 201) {
            throw new Error(result.message || "Lỗi khi đăng ký.");
        }
    
        
        document.querySelector(".containerRegister").style.display = "none";
       
        document.querySelector(".successfulSignIn").style.display = "block";
        document.querySelector(".successfulSignIn").style.animation = "popUp linear 5s forwards";
        document.querySelector(".register").style.animation = "blurOut linear 5s forwards";
    
        setTimeout(() => {
            window.location = "../pages/login.html";
        }, 5000);
    } catch (error) {
        alert("Đăng ký thất bại: " + error.message);
    }
    
}



main();
