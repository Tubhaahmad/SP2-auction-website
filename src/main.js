import './scss/styles.scss';
import { loadNavbar } from './navbar.mjs';
import { loadHeroSearch } from './heroSearch.mjs';
import { loadFooter } from './footer.mjs';

loadNavbar();
loadFooter();

// static featured artworks
const featuredArtworks = [
  {
    title: 'Sunlit Reflections',
    artist: 'Clara Montreux',
    tagLine: 'Soft afternoon light over a quiet canal.',
    imageUrl: 'https://i.pinimg.com/736x/51/c5/11/51c511a8c957e833993c0d6f5037be5e.jpg',
    link: '/auctions/auctions.html',
  },
  {
    title: 'Fragment No. 4',
    artist: 'A. Richter (attr.)',
    tagLine: 'Layered abstractions in muted tones.',
    imageUrl: 'https://i.pinimg.com/736x/51/c5/11/51c511a8c957e833993c0d6f5037be5e.jpg',
    link: '/auctions/auctions.html',
  },
  {
    title: 'Presence',
    artist: 'Miro Takeda',
    tagLine: 'Minimal sculpture, studio light, quiet tension.',
    imageUrl: 'https://i.pinimg.com/736x/51/c5/11/51c511a8c957e833993c0d6f5037be5e.jpg',
    link: '/auctions/auctions.html',
  },
  {
    title: 'Sunlit Reflections',
    artist: 'Miro Takeda',
    tagLine: 'Minimal sculpture, studio light, quiet tension.',
    imageUrl: 'https://i.pinimg.com/736x/51/c5/11/51c511a8c957e833993c0d6f5037be5e.jpg',
    link: '/auctions/auctions.html',
  },
  {
    title: 'Here',
    artist: 'Miro Takeda',
    tagLine: 'Minimal sculpture, studio light, quiet tension.',
    imageUrl: 'https://i.pinimg.com/736x/51/c5/11/51c511a8c957e833993c0d6f5037be5e.jpg',
    link: '/auctions/auctions.html',
  },
  {
    title: 'Hello',
    artist: 'Miro Takeda',
    tagLine: 'Minimal sculpture, studio light, quiet tension.',
    imageUrl: 'https://i.pinimg.com/736x/51/c5/11/51c511a8c957e833993c0d6f5037be5e.jpg',
    link: '/auctions/auctions.html',
  },
];

// create the slides and reuse listing-card styles
function renderFeaturedSlides() {
  const slidesContainer = document.querySelector('.featured-slides');
  if (!slidesContainer) return;

  slidesContainer.innerHTML = '';

  featuredArtworks.forEach((item) => {
    const slide = document.createElement('article');
    slide.classList.add('featured-slide');

    slide.innerHTML = `
      <div class="listing-card">
        <div class="listing-image-wrapper">
          <img
            src="${item.imageUrl}"
            alt="${item.title} by ${item.artist}"
            class="listing-image"
          />
        </div>

        <div class="listing-content">
          <h3 class="listing-title">${item.title}</h3>
          <p class="listing-artist">by ${item.artist}</p>
          <p class="listing-bids">${item.tagLine}</p>
          <a href="${item.link}" class="listing-view-btn">
            View auctions
          </a>
        </div>
      </div>
    `;

    slidesContainer.appendChild(slide);
  });
}

function getVisibleSlides() {
  const width = window.innerWidth;

  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

let slideIndex = 0;

// show slide at current index//
function showFeaturedSlide(index) {
  const windowEl = document.querySelector('.featured-window');
  const slideContainer = document.querySelector('.featured-slides');
  const slides = document.querySelectorAll('.featured-slide');

  if (!windowEl || !slideContainer || slides.length === 0) return;

  const visibleSlides = getVisibleSlides();
  const totalSlides = slides.length;
  const maxIndex = Math.max(0, totalSlides - visibleSlides);

  if (index >= maxIndex) index = 0;
  if (index < 0) index = maxIndex;

  slideIndex = index;

  const containerWidth = slideContainer.getBoundingClientRect().width;
  const step = containerWidth / visibleSlides;

  slideContainer.style.transform = `translateX(-${slideIndex * step}px)`;
}

// next / prev//
function nextFeaturedSlide() {
  showFeaturedSlide(slideIndex + 1);
}

function prevFeaturedSlide() {
  showFeaturedSlide(slideIndex - 1);
}

function setupFeaturedCarousel() {
  const prevBtn = document.querySelector('.featured-prev');
  const nextBtn = document.querySelector('.featured-next');

  if (prevBtn) prevBtn.addEventListener('click', prevFeaturedSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextFeaturedSlide);

  window.addEventListener('resize', () => {
    showFeaturedSlide(slideIndex);
  });
}

function initHomePage() {
  loadHeroSearch();
  renderFeaturedSlides();
  setupFeaturedCarousel();
  loadFooter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomePage);
} else {
  initHomePage();
}
