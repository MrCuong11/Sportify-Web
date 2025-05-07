import { RememberMe, showPassword, getCookie, logOut, encodeCValue, decodeCValue } from "./utils.js";

// Main function
function main() {

    // If the user had previously selected remember-me, directly login the user
    if (getCookie("direct") != "") {
        let username = decodeCValue("direct").username;
        displayLogin(username);
    } 

    // Trigger login() once the form is submitted, e = event
    document.querySelector("#form").addEventListener("submit", (e) => {
        login(e);
    });

    // Show password when the eye had been clicked
    document.querySelector("#seePassword").addEventListener("mousedown", () => {
        showPassword(0);
    });
}

// Function that verifies if the credentials are correct according to the cookies stored.
// Function to make API call for login and handle warnings
// Function to make API call for login and handle warnings
async function verifyLoginCredentials(id, password) {
    const idWarning = document.querySelector("#idWarning");
    const passwordWarning = document.querySelector("#passwordWarning");

    try {
        // Make the POST request to the login API
        const response = await axios.post('http://localhost:8080/auth/token', {
            username: id,
            password: password
        });

        // If the response code is 1000 and authenticated is true, login is successful
        if (response.data.code === 1000 && response.data.result.authenticated) {
            // Clear warnings if login is successful
            idWarning.innerHTML = "";
            passwordWarning.innerHTML = "";

            // Return the token (or any other necessary data)
            return {
                success: true,
                token: response.data.result.token // Save the token to be used for future requests
            };
        } else {
            // If authentication fails, show an error message
            idWarning.innerHTML = "*Địa chỉ email hoặc mật khẩu không đúng";
            passwordWarning.innerHTML = "*Mật khẩu không đúng";
            return { success: false };
        }
    } catch (error) {
        console.error("Login failed:", error);
        // Handle error in the API request
        idWarning.innerHTML = "*Địa chỉ email hoặc mật khẩu không đúng";
        passwordWarning.innerHTML = "*Mật khẩu không đúng";
        return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau." };
    }
}



// A function that displays the login successful text and redirects the user to the homepage
function displayLogin(id) {
    document.querySelector(".containerLogin").style.display = "none";
    
    // Change the successful login alert text
    document.querySelector(".successfulLogin").style.display = "block"; // Make the alert text visible
    document.querySelector(".successfulLogin").style.animation = "popUp linear 5s forwards"; // Animation
    document.querySelector(".login").style.animation = "blurOut linear 5s forwards"; // Animation

    // Redirect to homepage
    setTimeout(() => {
        window.location = "../index.html";
    }, 5000);
}

// Login handler
async function login(e) {
    // Prevent form submitting automatically and page refreshing
    e.preventDefault();
    // Retrieve the value of every entry
    const id = document.querySelector("#id");
    const password = document.querySelector("#password");
    const rememberMe = document.querySelector("#rememberMe");

    // Call the verifyLoginCredentials function to check credentials via API
    const result = await verifyLoginCredentials(id.value, password.value);

    if (result.success) {
        const token = result.token; // Get the token from the result
        console.log("Login successful! Token:", token); // Log the token to the console
        // Save token to cookie
        document.cookie = `authToken=${token}; path=/; max-age=3600`; // Expires in 7 days


        //const name = decodeCValue(id.value).username; // Assuming the username is still decoded from cookies or session

        // Log out every user who has existing remember-me sessions
        // logOut();
        // RememberMe() verifies if the box is checked and performs the according actions
        // RememberMe({
        //     email: id.value,
        //     password: password.value,
        //     rememberMe: rememberMe.checked
        // });

        // Save the token in localStorage or sessionStorage for future requests
        // if (rememberMe.checked) {
        //     localStorage.setItem('authToken', token);
        // } else {
        //     sessionStorage.setItem('authToken', token);
        // }

        // Login successful, proceed to display a successful login text and redirect to another page
        displayLogin(name);
    } else {
        // If login failed, no need to add any warnings manually, they're set by verifyLoginCredentials
    }
}


main();
