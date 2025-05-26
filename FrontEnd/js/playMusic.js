// player.js
const audio = document.getElementById("audio");
const playPauseBtn = document.querySelector(".playingSong__tool-playPause");
const nextBtn = document.querySelector(".playingSong__tool-next");
const prevBtn = document.querySelector(".playingSong__tool-previous");
const shuffleBtn = document.querySelector(".playingSong__tool-random");
const repeatBtn = document.querySelector(".playingSong__tool-again");

const currentTimeLabel = document.querySelector(
  ".playingSong__tool-currentTime"
);
const durationLabel = document.querySelector(".playingSong__tool-musicTime");
const seekBar = document.querySelector(".playingSong__tool-seekbar");
const volumeSlider = document.getElementById("volume-slider");

const titleEl = document.querySelector(".playingSong__title-name");
const artistEl = document.querySelector(".playingSong__title-singer");
const imageEl = document.getElementById("footer-song-image");

const expandLyricsBtn = document.getElementById("expand-lyrics-btn");
const lyricsPopup = document.getElementById("lyrics-popup");
const lyricsContainer = document.getElementById("lyrics-container");

let initialized = false;

const token = getCookie("authToken");

let isPlaying = false;
let currentSongIndex = 0;
let isShuffle = false;
let isRepeat = false;
let currentSongId = null;
let playlist = [];
let lyricsData = [];




function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Player control functions
function playSong() {
  audio.play();
  isPlaying = true;
  playPauseBtn.classList.remove("fa-play-circle");
  playPauseBtn.classList.add("fa-pause-circle");
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.classList.remove("fa-pause-circle");
  playPauseBtn.classList.add("fa-play-circle");
}

function nextSong() {
  if (isShuffle) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * playlist.length);
    } while (newIndex === currentSongIndex);
    currentSongIndex = newIndex;
  } else {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
  }
  loadSongByIndex(currentSongIndex);
  playSong();
}

function prevSong() {
  if (isShuffle) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * playlist.length);
    } while (newIndex === currentSongIndex);
    currentSongIndex = newIndex;
  } else {
    currentSongIndex =
      (currentSongIndex - 1 + playlist.length) % playlist.length;
  }
  loadSongByIndex(currentSongIndex);
  playSong();
}

function loadSongById(songId) {
  fetch(`http://localhost:8080/songs/${songId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((song) => {
      if (song && song.code === 1000) {
        const songData = song.result;
        audio.src = songData.audioUrl;
        titleEl.textContent = songData.title;
        artistEl.textContent = songData.artistName;
        imageEl.style.backgroundImage = `url('${songData.imgUrl}')`;
        imageEl.style.backgroundSize = "cover";
        imageEl.style.backgroundPosition = "center";
        currentSongId = songData.id;
        audio.onloadedmetadata = () => {
          playSong();
        };
      }
    });
}

function loadSongByIndex(index) {
  const song = playlist[index];
  if (!song) return;
  loadSongById(song.id);
}

function loadLyrics() {
  fetch(`http://localhost:8080/songs/${currentSongId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((song) => {
      lyricsData = song.result.lyrics;
      renderLyrics();
    });
}

function renderLyrics() {
  lyricsContainer.innerHTML = "";
  if (!lyricsData || lyricsData.length === 0) {
    lyricsContainer.innerHTML = `<p class="no-lyrics-message">Không có lời bài hát</p>`;
    return;
  }

  lyricsData.forEach((line, index) => {
    const lineWrapper = document.createElement("div");
    lineWrapper.classList.add("lyric-line");
    lineWrapper.dataset.time = line.time;

    const progress = document.createElement("div");
    progress.classList.add("lyric-progress");
    progress.dataset.index = index;

    const text = document.createElement("p");
    text.textContent = line.text;

    lineWrapper.appendChild(progress);
    lineWrapper.appendChild(text);
    lyricsContainer.appendChild(lineWrapper);

    lineWrapper.addEventListener("click", () => {
      audio.currentTime = line.timestamp;
      audio.play();
    });
  });
}

