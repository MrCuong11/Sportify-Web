fetch('./data/artists.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('artist-list');

    data.forEach(artist => {
      const artistHTML = `
        <div class="popular-artists-1-container">
          <div class="popular-artists-img1-container">
            <div class="popular-artists-img-wrapper">
              <img src="${artist.imageUrl}" style="" alt="${artist.name}">
              <a href="${artist.link}">
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