import { playerController } from "./playMusic.js";
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

async function initFavor() {
  const container = document.getElementById("favoriteSongsList");

  if (!container) return;

  try {
    const token = getCookie("authToken");
    if (!token) throw new Error("Chưa đăng nhập");

    const res = await fetch("http://localhost:8080/favorites?page=0&size=10", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Lỗi HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log(data);
    const songs = data.result?.content || [];

    container.innerHTML = "";

    if (songs.length === 0) {
      container.innerHTML = "<p>Chưa có bài hát nào.</p>";
      return;
    }

    songs.forEach((song) => {
      const item = document.createElement("div");
      item.className = "song-item";
      item.innerHTML = `
        <div class="song-info">
        <img src="${
          song.imgUrl || "https://img.icons8.com/ios/50/music.png"
        }" />
        <div><p class="song-title">${song.title}</p><p class="song-artist">${
        song.artistName
      }</p></div>
      </div>
      
      <div class="song-duration">${song.duration || "00:00"}</div>
      <div class="song-actions">
        <button class="action-btn">⋮</button>
        <div class="dropdown-menu-playlist hidden"><button class="delete-btn">Xoá</button></div>
      </div>`;

      item.querySelector(".action-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        item.querySelector(".dropdown-menu-playlist").classList.toggle("show");
      });

      item.querySelector(".delete-btn").addEventListener("click", (e) =>{
        e.stopPropagation();
        removeSong(song.id);
    });

      item.addEventListener("click", () => {
        playerController.loadSongById(song.id);
      });

      container.appendChild(item);
    });

    const playAllBtn = document.getElementById("playAllBtn");
    if (playAllBtn) {
      playAllBtn.addEventListener("click",()=>{

        const ids = songs.map((s) => s.id); 
        
        playerController.playNewPlaylist(ids); 
      })
    }

  } catch (err) {
    console.error("Lỗi khi tải bài hát yêu thích:", err);
    container.innerHTML = "<p>Không thể tải dữ liệu.</p>";
  }
}

async function removeSong(id) {
  const token = getCookie("authToken");
  try {
    const response = await fetch(
      `http://localhost:8080/favorites/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        
      }
    );

    if (!response.ok) throw new Error("Xóa thất bại");
    alert("Đã xoá bài hát khỏi favorite");

    initFavor();
  } catch (err) {
    console.error("Lỗi khi xoá bài hát:", err);
    alert("Lỗi khi xoá bài hát");
  }
}



export function init() {
  initFavor(), playerController.initPlayer();
}
