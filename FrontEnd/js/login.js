import {  showPassword } from "./utils.js";

// Main function
function main() {


    
    document.querySelector("#form").addEventListener("submit", (e) => {
        login(e);
    });

   
    document.querySelector("#seePassword").addEventListener("mousedown", () => {
        showPassword(0);
    });
}


async function verifyLoginCredentials(id, password) {
    const idWarning = document.querySelector("#idWarning");
    const passwordWarning = document.querySelector("#passwordWarning");

    try {
       
        const response = await axios.post('http://localhost:8080/auth/token', {
            username: id,
            password: password
        });

        
        if (response.data.code === 1000 && response.data.result.authenticated) {
           
            idWarning.innerHTML = "";
            passwordWarning.innerHTML = "";

            
            return {
                success: true,
                token: response.data.result.token 
            };
        } else {
            
            idWarning.innerHTML = "*Địa chỉ email hoặc mật khẩu không đúng";
            passwordWarning.innerHTML = "*Mật khẩu không đúng";
            return { success: false };
        }
    } catch (error) {
        console.error("Login failed:", error);
        
        idWarning.innerHTML = "*Địa chỉ email hoặc mật khẩu không đúng";
        passwordWarning.innerHTML = "*Mật khẩu không đúng";
        return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau." };
    }
}




function displayLogin() {
    document.querySelector(".containerLogin").style.display = "none";
    
    document.querySelector(".successfulLogin").style.display = "block"; 
    document.querySelector(".successfulLogin").style.animation = "popUp linear 5s forwards"; 
    document.querySelector(".login").style.animation = "blurOut linear 5s forwards"; 

    
    setTimeout(() => {
        window.location = "../index.html";
    }, 5000);
}


async function login(e) {
    
    e.preventDefault();
    
    const id = document.querySelector("#id");
    const password = document.querySelector("#password");
    
   
    const result = await verifyLoginCredentials(id.value, password.value);

    if (result.success) {
        const token = result.token; 
        document.cookie = `authToken=${token}; path=/; max-age=3600`; // Expires in 7 days
        displayLogin();
    }
}


main();
