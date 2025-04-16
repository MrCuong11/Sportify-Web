
  function toggleDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }

  // Ẩn dropdown nếu click ra ngoài
  window.addEventListener('click', function (e) {
    const dropdown = document.getElementById('profileDropdown');
    const profilePhoto = document.querySelector('.profile-photo');
    if (!profilePhoto.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });

