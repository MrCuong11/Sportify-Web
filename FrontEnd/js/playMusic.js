document.addEventListener("DOMContentLoaded", function () {
    const queueContainer = document.querySelector(".queue-elements-container");

    const audio = document.getElementById("audio");
    const playPauseBtn = document.querySelector(".playingSong__tool-playPause");
    const nextBtn = document.querySelector(".playingSong__tool-next");
    const prevBtn = document.querySelector(".playingSong__tool-previous");
    const shuffleBtn = document.querySelector(".playingSong__tool-random");
    const repeatBtn = document.querySelector(".playingSong__tool-again");

    const currentTimeLabel = document.querySelector(".playingSong__tool-currentTime");
    const durationLabel = document.querySelector(".playingSong__tool-musicTime");
    const seekBar = document.querySelector(".playingSong__tool-seekbar");
    const volumeSlider = document.getElementById("volume-slider");

    const titleEl = document.querySelector(".playingSong__title-name");
    const artistEl = document.querySelector(".playingSong__title-singer");
    const imageEl = document.getElementById("footer-song-image");

   

    let isPlaying = false;
    let currentSongIndex = 0;
    let isShuffle = false;
    let isRepeat = false;

    const playlist = [
        {
            name:'Những Lời Hứa Bỏ Quên',
            artist:' Vũ. ft Dear Jane ',
            src: './assets/music/nhungloihuaborquen.mp3',
            image: './assets/images/nhungloihuaborquen.jpg'
        },
        {
            name:'Bạn Đời',
            artist:' Karik ft GDucky ',
            src: './assets/music/bandoi.mp3',
            image: './assets/images/bandoi.jpg'
        },
        {
            name:'Dân Chơi Sao Phải Khóc',
            artist:' Ryhder ft Andree Right Hand ',
            src: './assets/music/danchoisaophaikhoc.mp3',
            image: './assets/images/song1.jpg'
        },
        {
            name:'Não Cá Vàng',
            artist:' Only C ft Lou Hoàng ',
            src: './assets/music/naocavang.mp3',
            image: './assets/images/naocavang.jpg'
        },
        {
            name:'Hư Không',
            artist:' Kha ',
            src: './assets/music/hukhong.mp3',
            image: './assets/images/hukhong.jpg'
        },
        {
            name:'Id 2022',
            artist:' Wn/ ',
            src: './assets/music/id2022.mp3',
            image: './assets/images/id.jpg'
        }
    ];

    function loadSong(index) {
        const song = playlist[index];
        audio.src = song.src;
        titleEl.textContent = song.name;
        artistEl.textContent = song.artist;
        imageEl.style.backgroundImage = `url('${song.image}')`;
        imageEl.style.backgroundSize = "cover";
        imageEl.style.backgroundPosition = "center";
    }

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
        loadSong(currentSongIndex);
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
            currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        }
        loadSong(currentSongIndex);
        playSong();
    }

    // Event Listeners
    playPauseBtn.addEventListener("click", () => isPlaying ? pauseSong() : playSong());
    nextBtn.addEventListener("click", nextSong);
    prevBtn.addEventListener("click", prevSong);

    shuffleBtn.addEventListener("click", () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle("active");
    });

    repeatBtn.addEventListener("click", () => {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle("active");
    });

    audio.addEventListener("loadedmetadata", function () {
        seekBar.max = audio.duration;
        durationLabel.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", function () {
        seekBar.value = audio.currentTime;
        currentTimeLabel.textContent = formatTime(audio.currentTime);
    });

    seekBar.addEventListener("input", function () {
        audio.currentTime = seekBar.value;
    });

    volumeSlider.addEventListener("input", function () {
        audio.volume = volumeSlider.value / 100;
    });

    // Tự động chuyển bài hoặc lặp lại
    audio.addEventListener("ended", function () {
        if (isRepeat) {
            audio.currentTime = 0;
            playSong();
        } else {
            nextSong();
        }
    });

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? "0" + sec : sec}`;
    };


    function renderQueue() {
        queueContainer.innerHTML = ""; // Xoá danh sách cũ

        playlist.forEach((song, index) => {
            const queueElement = document.createElement("div");
            queueElement.classList.add("queue-element");

            if (index === currentSongIndex) {
                queueElement.classList.add("currently-playing");
            }

            queueElement.innerHTML = `
                <div class="song-image-container">
                    <p class="queue-number">${(index + 1).toString().padStart(2, '0')}</p>
                    <div class="image-container">
                        <img class="queue-song-img" src="${song.image}" />
                        <i class="fas play-btn fa-play"></i>
                    </div>
                    <div class="song-and-artist-container">
                        <p class="queue-song-name">${song.name}</p>
                        <p class="queue-artist-name">${song.artist}</p>
                    </div>
                </div>
                <span class="nav-link">
                    <button><i class="far wishlist-icon fa-heart"></i></button>
                </span>
            `;

            queueElement.addEventListener("click", () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
                renderQueue(); // Cập nhật lại highlight
            });

            queueContainer.appendChild(queueElement);
        });
    }

    // Latest Release
    const cards = document.querySelectorAll(".latest-release-card");

    cards.forEach((card, index) => {
        const song = playlist[index];
        if (!song) return; // Tránh lỗi nếu số card > số bài hát

        // Set tên bài hát
        const nameElement = card.querySelector(".song-name");
        if (nameElement) nameElement.textContent = song.name;

        // Set nghệ sĩ
        const artistElement = card.querySelector(".date");
        if (artistElement) artistElement.textContent = song.artist;

        // Set ảnh nền cho khung ảnh
        const imgContainer = card.querySelector(".latest-release-img-container");
        if (imgContainer) {
            imgContainer.style.backgroundImage = `url('${song.image}')`;
            imgContainer.style.backgroundSize = 'cover';
            imgContainer.style.backgroundPosition = 'center';
        }

        const audio = new Audio(song.src);
        audio.addEventListener("loadedmetadata", () => {
            const durationElement = card.querySelector(".time");
            if (durationElement) {
                durationElement.textContent = formatTime(audio.duration);
            }
        });

        card.addEventListener("click", () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
            renderQueue();
        });

        
    });

   

  

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}



    


    loadSong(currentSongIndex); // Load bài đầu tiên
    renderQueue();
    // renderLatestReleases();


   

    let lyricsData = []; // Mảng chứa dữ liệu lời bài hát

    // Hàm tải và xử lý file JSON
    function loadLyrics() {
        fetch('./assets/lyrics/nhungloihuaborquen.json')
            .then(response => response.json())
            .then(data => {
                lyricsData = data;
                renderLyrics();
            })
            .catch(error => console.error("Error loading lyrics JSON:", error));
    }
    
    // Hàm render lời bài hát ra popup
    function renderLyrics() {
        const lyricsContainer = document.getElementById("lyrics-container");
        lyricsContainer.innerHTML = "";
    
        lyricsData.forEach((line, index) => {
            const lineWrapper = document.createElement("div");
            lineWrapper.classList.add("lyric-line");
            lineWrapper.dataset.time = line.time; // Thêm data-time để xử lý click sau
    
            const progress = document.createElement("div");
            progress.classList.add("lyric-progress");
            progress.dataset.index = index;
    
            const text = document.createElement("p");
            text.textContent = line.text;
    
            lineWrapper.appendChild(progress);
            lineWrapper.appendChild(text);
            lyricsContainer.appendChild(lineWrapper);
    
            // Bắt sự kiện click để tua bài hát
            lineWrapper.addEventListener("click", () => {
                audio.currentTime = line.time;
                audio.play(); // Có thể tuỳ chọn play luôn hoặc không
            });
        });
    }
    
    
    // Đồng bộ lời bài hát theo thời gian audio
    audio.addEventListener("timeupdate", function () {
        if (!lyricsData.length) return;
    
        const currentTime = audio.currentTime;
        let currentIndex = -1;
    
        lyricsData.forEach((line, index) => {
            if (currentTime >= line.time) {
                currentIndex = index;
            }
        });
    
        const lines = document.querySelectorAll(".lyric-line");
    
        lines.forEach((lineEl, index) => {
            const progressBar = lineEl.querySelector(".lyric-progress");
    
            if (index === currentIndex) {
                const start = lyricsData[index].time;
                const end = (lyricsData[index + 1]?.time) || audio.duration;
                const duration = end - start;
                const percent = ((currentTime - start) / duration) * 100;
    
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
    
    // Xử lý mở popup lyrics
    const lyricsPopup = document.getElementById("lyrics-popup");
const expandLyricsBtn = document.getElementById("expand-lyrics-btn");

expandLyricsBtn.addEventListener("click", () => {
    const isVisible = lyricsPopup.style.display === "flex";

    if (isVisible) {
        lyricsPopup.style.display = "none";
    } else {
        lyricsPopup.style.display = "flex";
        loadLyrics(); // Tải lyrics khi mở
    }

    expandLyricsBtn.classList.toggle("active", !isVisible);

});

    


    
    
    
});
