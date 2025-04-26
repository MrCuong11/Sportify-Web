document.querySelector('.btn-create-playlist').addEventListener('click', () => {
    const form = document.getElementById('new-playlist-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  });
  
  document.getElementById('submit-playlist').addEventListener('click', () => {
    const name = document.getElementById('playlist-name').value.trim();
    const desc = document.getElementById('playlist-desc').value.trim();
    const img = document.getElementById('playlist-image').value.trim();
  
    if (!name || !img) {
      alert('Vui lòng nhập tên và ảnh playlist.');
      return;
    }
  
    const playlistContainer = document.querySelector('.playlist-list');
  
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.innerHTML = `
      <img src="${img}" alt="${name}" />
      <div class="playlist-info">
        <h3>${name}</h3>
        <p>${desc || 'Không có mô tả'}</p>
      </div>
    `;
  
    playlistContainer.appendChild(card);
  
    // Reset form
    document.getElementById('playlist-name').value = '';
    document.getElementById('playlist-desc').value = '';
    document.getElementById('playlist-image').value = '';
    document.getElementById('new-playlist-form').style.display = 'none';
  });

  // Khi click vào playlist-card thì toggle phần chi tiết
  document.querySelectorAll('.playlist-card').forEach(card => {
    card.addEventListener('click', function () {
      const detail = card.querySelector('.playlist-detail');
      detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
    });
  });

 