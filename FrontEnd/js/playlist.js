import { playerController } from "./playMusic.js"; // import đúng hàm


export function init() {
  // bindUI();
  fetchAllSongs();
  loadPlaylists();
  playerController.initPlayer();
}

const token = getCookie("authToken");

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return decodeURIComponent(parts.pop().split(";").shift());
  return null;
}

const state = {
  token: token,
  currentPlaylistId: null,
  listSongs: [],
};

const modal = document.getElementById("createPlaylistModal");

// Các hàm xử lý


document.querySelector(".menu-btn")?.addEventListener("click", toggleMenu);

document.addEventListener("click", closeMenus);
document
  .querySelector(".delete-playlist-btn")
  ?.addEventListener("click", deletePlaylist);

document
  .getElementById("song-search")
  ?.addEventListener("input", showSuggestions);

document
  .getElementById("createPlaylistBtn")
  ?.addEventListener("click", () => (modal.style.display = "flex"));
document.getElementById("cancelCreateBtn")?.addEventListener("click", () => {
  modal.style.display = "none";
  clearModalInputs();
});
document
  .getElementById("confirmCreateBtn")
  ?.addEventListener("click", createPlaylist);

document.getElementById("backToPlaylistsBtn")?.addEventListener("click", () => {
  document.querySelector(".playlist-container").style.display = "block";
  document.querySelector(".playlist-wrap").style.display = "none";
});