function initPlayer() {
  if (initialized) return;
  initialized = true;
  if (!token) {
    seekBar.disabled = true;
    seekBar.style.opacity = 0.5;
    seekBar.title = "Đăng nhập để tua bài hát";

    expandLyricsBtn.style.pointerEvents = "none";
    expandLyricsBtn.style.opacity = 0.5;
    expandLyricsBtn.title = "Đăng nhập để xem lời bài hát";

    shuffleBtn.style.pointerEvents = "none";
    shuffleBtn.style.opacity = 0.5;
    repeatBtn.style.pointerEvents = "none";
    repeatBtn.style.opacity = 0.5;

    nextBtn.style.pointerEvents = "none";
    nextBtn.style.opacity = 0.5;
    prevBtn.style.pointerEvents = "none";
    prevBtn.style.opacity = 0.5;
  }

  // Load playlist
  fetch("http://localhost:8080/songs", {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      playlist = data.result.content;
    });

  // Event listeners
 if (playPauseBtn)
    playPauseBtn.addEventListener("click", () =>
      isPlaying ? pauseSong() : playSong()
    );
  if (nextBtn) nextBtn.addEventListener("click", nextSong);
  if (prevBtn) prevBtn.addEventListener("click", prevSong);
  if (shuffleBtn)
    shuffleBtn.addEventListener("click", () => {
      isShuffle = !isShuffle;
      shuffleBtn.classList.toggle("active");
    });
  if (repeatBtn)
    repeatBtn.addEventListener("click", () => {
      isRepeat = !isRepeat;
      repeatBtn.classList.toggle("active");
    });
  if (seekBar)
    seekBar.addEventListener("input", () => {
      audio.currentTime = seekBar.value;
    });
  if (volumeSlider)
    volumeSlider.addEventListener("input", () => {
      audio.volume = volumeSlider.value / 100;
    });

  audio.addEventListener("loadedmetadata", () => {
    seekBar.max = audio.duration;
    durationLabel.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    seekBar.value = audio.currentTime;
    currentTimeLabel.textContent = formatTime(audio.currentTime);

    if (!lyricsData.length) return;

    let currentIndex = -1;
    const currentTime = audio.currentTime;
    lyricsData.forEach((line, index) => {
      if (currentTime >= line.timestamp) currentIndex = index;
    });

    const lines = document.querySelectorAll(".lyric-line");

    lines.forEach((lineEl, index) => {
      const progressBar = lineEl.querySelector(".lyric-progress");

      if (index === currentIndex) {
        const start = lyricsData[index].time;
        const end = lyricsData[index + 1]?.time || audio.duration;
        const percent = ((currentTime - start) / (end - start)) * 100;
        progressBar.style.width = `${percent}%`;
        lineEl.classList.add("active");
      } else {
        progressBar.style.width = `0%`;
        lineEl.classList.remove("active");
      }
    });

    const activeLine = document.querySelector(".lyric-line.active");
    if (activeLine) {
      activeLine.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  audio.addEventListener("ended", () => {
    if (isRepeat) {
      audio.currentTime = 0;
      playSong();
    } else {
      nextSong();
    }
  });

   if (expandLyricsBtn)
    expandLyricsBtn.addEventListener("click", () => {
      const isVisible = lyricsPopup.style.display === "flex";
      lyricsPopup.style.display = isVisible ? "none" : "flex";
      expandLyricsBtn.classList.toggle("active", !isVisible);
      if (!isVisible) loadLyrics(currentSongId);
    });
}

// Hàm lấy danh sách bài hát theo danh sách ID
async function fetchSongsByIds(songIds) {
  const songs = [];
  for (const id of songIds) {
    try {
      const res = await fetch(`http://localhost:8080/songs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data && data.code === 1000) songs.push(data.result);
    } catch (err) {
      console.error(`Lỗi lấy bài hát id=${id}`, err);
    }
  }
  return songs;
}

// Hàm set playlist mới và phát bài đầu tiên
async function playNewPlaylist(songIds) {
  if (!songIds || songIds.length === 0) {
    alert("Playlist này chưa có bài hát.");
    return;
  }
  playlist = await fetchSongsByIds(songIds);
  if (playlist.length === 0) {
    alert("Không tìm thấy bài hát nào trong playlist.");
    return;
  }
  currentSongIndex = 0;
  loadSongByIndex(currentSongIndex);
}

function getCurrentIdSong(){
  return currentSongId;
}




// Export các hàm nếu cần
export const playerController = {
  initPlayer,
  loadSongById,
  loadSongByIndex,
  loadLyrics,
  playSong,
  pauseSong,
  nextSong,
  prevSong,
  playNewPlaylist,
  fetchSongsByIds,
  getCurrentIdSong
};

