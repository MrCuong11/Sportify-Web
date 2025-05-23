// scripts/router.js
import Navigo from 'https://cdn.jsdelivr.net/npm/navigo@8.11.1/+esm';

const router = new Navigo('/', { hash: true });
const app = document.getElementById('app');

// Tải HTML + JS tương ứng

async function loadPage(pageName) {
  try {
    const res = await fetch(`pages/${pageName}.html`);
    const html = await res.text();
    app.innerHTML = html;

    // Đảm bảo DOM đã thay xong mới gọi JS
    try {
      const module = await import(`./${pageName}.js`);
      console.log("✅ Imported module:", module);
      if (typeof module.init === 'function') {
        module.init(); // Gọi init() để chạy code sau khi page đã vào DOM
      }
    } catch (err) {
      console.warn(`Không tìm thấy js/${pageName}.js`, err);
    }
  } catch (e) {
    app.innerHTML = `<h2>404 - Page not found</h2>`;
  }
}

// Khai báo route
router.on({
  home: async () => await loadPage('home'),
  artist: async () => await loadPage('artist'),
  playlist: async () => await loadPage('playlist'),
  favorite: async () => await loadPage('favorite'),
 
});
router.notFound(() => {
  router.navigate('/home'); // Hoặc loadPage('404')
}); 
if (!location.hash) {
  router.navigate('/home'); // Gắn hash nếu chưa có
} else {
  router.resolve(); // Xử lý route nếu đã có
}
