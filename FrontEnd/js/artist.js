import { playerController } from "./playMusic.js";

const token = getCookie("authToken");

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export const artistController = {
  init,
};

function init() {
  // Load lần đầu
  loadArtistById();

  playerController.initPlayer();

  // Khi URL hash thay đổi, tự load lại
  window.addEventListener("hashchange", loadArtistById);
}

function getArtistIdFromHash() {
  const hash = window.location.hash; // '#/artist?id=...'
  const hashParts = hash.split("?");
  if (hashParts.length > 1) {
    const params = new URLSearchParams(hashParts[1]);
    return params.get("id");
  }
  return null;
}

function loadArtistById() {
  const artistId = getArtistIdFromHash();
  if (!artistId) {
    console.error("Không tìm thấy artistId trong URL.");
    return;
  }

  fetchArtistDetails(artistId);
  loadRelatedArtists(artistId);
}

function fetchArtistDetails(artistId) {
  fetch(`http://localhost:8080/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const artist = data.result;

      document.getElementById("artistName").innerText = artist.name;
      document.getElementById("artistAvatar").src = artist.imageUrl;
      document.getElementById("artistBanner").src =
        artist.bannerUrl || artist.imageUrl;

      const songList = document.getElementById("songList");
      songList.innerHTML = "";

      artist.songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.className = "song-item";
        li.innerHTML = `
          <div class="song-index">${index + 1}</div>
          <div class="song-info">
            <p class="song-title">${song.title}</p>
            <p class="song-duration">${song.duration}</p>
          </div>
          <div class="song-actions">
            <i class="far fa-heart"></i>
            <i class="fas fa-ellipsis-h"></i>
          </div>
        `;

        li.addEventListener("click", () => {
          playerController.loadSongById(song.id);
        });

        songList.appendChild(li);
      });
    })
    .catch((err) => console.error("Lỗi khi tải nghệ sĩ:", err));
}

function loadRelatedArtists(currentArtistId) {
  fetch("http://localhost:8080/artists", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const artists = data.result.content;
      const otherArtists = artists.filter((a) => a.id !== currentArtistId);
      const selected = otherArtists.sort(() => 0.5 - Math.random()).slice(0, 4);

      const artistList = document.querySelector(".artist-list");
      artistList.innerHTML = "";

      selected.forEach((artist) => {
        const div = document.createElement("div");
        div.className = "artist-item";
        div.innerHTML = `
          <img src="${artist.imageUrl}" alt="${artist.name}">
          <span>${artist.name}</span>
        `;
        div.addEventListener("click", () => {
          window.location.hash = `#/artist?id=${artist.id}`;
        });
        artistList.appendChild(div);
      });
    })
    .catch((err) => console.error("Lỗi nghệ sĩ liên quan:", err));
}

artistController.init();
