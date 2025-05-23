import { playerController } from "./playMusic.js";
document.addEventListener("DOMContentLoaded", function () {
  const token = getCookie("authToken");
  const authSection = document.getElementById("authSection");
  const loginRegister = document.getElementById("loginRegister");

  if (authSection && loginRegister) {
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
  }

  // --- Tích hợp phần search ---
  setupSearchFeature(token);
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return decodeURIComponent(parts.pop().split(";").shift());
  return null;
}

function eraseCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

function redirectToLogin() {
  window.location.href = "./pages/login.html"; // hoặc bất kỳ trang login nào bạn đang dùng
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
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

window.handleLogout = handleLogout;

function getUsernameFromToken(token) {
  try {
    const payload = token.split(".")[1];
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
// console.log("Username:", username); // --> "hieulx"

function setDefaultProfileAvatar(username) {
  const avatar = document.getElementById("profileAvatar");
  if (!avatar) return;
  const firstChar = username.charAt(0).toUpperCase();
  avatar.textContent = firstChar;
}

setDefaultProfileAvatar(username);

function toggleDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

window.toggleDropdown = toggleDropdown;

// Ẩn dropdown nếu click ra ngoài
window.addEventListener("click", function (e) {
  const dropdown = document.getElementById("profileDropdown");
  const profilePhoto = document.querySelector(".profile-avatar");

  if (!dropdown || !profilePhoto) return;

  if (!profilePhoto.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});


// --------------- PHẦN SEARCH ----------------

let allSongs = [];
let allArtists = [];

async function fetchAllData(token) {
  if (!token) return;

  try {
    const [songsRes, artistsRes] = await Promise.all([
      fetch("http://localhost:8080/songs?page=0&size=50", {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
      fetch("http://localhost:8080/artists", {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
    ]);

    if (!songsRes.ok || !artistsRes.ok) throw new Error("Failed to fetch data");

    const songsData = await songsRes.json();
    const artistsData = await artistsRes.json();

    allSongs = songsData.result.content || [];
    // console.log(allSongs);
    allArtists = artistsData.result.content || [];
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu search:", error);
  }
}

function setupSearchFeature(token) {
  fetchAllData(token).then(() => {
    initSearch();
  });
}

function initSearch() {
  const searchInput = document.getElementById("searchInput");
  const suggestionsBox = document.getElementById("searchSuggestions");

  if (!searchInput || !suggestionsBox) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      suggestionsBox.style.display = "none";
      suggestionsBox.innerHTML = "";
      return;
    }

    const matchedSongs = allSongs
      .filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artistName.toLowerCase().includes(query)
      )
      .slice(0, 5);

    const matchedArtists = allArtists
      .filter((artist) => artist.name.toLowerCase().includes(query))
      .slice(0, 5);

    let html = "";

    if (matchedArtists.length > 0) {
      html += `<div class="search-suggestion-header">Nghệ sĩ</div>`;
      matchedArtists.forEach((artist) => {
        html += `
          <div class="search-suggestion-item search-suggestion-artist" data-artist-id="${artist.id}">
             ${artist.name}
          </div>`;
      });
    }

    if (matchedSongs.length > 0) {
      html += `<div class="search-suggestion-header">Bài hát</div>`;
      matchedSongs.forEach((song) => {
        html += `
          <div class="search-suggestion-item search-suggestion-song" data-song-id="${song.id}">
             ${song.title} - ${song.artistName}
          </div>`;
      });
    }

    if (!html) {
      html = `<div class="search-suggestion-item">Không tìm thấy kết quả nào</div>`;
    }

    suggestionsBox.innerHTML = html;
    suggestionsBox.style.display = "block";
  });

  suggestionsBox.addEventListener("click", (e) => {
    const artistId = e.target.getAttribute("data-artist-id");
    const songId = e.target.getAttribute("data-song-id");

    if (artistId) {
      // chuyển trang chi tiết nghệ sĩ
      window.location.href = `#/artist?id=${artistId}`;
    } else if (songId) {
      // phát bài hát - bạn cần gọi hàm load bài hát đúng chỗ này
      if (typeof playerController !== "undefined" && playerController.loadSongById) {
        playerController.loadSongById(songId);
      } else {
        console.warn("playerController.loadSongById chưa được định nghĩa");
      }
    }

    suggestionsBox.style.display = "none";
    searchInput.value = "";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) {
      suggestionsBox.style.display = "none";
    }
  });
}
