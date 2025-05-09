const createBtn = document.getElementById("createPlaylistBtn");
const modal = document.getElementById("createPlaylistModal");
const cancelBtn = document.getElementById("cancelCreateBtn");
const confirmBtn = document.getElementById("confirmCreateBtn");
const backBtn = document.getElementById("backToPlaylistsBtn");
const playlistGrid = document.querySelector(".playlist-grid");
const songSearchInput = document.getElementById("song-search");
const suggestedList = document.querySelector(".suggestion-list");

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const dropdownDelete = document.querySelector('.menu-dropdown-delete');
  const deleteBtnImg = document.querySelector('.delete-playlist-btn');

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownDelete.style.display = dropdownDelete.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', () => {
    dropdownDelete.style.display = 'none';
  });

  deleteBtnImg.addEventListener('click', () => {
    const confirmDelete = confirm('Bạn có chắc muốn xóa playlist này không?');
    if (!confirmDelete) return;

// bạn thay bằng id thật

    fetch(`http://localhost:8080/playlists/${window.currentPlaylistId}/archive`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (res.ok) {
        alert('Đã xóa playlist thành công!');
        window.history.back();
      } else {
        alert('Xóa không thành công.');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Có lỗi xảy ra khi xóa.');
    });
  });
});


function renderPlaylists(playlists) {
  // Xóa hết các item cũ (chừa nút tạo mới)
  const createNewBtn = document.querySelector(".create-new");
  playlistGrid.innerHTML = ""; // Xóa toàn bộ
  playlistGrid.appendChild(createNewBtn); // Chèn lại nút tạo mới
  // console.log(playlists);

  playlists.forEach((playlist) => {
     

    const item = document.createElement("div");
    item.classList.add("playlist-item");

    // Tạo ảnh (nếu có), nếu không thì div trống
    let thumbHTML = "";
    if (playlist.image_url) {
      thumbHTML = `<img class="playlist-thumb" src="${playlist.image_url}" alt="">`;
    } else {
      thumbHTML = `<div class="playlist-thumb"></div>`;
    }

    item.innerHTML = `
      ${thumbHTML}
      <div class="playlist-info">
        <h3>${playlist.name}</h3>
        
      </div>
    `;

    // Khi click vào playlist
    item.addEventListener("click", () => {
      window.currentPlaylistId = playlist.id;
      // 1. Ẩn danh sách playlist, hiện phần chi tiết
      document.querySelector(".playlist-container").style.display = "none";
      document.querySelector(".playlist-wrap").style.display = "flex";

      // 2. Gán thông tin playlist vào .playlist-infomation
      const infoBox = document.querySelector(".playlist-infomation");
      const coverDiv = infoBox.querySelector(".cover");
      const nameEl = infoBox.querySelector("h2");
      const creatorEl = infoBox.querySelectorAll("p")[0];
      const visibilityEl = infoBox.querySelectorAll("p")[1];

      // Cập nhật ảnh bìa
      coverDiv.innerHTML = playlist.image_url
        ? `<img src="${playlist.image_url}" alt="cover">`
        : `<img src="https://img.icons8.com/ios/50/music-record.png" alt="default">`;

      // Cập nhật thông tin
      nameEl.textContent = playlist.name;
      creatorEl.textContent = `Tạo bởi ${playlist.creator || "Bạn"}`;
      visibilityEl.textContent = playlist.public ? "Công khai" : "Riêng tư";

      // 3. Gọi API để lấy danh sách bài hát (nếu có endpoint)

      const songs = playlist.songs || [];
      console.log(songs);
      renderSongsInPlaylist(songs);
    });

    playlistGrid.appendChild(item);
  });
}

// Hàm fetch từ API
function loadPlaylists() {
  fetch("http://localhost:8080/playlists", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Lỗi: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      renderPlaylists(data.result.content);
    })
    .catch((err) => {
      console.error("Lỗi khi tải playlist:", err);
    });
}

// Gọi khi trang load
document.addEventListener("DOMContentLoaded", loadPlaylists);

createBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
  clearModalInputs();
});

