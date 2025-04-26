document.addEventListener("DOMContentLoaded", () => {
    const favoriteSongs = [
      {
        title: "Peaches",
        artist: "Justin Bieber",
        image: "https://i.scdn.co/image/ab67616d00001e02c4f0f0e565ccf1c2f36b3a8b",
        duration: "3:18"
      },
      {
        title: "Levitating",
        artist: "Dua Lipa",
        image: "https://i.scdn.co/image/ab67616d00001e02f3e4c414fdaebbc3e7352f2b",
        duration: "3:23"
      },
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        image: "https://i.scdn.co/image/ab67616d00001e02b91d3e1f7b6abf539076b5d1",
        duration: "3:20"
      }
    ];
  
    const container = document.getElementById("favoriteSongsList");
  
    favoriteSongs.forEach(song => {
      const item = document.createElement("div");
      item.className = "song-item";
      item.innerHTML = `
        <img src="${song.image}" alt="${song.title}" />
        <div class="song-info">
          <div class="song-title">${song.title}</div>
          <div class="song-artist">${song.artist}</div>
        </div>
        <div class="song-duration">${song.duration}</div>
      `;
      container.appendChild(item);
    });
  });
  