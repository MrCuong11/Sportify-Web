import { playerController } from "./playMusic.js";

const token = playerController.getCookie("authToken");


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
      console.log(artist.songs);

      artist.songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.className = "song-item";
        li.innerHTML = `
          <div class="song-index">${index + 1}</div>
          <div class="song-info">
            <p class="song-title">${song.title}</p>
            </div>
            <p class="song-duration">${song.duration}</p>
          <div class="song-actions">
            <i class="favorite-btn far fa-heart"></i>
            <i class="fas fa-ellipsis-h"></i>
          </div>
        `;

        li.addEventListener("click", () => {
          playerController.loadSongById(song.id);
        });

        li.querySelector(".favorite-btn").addEventListener("click", (e) => {
          e.stopPropagation(); // Tránh trigger click play
          addToFavorites(song.id);
        });

        songList.appendChild(li);
      });
      const playButton = document.querySelector(".play-button");

      if (playButton) {
        playButton.onclick = () => {

          const ids = artist.songs.map((obj) => obj.id);
          playerController.playNewPlaylist(ids);
          // if (artist.songs.length > 0) {
          //   // playerController.fetchSongsByIds(artist.songs.id);
          //   let index = 0;

          //   const playNext = () => {
          //     if (index < artist.songs.length) {
          //       const songId = artist.songs[index].id;
          //       playerController.loadSongById(songId);
          //       index++;
          //     } else {
          //       audio.removeEventListener("ended", playNext);
          //     }
          //   };

          //   // Đảm bảo lấy đúng phần tử audio do player.js dùng
          //   const audio = document.getElementById("audio");

          //   // Gán sự kiện khi bài hát kết thúc
          //   audio.addEventListener("ended", playNext);

          //   // Phát bài đầu tiên
          //   playNext();
          // }
        };
      }
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

function addToFavorites(songId) {
  
  if (!token) {
    alert("Vui lòng đăng nhập để thêm vào yêu thích!");
    return;
  }

  fetch(`http://localhost:8080/favorites/${songId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.ok) {
        alert("Đã thêm vào danh sách yêu thích!");
      } else {
        alert("Không thể thêm vào yêu thích.");
      }
    })
    .catch((err) => {
      console.error("Lỗi khi thêm vào favorites:", err);
      alert("Có lỗi xảy ra.");
    });
}

artistController.init();
