// public/js/masonry.js
// Fetches the photo list, shuffles it, builds <img> tags, then lays out masonry columns

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function layoutMasonry() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  const items = Array.from(gallery.querySelectorAll('img'));

  let cols = 3;
  if (window.innerWidth <= 600) cols = 1;
  else if (window.innerWidth <= 900) cols = 2;

  gallery.innerHTML = '';
  const columns = [];
  const heights = [];
  for (let i = 0; i < cols; i++) {
    const col = document.createElement('div');
    col.className = 'masonry-column';
    gallery.appendChild(col);
    columns.push(col);
    heights.push(0);
  }

  const gap = 16;
  const colWidth = gallery.clientWidth / cols;

  items.forEach(img => {
    let shortest = 0;
    for (let i = 1; i < cols; i++) {
      if (heights[i] < heights[shortest]) shortest = i;
    }
    columns[shortest].appendChild(img);

    let ratio = 0.75;
    if (img.naturalWidth > 0) {
      ratio = img.naturalHeight / img.naturalWidth;
    } else if (img.getAttribute('width') && img.getAttribute('height')) {
      ratio = parseInt(img.getAttribute('height')) / parseInt(img.getAttribute('width'));
    }
    heights[shortest] += colWidth * ratio + gap;
  });
}

async function buildGallery() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  // Load the list Python generated
  const response = await fetch('data/home-photos.json');
  const photos = await response.json();

  // Random order each visit
  shuffle(photos);

    // Watch for photos entering the screen, fade them in then
    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.classList.add('loaded');
        observer.unobserve(entry.target);  // only fade once
        }
    });
    }, { threshold: 0.1 });  // trigger when 10% of the photo is visible
        
    // Build one <img> per photo, with dimensions so the browser reserves space
    photos.forEach(photo => {
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.width = photo.width;
    img.height = photo.height;
    img.loading = 'lazy';

    observer.observe(img);  // instead of the load listener
    
    gallery.appendChild(img);
  });

  layoutMasonry();
}

window.addEventListener('load', buildGallery);

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(layoutMasonry, 200);
});