import { playerController } from "./playMusic.js";

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
}

const token = getCookie("authToken");

async function fetchMyInfo() {
  const res = await fetch("http://localhost:8080/users/myInfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Error fetching user info: ${res.status}`);
  const data = await res.json();
  return data.result;
}

async function fetchMyPlaylists() {
  const res = await fetch("http://localhost:8080/playlists/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Error fetching playlists: ${res.status}`);
  const data = await res.json();
  return data.result.content || [];
}

function setProfileImage(imgUrl, username) {
  const img = document.getElementById("profile-image");
  const fallback = document.getElementById("profile-fallback");

  if (imgUrl) {
    img.src = imgUrl;
    img.style.display = "block";
    fallback.style.display = "none";
  } else {
    img.style.display = "none";
    fallback.textContent = username.charAt(0).toUpperCase();
    fallback.style.display = "flex";
  }
}

function renderProfile(userInfo, playlists) {
  document.getElementById("displayName").textContent = userInfo.username;

  setProfileImage(userInfo.avatarUrl, userInfo.username);

  const activePlaylists = playlists.filter((pl) => !pl.archive);
  document.getElementById(
    "playlistCount"
  ).textContent = `${activePlaylists.length} Playlist cá nhân`;

  const grid = document.querySelector(".playlist-grid");
  grid.innerHTML = "";

  activePlaylists.forEach((pl) => {
    const card = document.createElement("div");
    card.className = "playlist-card";

    const icon = document.createElement("div");
    icon.className = "playlist-icon";
    icon.textContent = "♪";

    const title = document.createElement("div");
    title.className = "playlist-title";
    title.textContent = pl.name || pl.title || "Playlist";

    const creator = document.createElement("div");
    creator.className = "playlist-creator";
    creator.textContent = `Của ${userInfo.username}`;

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(creator);

    card.addEventListener("click", () => {
      // console.log(pl.songs);
      const ids = pl.songs.map((s) => s.songId); // chỉ lấy ID
      // console.log(ids);
      playerController.playNewPlaylist(ids); // Gọi phát playlist khi click
    });

    grid.appendChild(card);
  });
}

async function renderProfilePage() {
  try {
    const [userInfo, playlists] = await Promise.all([
      fetchMyInfo(),
      fetchMyPlaylists(),
    ]);
    renderProfile(userInfo, playlists);
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu profile:", error);
  }
}

async function loadListeningHistory() {
  const user = await fetchMyInfo();
  console.log(user);
  const userId = user.id;
//   console.log("userId:", userId);
  try {
    const res = await fetch(
      `http://localhost:8080/history?userId=${encodeURIComponent(userId)}&page=0&size=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Không thể tải lịch sử nghe nhạc");

    const data = await res.json();
    console.log(data);
    const songs = data.result.content; // tùy API trả về có thể là `result.content`

    const container = document.getElementById("history-grid");
    if (!container) return;

    container.innerHTML = "";

    songs.forEach((song) => {
      const card = document.createElement("div");
      card.className = "history-card";
      card.innerHTML = `
        <img src="${song.song.imgUrl}" alt="${song.song.title}">
        <p>${song.song.title}</p>
        <p>${song.song.artistName}</p>
      `;

      card.addEventListener("click", async () => {
        playerController.loadSongById(song.song.id);
        playerController.playSong();
        
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Lỗi khi tải lịch sử nghe nhạc:", error);
  }
}

// Hàm init để gọi khi cần khởi tạo
export function init() {
  renderProfilePage();
  loadListeningHistory();
  playerController.initPlayer();
}

// Nếu muốn tự động chạy khi load trang:
// window.addEventListener("DOMContentLoaded", init);
