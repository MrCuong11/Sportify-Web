
  document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("favoriteSongsList");
    const audioPlayer = document.getElementById("audioPlayer");

    try {
      const token = getCookie("authToken"); // Giả sử bạn đã có hàm getCookie
      const res = await fetch("http://localhost:8080/favorite", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Không thể lấy dữ liệu bài hát");

      const data = await res.json();
      const songs = data.result.content;

      songs.forEach(song => {
        const item = document.createElement("div");
        item.className = "song-item";
        item.innerHTML = `
          <img src="${song.image_url || 'https://img.icons8.com/ios/100/music.png'}" alt="${song.title}" />
          <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
          </div>
          <div class="song-duration">${song.duration || '–:–'}</div>
        `;
        item.addEventListener("click", () => {
          audioPlayer.src = song.audio_url;
          audioPlayer.play();
        });
        container.appendChild(item);
      });
    } catch (error) {
      console.error("Lỗi khi tải danh sách bài hát:", error);
      container.innerHTML = "<p>Không thể tải danh sách bài hát.</p>";
    }
  });

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

