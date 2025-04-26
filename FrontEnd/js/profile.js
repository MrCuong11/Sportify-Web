
document.addEventListener("DOMContentLoaded", function () {
  const token = getCookie("authToken");
  const authSection = document.getElementById("authSection");
  const loginRegister = document.getElementById("loginRegister");

  if (token) {
    authSection.style.display = "block";
    loginRegister.style.display = "none";

    const username = getUsernameFromToken(token);
    if (username) {
      setDefaultProfileAvatar(username);
    }
  } else {
    authSection.style.display = "none";
    loginRegister.style.display = "block";
  }
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
}

function eraseCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

function redirectToLogin() {
  window.location.href = "../FrontEnd/pages/login.html"; // hoặc bất kỳ trang login nào bạn đang dùng
}

async function handleLogout() {
  const token = getCookie("authToken");

  if (!token) {
      console.warn("No token found. Redirecting...");
      redirectToLogin();
      return;
  }

  try {
      const response = await fetch("http://localhost:8080/auth/logout", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ token })
      });

      if (response.ok) {
          // Xóa token khỏi cookie
          eraseCookie("authToken");

          // Chuyển hướng về trang login
          redirectToLogin();
      } else {
          console.error("Logout failed:", await response.text());
      }
  } catch (error) {
      console.error("Logout error:", error);
  }
}

function getUsernameFromToken(token) {
  try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const payloadObj = JSON.parse(decodedPayload);
      return payloadObj.sub; // "hieulx"
  } catch (error) {
      console.error("Failed to parse token", error);
      return null;
  }
}

// Ví dụ sử dụng:
const token = getCookie("authToken");
const username = getUsernameFromToken(token);
console.log("Username:", username); // --> "hieulx"


function setDefaultProfileAvatar(username) {
  const avatar = document.getElementById('profileAvatar');
  const firstChar = username.charAt(0).toUpperCase();
  avatar.textContent = firstChar;
}  

setDefaultProfileAvatar(username);

  function toggleDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }  

  // Ẩn dropdown nếu click ra ngoài
  window.addEventListener('click', function (e) {
    const dropdown = document.getElementById('profileDropdown');
    const profilePhoto = document.querySelector('.profile-photo');
    
    if (!dropdown || !profilePhoto) return;

    if (!profilePhoto.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }  
  });  

 
  


  


