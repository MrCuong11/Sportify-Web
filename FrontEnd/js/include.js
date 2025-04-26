document.addEventListener("DOMContentLoaded", () => {
    includeHTML("header", "./partials/header.html");
    // includeHTML("footer", "./partials/footer.html");
  });
  
  function includeHTML(id, file) {
    fetch(file)
      .then(res => res.text())
      .then(html => {
        document.getElementById(id).innerHTML = html;
      })
      .catch(err => console.error(`Lỗi khi tải ${file}:`, err));
  }
  