// Lấy id từ URL
const urlParams = new URLSearchParams(window.location.search);
const artistId = urlParams.get('id');




if (artistId) {
    fetch(`http://localhost:8080/artists/${artistId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        const artist = data.result; // Cấu trúc giả sử trả về

        // Cập nhật giao diện
        document.getElementById('artistName').innerText = artist.name;
        document.getElementById('artistAvatar').src = artist.imageUrl;
        document.getElementById('artistBanner').src = artist.bannerUrl || artist.imageUrl; // fallback nếu không có banner
        // document.getElementById('monthlyListeners').innerText = `${artist.monthlyListeners.toLocaleString()} người nghe hàng tháng`;

        // Nếu có bài hát
        const songList = document.getElementById('songList');
        songList.innerHTML = ''; // Xóa cứng danh sách mẫu cũ

        artist.songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'song-item';
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
            songList.appendChild(li);
        });

        loadRelatedArtists(artist.id);

    })
    .catch(error => {
        console.error('Lỗi khi tải thông tin nghệ sĩ:', error);
    });
} else {
    console.error('Không tìm thấy ID nghệ sĩ trên URL.');
}

// Hàm load nghệ sĩ liên quan
function loadRelatedArtists(currentArtistId) {
    fetch('http://localhost:8080/artists', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('DATA TRẢ VỀ:', data);
        const artists = data.result.content; // Giả sử API trả về { result: [...] }

        // Bỏ nghệ sĩ hiện tại
        const otherArtists = artists.filter(artist => artist.id !== currentArtistId);

        // Random lấy 4 nghệ sĩ
        const shuffled = otherArtists.sort(() => 0.5 - Math.random());
        const selectedArtists = shuffled.slice(0, 4);

        const artistList = document.querySelector('.artist-list');
        artistList.innerHTML = '';

        selectedArtists.forEach(artist => {
            const artistItem = document.createElement('div');
            artistItem.className = 'artist-item';
            artistItem.innerHTML = `
                <img src="${artist.imageUrl}" alt="${artist.name}">
                <span>${artist.name}</span>
            `;

            // Bấm vào nghệ sĩ khác thì nhảy trang
            artistItem.addEventListener('click', () => {
                window.location.href = `./artist.html?id=${artist.id}`;
            });

            artistList.appendChild(artistItem);
        });
    })
    .catch(error => {
        console.error('Lỗi khi tải nghệ sĩ liên quan:', error);
    });
}