function toggleMenu(e) {
  e.stopPropagation();
  const dropdown = document.querySelector(".menu-dropdown-delete");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

function closeMenus() {
  document
    .querySelector(".menu-dropdown-delete")
    ?.style.setProperty("display", "none");
  document
    .querySelectorAll(".dropdown-menu-playlist")
    .forEach((menu) => menu.classList.remove("show"));
}

function deletePlaylist() {
  if (!confirm("Bạn có chắc muốn xóa playlist này không?")) return;

  fetch(`http://localhost:8080/playlists/${state.currentPlaylistId}/archive`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.token}`,
    },
  })
    .then((res) =>
      res.ok ? window.history.back() : alert("Xóa không thành công.")
    )
    .catch(() => alert("Có lỗi xảy ra khi xóa."));
}

function loadPlaylists() {
  fetch("http://localhost:8080/playlists/me", {
    headers: { Authorization: `Bearer ${state.token}` },
  })
    .then((res) => res.json())
    .then((data) => renderPlaylists(data.result.content))
    .catch(console.error);
}

function renderPlaylists(playlists) {
  const grid = document.querySelector(".playlist-grid");
  const createBtn = document.querySelector(".create-new");
  grid.innerHTML = "";
  grid.appendChild(createBtn);

  // Lọc bỏ playlist bị archive
  const activePlaylists = playlists.filter((p) => !p.archive);

  activePlaylists.forEach((playlist) => {
    const item = document.createElement("div");
    item.className = "playlist-item";
    item.innerHTML = `
      ${
        playlist.image_url
          ? `<img class="playlist-thumb" src="${playlist.image_url}">`
          : `<div class="playlist-thumb"></div>`
      }
      <div class="playlist-info"><h3>${playlist.name}</h3></div>`;

    item.addEventListener("click", () => openPlaylist(playlist));
    grid.appendChild(item);
  });
}

function openPlaylist(playlist) {
  state.currentPlaylistId = playlist.id;
  document.querySelector(".playlist-container").style.display = "none";
  document.querySelector(".playlist-wrap").style.display = "flex";

  const infoBox = document.querySelector(".playlist-infomation");
  infoBox.querySelector(".cover").innerHTML = playlist.image_url
    ? `<img src="${playlist.image_url}" alt="cover">`
    : `<img src="https://img.icons8.com/ios/50/music-record.png" alt="default">`;

  infoBox.querySelector("h2").textContent = playlist.name;
  const [creatorEl, visibilityEl] = infoBox.querySelectorAll("p");
  creatorEl.textContent = `Tạo bởi ${playlist.creator || "Bạn"}`;
  visibilityEl.textContent = playlist.public ? "Công khai" : "Riêng tư";

  renderSongsInPlaylist(playlist.songs || []);
}

function clearModalInputs() {
  document.getElementById("playlistNameInput").value = "";
  document.getElementById("playlistImageInput").value = "";
}

async function createPlaylist() {
  const name = document.getElementById("playlistNameInput").value.trim();
  const img = document.getElementById("playlistImageInput").value.trim();
  if (!name) return alert("Vui lòng nhập tên playlist!");

  try {
    const res = await fetch("http://localhost:8080/playlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ name, image_url: img }),
    });
    if (!res.ok) throw new Error();
    loadPlaylists();
    document.getElementById("createPlaylistModal").style.display = "none";
    clearModalInputs();
    alert("Tạo playlist thành công!");
  } catch {
    alert("Có lỗi khi tạo playlist");
  }
}

async function fetchAllSongs() {
  try {
    const res = await fetch("http://localhost:8080/songs?size=100", {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    const data = await res.json();
    state.listSongs = data.result.content;
  } catch (err) {
    console.error("Lỗi khi tải danh sách bài hát:", err);
  }
}

async function renderSongsInPlaylist(songs) {
  const container = document.querySelector(".song-list");
  const empty = document.querySelector(".empty-message");
  container.innerHTML = "";

  if (!songs.length) {
    empty.style.display = "flex";
    container.style.display = "none";
    return;
  }

  empty.style.display = "none";
  container.style.display = "block";

  const allSongs = state.listSongs;

  songs.forEach((song) => {
    const full = allSongs.find((s) => s.id === song.songId);
    if (!full) return;

    const el = document.createElement("div");
    el.className = "song-row";
    el.innerHTML = `
      <div class="song-info">
        <img src="${
          full.imgUrl || "https://img.icons8.com/ios/50/music.png"
        }" />
        <div><p class="song-title">${full.title}</p><p class="song-artist">${
      full.artistName
    }</p></div>
      </div>
      <div class="song-album">${full.album || "—"}</div>
      <div class="song-duration">${full.duration || "00:00"}</div>
      <div class="song-actions">
        <button class="action-btn">⋮</button>
        <div class="dropdown-menu-playlist hidden"><button class="delete-btn">Xoá</button></div>
      </div>`;

    el.querySelector(".action-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      el.querySelector(".dropdown-menu-playlist").classList.toggle("show");
    });

    el.querySelector(".delete-btn").addEventListener("click", () =>
      removeSong(full.id)
    );

    el.querySelector(".song-info").addEventListener("click", () =>
      playerController.loadSongById(full.id)
    );
    container.appendChild(el);
  });
}

async function removeSong(id) {
  try {
    const response = await fetch(
      "http://localhost:8080/playlists/remove-song",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          playlistId: state.currentPlaylistId,
          songIds: [id],
        }),
      }
    );

    if (!response.ok) throw new Error("Xóa thất bại");
    alert("Đã xoá bài hát khỏi playlist");

    // Lấy lại toàn bộ playlist để tìm playlist hiện tại
    const updatedRes = await fetch("http://localhost:8080/playlists/me", {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });
    const data = await updatedRes.json();

    // Tìm playlist hiện tại theo ID
    const currentPlaylist = data.result?.content?.find(
      (pl) => pl.id === state.currentPlaylistId
    );

    if (!currentPlaylist) {
      console.error("Không tìm thấy playlist tương ứng");
      return;
    }

    // Render lại danh sách bài hát trong playlist hiện tại
    renderSongsInPlaylist(currentPlaylist.songs || []);
  } catch (err) {
    console.error("Lỗi khi xoá bài hát:", err);
    alert("Lỗi khi xoá bài hát");
  }
}

function showSuggestions() {
  const input = document
    .getElementById("song-search")
    .value.trim()
    .toLowerCase();
  const list = document.getElementById("suggestion-list");
  list.innerHTML = "";
  if (!input) return;

  const results = state.listSongs.filter(
    (s) =>
      s.title.toLowerCase().includes(input) ||
      s.artistName.toLowerCase().includes(input)
  );

  results.forEach((song) => {
    const item = document.createElement("div");
    item.className = "suggestion-item";
    item.innerHTML = `<div class="suggestion-info"><div class="suggestion-title">${song.title}</div><div class="suggestion-artist">${song.artistName}</div></div><button class="add-btn">Thêm</button>`;
    item
      .querySelector(".add-btn")
      .addEventListener("click", () => addSongToPlaylist(song.id));
    list.appendChild(item);
  });
}

async function addSongToPlaylist(songId) {
  try {
    // Gửi yêu cầu thêm bài hát vào playlist
    const response = await fetch("http://localhost:8080/playlists/add-songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({
        playlistId: state.currentPlaylistId,
        songIds: [songId],
      }),
    });

    if (!response.ok) throw new Error("Thêm thất bại");
    alert("Đã thêm bài hát vào playlist!");

    const input = document.getElementById("song-search");
    if (input) input.value = "";
    const list = document.getElementById("suggestion-list");
  list.innerHTML = "";

    // Lấy lại danh sách tất cả playlists
    const updatedRes = await fetch("http://localhost:8080/playlists/me", {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });
    const data = await updatedRes.json();

    // Tìm playlist hiện tại theo ID
    const currentPlaylist = data.result?.content?.find(
      (pl) => pl.id === state.currentPlaylistId
    );

    if (!currentPlaylist) {
      console.error("Không tìm thấy playlist tương ứng");
      return;
    }

    // Gọi lại hàm render với danh sách bài hát mới
    renderSongsInPlaylist(currentPlaylist.songs || []);
  } catch (error) {
    console.error("Lỗi thêm bài hát:", error);
    alert("Lỗi thêm bài hát!");
  }
}



