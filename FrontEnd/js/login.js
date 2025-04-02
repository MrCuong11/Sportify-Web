import { RememberMe, showPassword, getCookie, logOut } from "./utils.js";

// Main function
async function main() {
    // Kiểm tra nếu người dùng đã chọn "remember me" trước đó
    const token = getCookie("auth_token");
    if (token) {
        const user = await checkSession(token);
        if (user) {
            displayLogin(user.username);
            return;
        }
    }

    // Kích hoạt sự kiện đăng nhập khi form được gửi
    document.querySelector("#form").addEventListener("submit", (e) => {
        login(e);
    });

    // Hiển thị mật khẩu khi nhấn vào biểu tượng "mắt"
    document.querySelector("#seePassword").addEventListener("mousedown", () => {
        showPassword(0);
    });
}

// Kiểm tra phiên đăng nhập thông qua API
async function checkSession(token) {
    try {
        const response = await fetch("/api/user", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });
        if (response.ok) {
            return await response.json(); // Trả về thông tin người dùng
        }
    } catch (error) {
        console.error("Error checking session:", error);
    }
    return null;
}

// Hàm hiển thị đăng nhập thành công và chuyển hướng trang
function displayLogin(username) {
    document.querySelector(".containerLogin").style.display = "none";
    document.querySelector("#loginAlertText").innerHTML = `Rebonjour, ${username}!`;
    document.querySelector(".successfulLogin").style.display = "block";
    document.querySelector(".successfulLogin").style.animation = "popUp linear 5s forwards";
    document.querySelector(".login").style.animation = "blurOut linear 5s forwards";
    
    setTimeout(() => {
        window.location = "../index.html";
    }, 5000);
}

// Xử lý đăng nhập
async function login(e) {
    e.preventDefault();
    
    const email = document.querySelector("#id").value;
    const password = document.querySelector("#password").value;
    const rememberMe = document.querySelector("#rememberMe").checked;
    
    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            RememberMe({ email, token: data.token, rememberMe }); // Lưu token
            displayLogin(data.username);
        } else {
            document.querySelector("#passwordWarning").innerHTML = "* Email hoặc mật khẩu không chính xác";
        }
    } catch (error) {
        console.error("Login error:", error);
        document.querySelector("#passwordWarning").innerHTML = "* Đã xảy ra lỗi, vui lòng thử lại sau.";
    }
}

main();