confirmBtn.addEventListener("click", async () => {
  const name = document.getElementById("playlistNameInput").value.trim();
  const imgLink = document.getElementById("playlistImageInput").value.trim();

  if (!name) {
    alert("Vui lòng nhập tên playlist!");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/playlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        image_url: imgLink,
      }),
    });

    if (!response.ok) {
      const text = await response.text(); // lấy lỗi cụ thể
      throw new Error(`Lỗi: ${response.status} - ${text}`);
    }

    // const newPlaylist = await response.json();

    // Thêm vào UI (sử dụng response trả về từ server nếu cần)
    // addNewPlaylist(newPlaylist.name, newPlaylist.image_url);

    loadPlaylists();

    modal.style.display = "none";
    clearModalInputs();
    alert("Tạo playlist thành công!");
  } catch (error) {
    console.error(error);
    alert("Có lỗi khi tạo playlist: " + error.message);
  }
});

// Hàm thêm playlist mới (hiện tại thêm giả vào grid)
function addNewPlaylist(name, imgLink) {
  const grid = document.querySelector(".playlist-grid");
  const item = document.createElement("div");
  item.className = "playlist-item";

  item.innerHTML = `
    ${
      imgLink
        ? `<img class="playlist-thumb" src="${imgLink}" alt="">`
        : `<div class="playlist-thumb"></div>`
    }
    <div class="playlist-info">
      <h3>${name}</h3>
      <p>Bạn</p>
    </div>
  `;

  // Thêm vào lưới
  grid.appendChild(item);
}

function clearModalInputs() {
  document.getElementById("playlistNameInput").value = "";
  document.getElementById("playlistImageInput").value = "";
}

backBtn.addEventListener("click", function () {
  document.querySelector(".playlist-container").style.display = "block";
  document.querySelector(".playlist-wrap").style.display = "none";
});

