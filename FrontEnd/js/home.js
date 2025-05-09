// const token = getCookie('authToken');  // Lấy authToken từ cookie
fetch("http://localhost:8080/artists", {
  headers: {
    Authorization: `Bearer ${token}`, // Nếu API yêu cầu token
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    const container = document.getElementById("artist-list");

    // Giả sử data.result.content chứa danh sách nghệ sĩ
    const artists = data.result.content;

    // Chỉ lấy 5 nghệ sĩ đầu tiên
    const limitedArtists = artists.slice(0, 5);

    limitedArtists.forEach((artist) => {
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
  .catch((error) => {
    console.error("Lỗi khi tải dữ liệu nghệ sĩ:", error);
  });

async function loadShowcasePlaylists() {
  const container = document.querySelector(".playlist-showcase-content"); // Class mới để JS gọi
  container.innerHTML = ""; // Xoá cũ

  try {
    const response = await fetch("http://localhost:8080/playlists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Lỗi: ${response.status}`);

    const data = await response.json();
    const playlists = data.result.content;

    // Lấy 6 playlist mới nhất
    const latest6 = playlists.slice(0, 5);

    latest6.forEach((playlist) => {
      const card = document.createElement("div");
      card.classList.add("latest-english-card-container"); // Giữ nguyên class cũ cho CSS

      card.innerHTML = `
        <img src="${
          playlist.image_url || "https://img.icons8.com/ios/100/music.png"
        }" alt="cover">
        <p>${playlist.name}</p>
        
      `;

      card.addEventListener("click", () => {
        console.log("Click playlist", playlist);
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Lỗi khi tải playlist:", error);
  }
}



document.addEventListener("DOMContentLoaded", loadShowcasePlaylists);
