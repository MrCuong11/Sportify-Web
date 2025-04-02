// Export elements of this module
export { 
     RememberMe,
     showPassword,
     getCookie,
     deleteCookie,
     logOut,
     encodeCValue,
     decodeCValue
    };

// In this project, I will be using cookies as a replacement of databases since using NodeJS would be too complexe to run on another computer.

/* RememberMe() is a basic simplified version of the remember-me functionality, 
 * Since in a real project, saving the user credentials directly into the local cookies = huge flaw for the security
 * Express-sessions would be a better choice if this project was built on NodeJS
 */

/* Set the login cookies according to whether the user had chosen the remember-me box or not
 * Yes: save the user's status as direct-login
 * No: save the user's credentials for login verification
 */

// Đăng ký người dùng
async function registerUser(email, username, password) {
    const response = await fetch('http://localhost:8081/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password })
    });

    if (response.ok) {
        const data = await response.json();
        alert("Registration successful!");
    } else {
        alert("Registration failed");
    }
}

// Đăng nhập người dùng
async function loginUser(email, password, rememberMe) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe })
    });

    if (response.ok) {
        const data = await response.json();
        const token = data.token;
        RememberMe({ email, token, rememberMe });  // Save the token in a cookie
        alert("Login successful!");
    } else {
        alert("Login failed");
    }
}

function RememberMe({ email, token, rememberMe }) {
    const date = new Date();
    // Expiring time
    const expires = "expires=" + date.toUTCString(date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000))); // 30 ngày

    // If rememberMe is true, store the token in the cookie
    if (rememberMe) {
        document.cookie = `auth_token=${token}; ${expires}; SameSite=None; Secure; path=/;`;
    } else {
        document.cookie = `auth_token=${token}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`; // expire immediately when user doesn't want to remember
    }
}

// Lấy token từ cookie
function getToken() {
    return getCookie('auth_token');
}

// Kiểm tra phiên đăng nhập (nếu có token hợp lệ trong cookie)
async function checkSession() {
    const token = getToken();
    if (!token) {
        return null;
    }

    const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (response.ok) {
        const user = await response.json();
        return user;  // Trả về thông tin người dùng
    } else {
        return null;  // Token không hợp lệ hoặc hết hạn
    }
}



// Function that logs out a existing user's session (those who're automatically logged in due to remember-me status)
// Đăng xuất người dùng
function logOut() {
    deleteCookie('auth_token');  // Xóa token
    alert("Logged out successfully!");
}

// Lấy giá trị cookie
function getCookie(name) {
    name = name + "=";
    const cArray = decodeURIComponent(document.cookie).split(';');
    for (let i = 0; i < cArray.length; i++) {
        let cookie = cArray[i];
        while (cookie.charAt(0) == " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

// Xóa cookie
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}


// Function that serializes a JSON cookie value
function encodeCValue(object) {
    return encodeURIComponent(decodeURIComponent(JSON.stringify(object)));
}

// Function that decodes a serialized JSON cookie value back to its normal object form, only if the cookie exists
function decodeCValue(name) {
    if (getCookie(name) != "") {
        return JSON.parse(getCookie(name));
    } else {
        return null;
    }
}


// EASTER EGG FUNCTION: When eye had been clicked, reveal password
function showPassword(type) {
    // Show password upon mouse click, and unshow upon mouse release
    // Type 0 = password, other integers = confirmed password
    if (type == 0) {
        document.getElementById("password").type = "text";
        document.getElementById("seePassword").addEventListener("mouseup", () => {
            document.getElementById("password").type = "password";
        });
    } else {
        document.getElementById("confirmPassword").type = "text";
        document.getElementById("seeConfirmedPassword").addEventListener("mouseup", () => {
            document.getElementById("confirmPassword").type = "password";
        });
    }
}
