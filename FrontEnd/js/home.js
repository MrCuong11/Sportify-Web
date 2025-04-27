// const token = getCookie('authToken');  // Lấy authToken từ cookie

fetch('http://localhost:8080/artists', { 
  headers: {
    'Authorization': `Bearer ${token}`,  // Nếu API yêu cầu token
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
    const container = document.getElementById('artist-list');

    // Giả sử data.result.content chứa danh sách nghệ sĩ
    const artists = data.result.content;

    // Chỉ lấy 5 nghệ sĩ đầu tiên
    const limitedArtists = artists.slice(0, 5); 

    limitedArtists.forEach(artist => {
      const artistHTML = `
        <div class="popular-artists-1-container">
          <div class="popular-artists-img1-container">
            <div class="popular-artists-img-wrapper">
              <img src="${artist.imageUrl}" alt="${artist.name}">
              <a href="./pages/artist.html?id=${artist.id}">
                <i class="fas popular-artists-play-btn fa-play"></i>
              </a>
            </div>
          </div>
          <p>${artist.name}</p>
        </div>
      `;
      container.innerHTML += artistHTML;
    });
  })
  .catch(error => {
    console.error('Lỗi khi tải dữ liệu nghệ sĩ:', error);
  });
