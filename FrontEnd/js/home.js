import { playerController } from "./playMusic.js"; // import đúng hàm

let playlist = [];
let currentSongIndex = 0; // khai báo biến index hiện tại

export function init() {
  loadShowcasePlaylists();
  loadNonVietnameseSongs();
  loadArtists();
  loadAllSongs();
  playerController.initPlayer();
}

function getSubFromToken(token) {
  if (!token) return null;
  try {
    // Token dạng: header.payload.signature
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;

    // Base64URL decode (thay - thành +, _ thành /)
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    // Giải mã base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.sub || null;
  } catch (e) {
    console.error("Lỗi giải mã token:", e);
    return null;
  }
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
}
const token = getCookie('authToken'); // hoặc token bạn có
const userName = getSubFromToken(token);
console.log("User ID (sub):", userName);



async function loadArtists() {
  const token = getCookie("authToken");
  try {
    const res = await fetch("http://localhost:8080/artists", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    const container = document.getElementById("artist-list");
    if (!container) return;

    container.innerHTML = ""; // Xoá nếu có nội dung cũ

    const artists = data.result.content.slice(0, 5);
    artists.forEach((artist) => {
      const artistHTML = `
        <div class="popular-artists-1-container">
          <div class="popular-artists-img1-container">
            <div class="popular-artists-img-wrapper">
              <img src="${artist.imageUrl}" alt="${artist.name}">
              <a href="#/artist?id=${artist.id}">
                <i class="fas popular-artists-play-btn fa-play"></i>
              </a>
            </div>
          </div>
          <p>${artist.name}</p>
        </div>
      `;
      container.innerHTML += artistHTML;
    });
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu nghệ sĩ:", error);
  }
}

async function loadShowcasePlaylists() {
  const container = document.querySelector(".playlist-showcase-content");
  if (!container) return;
  container.innerHTML = "";

  try {
    const token = getCookie("authToken");
    const res = await fetch("http://localhost:8080/playlists/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`Lỗi: ${res.status}`);

    const data = await res.json();

    // Lọc playlist không bị archive
    const playlists = data.result.content
      .filter((pl) => !pl.archive)
      .slice(0, 6);

    playlists.forEach((pl) => {
      const card = document.createElement("div");
      card.classList.add("latest-english-card-container");
      card.innerHTML = `
        <img src="${
          pl.image_url || "https://img.icons8.com/ios/100/music.png"
        }" alt="cover">
        <p>${pl.name}</p>
      `;
      card.addEventListener("click", async () => {
        try {
          // Gọi tất cả bài hát
          const songRes = await fetch("http://localhost:8080/songs", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!songRes.ok) throw new Error(`Lỗi: ${songRes.status}`);
          const allSongsData = await songRes.json();
          const allSongs = allSongsData.result.content; // Cấu trúc trả về danh sách bài hát

          // Lọc bài hát có id nằm trong playlist.songIds
          const playlistSongIds = pl.songs;

          const ids = playlistSongIds.map((obj) => obj.songId); // lấy id từ object
          playlist = allSongs.filter((song) => ids.includes(song.id));
          console.log(playlist);

          // Gọi hàm cập nhật queue
          renderQueue(playlist);
        } catch (err) {
          console.error("Lỗi khi tải danh sách bài hát:", err);
        }
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Lỗi khi tải playlist:", error);
  }
}

async function loadNonVietnameseSongs() {
  const token = getCookie("authToken");
  if (!token) {
    console.warn("Chưa đăng nhập, không thể tải bài hát nước ngoài");
    return;
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Lấy songs + countries cùng lúc
    const [songsRes, countriesRes] = await Promise.all([
      fetch("http://localhost:8080/songs?page=0&size=50", { headers }),
      fetch("http://localhost:8080/countries", { headers }),
    ]);

    if (!songsRes.ok || !countriesRes.ok)
      throw new Error("Lỗi khi tải dữ liệu bài hát hoặc quốc gia");

    const [songsData, countriesData] = await Promise.all([
      songsRes.json(),
      countriesRes.json(),
    ]);

    const songList = songsData.result.content;
    const countryList = countriesData.result;

    // Tìm id VN
    const vietnamCountry = countryList.find((c) => c.code === "viet-nam");
    const vietnamCountryId = vietnamCountry?.id;
    if (!vietnamCountryId) throw new Error("Không tìm thấy quốc gia Việt Nam!");

    // Lấy danh sách nghệ sĩ VN
    const vietnamArtistsRes = await fetch(
      `http://localhost:8080/countries/${vietnamCountryId}/with-artists`,
      { headers }
    );
    if (!vietnamArtistsRes.ok) throw new Error("Lỗi lấy nghệ sĩ VN");

    const vietnamArtistsData = await vietnamArtistsRes.json();
    const vietnameseArtistNames = vietnamArtistsData.result.artists.map(
      (a) => a.name
    );

    // Lọc bài không thuộc nghệ sĩ VN
    const nonVietnameseSongs = songList.filter(
      (song) => !vietnameseArtistNames.includes(song.artistName)
    );

    console.log("nonVietnameseSongs:", nonVietnameseSongs);

    const latestEnglishContent = document.getElementById(
      "latest-english-content"
    );
    if (!latestEnglishContent) return;

    latestEnglishContent.innerHTML = "";

    nonVietnameseSongs.slice(0, 6).forEach((song) => {
      const card = document.createElement("div");
      card.className = "latest-english-card-container";
      card.innerHTML = `
        <img src="${song.imgUrl}" alt="${song.title}" />
        <p>${song.title}</p>
      `;
      card.addEventListener("click", () => {
        playerController.loadSongById(song.id);
      });
      latestEnglishContent.appendChild(card);
    });
  } catch (error) {
    console.error("Lỗi khi load bài hát:", error);
  }
}

async function loadAllSongs() {
  const token = getCookie("authToken");
  try {
    const res = await fetch("http://localhost:8080/songs", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    playlist = data.result.content || [];
    renderQueue(playlist);
    renderLatestReleases();
  } catch (error) {
    console.error("Error loading playlist:", error);
  }
}

function renderQueue(playlists) {
  const queueContainer = document.querySelector(".queue-elements-container");
  if (!queueContainer) return;

  queueContainer.innerHTML = "";

  if (!Array.isArray(playlists)) {
    console.warn("playlist không phải mảng hoặc undefined", playlist);
    return;
  }

  playlists.forEach((song, index) => {
    const queueElement = document.createElement("div");
    queueElement.classList.add("queue-element");
    queueElement.innerHTML = `
      <div class="song-image-container">
        <p class="queue-number">${(index + 1).toString().padStart(2, "0")}</p>
        <div class="image-container">
          <img class="queue-song-img" src="${song.imgUrl}" />
          <i class="fas play-btn fa-play"></i>
        </div>
        <div class="song-and-artist-container">
          <p class="queue-song-name">${song.title}</p>
          <p class="queue-artist-name">${song.artistName}</p>
        </div>
      </div>
      <span class="nav-link">
        <button><i class="far wishlist-icon fa-heart"></i></button>
      </span>
    `;

    queueElement.addEventListener("click", () => {
      currentSongIndex = index;
      playerController.loadSongById(song.id);
      renderQueue(playlist);
    });

    queueContainer.appendChild(queueElement);
  });
}

function renderLatestReleases() {
  const cards = document.querySelectorAll(".latest-release-card");
  if (!cards.length) return;

  cards.forEach((card, index) => {
    const song = playlist[index];
    if (!song) return;

    const nameElement = card.querySelector(".song-name");
    if (nameElement) nameElement.textContent = song.title;

    const artistElement = card.querySelector(".date");
    if (artistElement) artistElement.textContent = song.artistName;

    const imgContainer = card.querySelector(".latest-release-img-container");
    if (imgContainer) {
      imgContainer.style.backgroundImage = `url('${song.imgUrl}')`;
      imgContainer.style.backgroundSize = "cover";
      imgContainer.style.backgroundPosition = "center";
    }

    const durationElement = card.querySelector(".time");
    if (durationElement) durationElement.textContent = song.duration;

    card.addEventListener("click", () => {
      currentSongIndex = index;
      playerController.loadSongByIndex(currentSongIndex);
      playerController.playSong();
    });
  });
}