let listSongs = [];
async function fetchAllSongs() {
  try {
    const response = await fetch("http://localhost:8080/songs?size=100", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi: ${response.status}`);
    }

    const data = await response.json();
    listSongs = data.result.content;
    return data.result.content || []; // giả sử dữ liệu nằm trong result.content
  } catch (error) {
    console.error("Lỗi khi tải danh sách bài hát:", error);
    return [];
  }
}

async function renderSongsInPlaylist(songsInPlaylist) {
  const emptyMessage = document.querySelector(".empty-message");
  const songListContainer = document.querySelector(".song-list");

  // Clear nội dung cũ
  songListContainer.innerHTML = "";

  if (!songsInPlaylist || songsInPlaylist.length === 0) {
    emptyMessage.style.display = "flex";
    songListContainer.style.display = "none";
    return;
  }

  emptyMessage.style.display = "none";
  songListContainer.style.display = "block";

  // Giả sử bạn đã có allSongs từ API
  const allSongs = await fetchAllSongs();
  console.log("allSongs", allSongs); // Tự viết hàm này

  songsInPlaylist.forEach((playlistSong) => {
    const fullSong = allSongs.find((s) => s.id === playlistSong.songId);
    console.log("fullSong:", fullSong);
    if (!fullSong) return;

    const songItem = document.createElement("div");

    songItem.classList.add("song-row");
    songItem.innerHTML = `
      <div class="song-info">
        <img src="${
          fullSong.imgUrl || "https://img.icons8.com/ios/50/music.png"
        }" alt="thumb" />
        <div>
          <p class="song-title">${fullSong.title}</p>
          <p class="song-artist">${fullSong.artistName || "Không rõ"}</p>
        </div>
      </div>
      <div class="song-album">${fullSong.album || "—"}</div>
      <div class="song-duration">${fullSong.duration || "00:00"}</div>
      <div class="song-actions">
        <button class="action-btn">⋮</button>
        <div class="dropdown-menu-playlist hidden">
          <button class="delete-btn">Xoá</button>
        </div>
      </div>
    `;
    // Trong renderSongsInPlaylist — thêm đoạn này vào ngay sau khi tạo songItem
    const actionBtn = songItem.querySelector(".action-btn");
    const dropdown = songItem.querySelector(".dropdown-menu-playlist");
    const deleteBtn = songItem.querySelector(".delete-btn");

    // Toggle dropdown
    actionBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    // Click ngoài thì ẩn menu (để trong vòng lặp sẽ thêm cho từng bài hát)
    document.addEventListener("click", () => {
      dropdown.classList.remove("show");
    });

    // Xoá bài hát khỏi playlist
    deleteBtn.addEventListener("click", async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/playlists/remove-song",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              playlistId: window.currentPlaylistId,
              songIds: [fullSong.id],
            }),
          }
        );

        if (!response.ok) throw new Error("Xoá thất bại");

        alert("Đã xoá bài hát khỏi playlist");

        // Reload lại danh sách bài hát
        const updated = await fetch("http://localhost:8080/playlists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedPlaylist = await updated.json();

        const currentPlaylist = updatedPlaylist.result?.content?.find(
          (pl) => pl.id === window.currentPlaylistId
        );

        const songs = currentPlaylist?.songs || [];
        renderSongsInPlaylist(songs);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi xoá bài hát");
      }
    });

    songListContainer.appendChild(songItem);
  });
}

const searchInput = document.getElementById("song-search");
const suggestionList = document.getElementById("suggestion-list");
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase().trim();
  suggestionList.innerHTML = "";

  if (!keyword) return;

  const filtered = listSongs.filter((song) => {
    return (
      song.title.toLowerCase().includes(keyword) ||
      song.artistName.toLowerCase().includes(keyword)
    );
  });

  filtered.forEach((song) => {
    const item = document.createElement("div");
    item.classList.add("suggestion-item");

    item.innerHTML = `
      <div class="suggestion-info">
        <div class="suggestion-title">${song.title}</div>
        <div class="suggestion-artist">${song.artistName}</div>
      </div>
      <button class="add-btn">Thêm</button>
    `;

    // Bắt sự kiện nút thêm
    item.querySelector(".add-btn").addEventListener("click", () => {
      addSongToPlaylist(song.id);
      songSearchInput.value = "";
      if (suggestedList) {
        suggestedList.innerHTML = "";
        suggestedList.classList.add("hidden"); // hoặc dùng style.display = "none"
      }
    });

    suggestionList.appendChild(item);
  });
});

// Hàm thêm bài hát vào playlist
async function addSongToPlaylist(songId) {
  try {
    const response = await fetch("http://localhost:8080/playlists/add-songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        playlistId: window.currentPlaylistId,
        songIds: [songId],
      }),
    });

    if (!response.ok) throw new Error("Thêm thất bại");
    alert("Đã thêm bài hát vào playlist!");

    // Lấy lại toàn bộ playlist
    const updated = await fetch("http://localhost:8080/playlists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const updatedPlaylist = await updated.json();

    // ✅ Tìm playlist có ID trùng với window.currentPlaylistId
    const currentPlaylist = updatedPlaylist.result?.content?.find(
      (pl) => pl.id === window.currentPlaylistId
    );

    if (!currentPlaylist) {
      console.error("Không tìm thấy playlist tương ứng");
      return;
    }

    // ✅ Gọi lại render với danh sách bài hát mới
    const songs = currentPlaylist.songs || [];

    renderSongsInPlaylist(songs);
  } catch (error) {
    console.error("Lỗi thêm bài hát:", error);
    alert("Lỗi thêm bài hát!");
  }
}

// Gọi ban đầu để lấy danh sách bài hát
fetchAllSongs();
const songItem = document.querySelector("song-row");
const actionBtn = songItem.querySelector(".action-btn");
const dropdown = songItem.querySelector(".dropdown-menu-playlist");

actionBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("show");
});

// Bấm ra ngoài thì ẩn menu
document.addEventListener("click", () => {
  dropdown.classList.remove("show");
});

// Xoá bài hát khỏi playlist
const deleteBtn = songItem.querySelector(".delete-btn");
deleteBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/playlists/remove-song",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          playlistId: window.currentPlaylistId,
          songIds: [fullSong.id],
        }),
      }
    );

    if (!response.ok) throw new Error("Xoá thất bại");

    alert("Đã xoá bài hát khỏi playlist");

    // Reload lại danh sách bài hát
    loadPlaylistSongs(window.currentPlaylistId);
  } catch (err) {
    console.error(err);
    alert("Lỗi khi xoá bài hát");
  }
});




