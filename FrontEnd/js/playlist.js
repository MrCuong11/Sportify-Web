const createPlaylistBtn = document.getElementById('create-playlist-btn');
const noPlaylistSection = document.getElementById('no-playlist-section');
const playlistSection = document.getElementById('playlist-section');
const searchInput = document.getElementById('search-song-input');
const searchResults = document.getElementById('search-results');
const songsTableBody = document.querySelector('#songs-table tbody');
const toast = document.getElementById('toast');
const savePlaylistBtn = document.getElementById('save-playlist-btn');  // Nút lưu playlist

let currentPlaylist = [];
let allSongs = [];  // Mảng chứa tất cả bài hát

// Khi ấn tạo playlist
createPlaylistBtn.addEventListener('click', () => {
  noPlaylistSection.style.display = 'none';
  playlistSection.style.display = 'block';
});

// Gọi API lấy tất cả bài hát (chỉ cần gọi 1 lần)
async function fetchAllSongs() {
  try {
    const response = await fetch('http://localhost:8080/songs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Gửi token
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    allSongs = data.result.content;  // Lưu tất cả bài hát vào mảng allSongs
    console.log("Tất cả bài hát:", allSongs);  // Kiểm tra xem có đúng không
  } catch (error) {
    console.error('Error fetching songs:', error);
  }
}

// Lọc bài hát theo từ khóa tìm kiếm
function filterSongs(query) {
  return allSongs.filter(song => {
    return song.title.toLowerCase().includes(query.toLowerCase());  // So sánh tên bài hát với query
  });
}

// Gọi API lấy tất cả bài hát khi load trang
fetchAllSongs();

// Khi người dùng gõ trong ô tìm kiếm
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  
  if (!query) {
    searchResults.innerHTML = '';  // Nếu không có query, không hiển thị kết quả tìm kiếm
    return;
  }

  // Lọc tất cả bài hát theo query
  const filteredSongs = filterSongs(query);
  renderSearchResults(filteredSongs);  // Render kết quả tìm kiếm
});

// Render kết quả tìm kiếm
function renderSearchResults(songs) {
  searchResults.innerHTML = songs.map(song => `
    <div data-id="${song.id}" data-title="${song.title}" data-artist="${song.artist}" data-duration="${song.duration}">
      <h3>${song.title}</h3>
      <p>${song.artist} - ${song.duration || 'Unknown Duration'}</p>  <!-- Thêm điều kiện cho duration -->
    </div>
  `).join('');
}

// Khi ấn vào bài hát gợi ý
searchResults.addEventListener('click', (e) => {
  const songDiv = e.target.closest('div');
  if (!songDiv) return;

  const id = songDiv.dataset.id;
  const title = songDiv.dataset.title;
  const artist = songDiv.dataset.artist;
  const duration = songDiv.dataset.duration;

  currentPlaylist.push({ id, title, artist, duration });
  renderPlaylist();
  searchInput.value = '';
  searchResults.innerHTML = '';
  showToast('Đã thêm vào playlist!');
});

// Render bảng playlist
function renderPlaylist() {
  songsTableBody.innerHTML = currentPlaylist.map((song, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${song.title}</td>
      <td>${song.artist}</td>  <!-- Sửa từ artistName thành artist -->
      <td>${song.duration || 'Unknown Duration'}</td>  <!-- Thêm điều kiện cho duration -->
      <td><button onclick="deleteSong(${index})">Xóa</button></td>
    </tr>
  `).join('');
}

// Xóa bài hát
function deleteSong(index) {
  currentPlaylist.splice(index, 1);
  renderPlaylist();
  showToast('Đã xóa bài hát khỏi playlist');
}

// Lưu Playlist vào DB
savePlaylistBtn.addEventListener('click', async () => {
  try {
    const playlistData = currentPlaylist.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      duration: song.duration
    }));

    const response = await fetch('http://localhost:8080/albums', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,  // Gửi token
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ songs: playlistData })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Playlist saved successfully:', data);
    showToast('Playlist đã được lưu!');
    // Clear playlist or perform other actions after saving.
  } catch (error) {
    console.error('Error saving playlist:', error);
    showToast('Lỗi khi lưu playlist!');
  }
});

// Toast thêm bài hát
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}
