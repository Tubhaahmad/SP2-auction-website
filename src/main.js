import './scss/styles.scss';
import { loadNavbar } from './navbar.mjs';
import { loadHeroSearch } from './heroSearch.mjs';
import { loadFooter } from './footer.mjs';

loadNavbar();
loadFooter();

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
    imageUrl: 'https://i.pinimg.com/736x/ed/64/16/ed6416980dd035dc69d3c56351474c96.jpg',
    link: '/auctions/auctions.html',
  },
  {
    title: 'Presence',
    artist: 'Miro Takeda',
    tagLine: 'Minimal sculpture, studio light, quiet tension.',
    imageUrl: 'https://i.pinimg.com/1200x/58/ea/91/58ea9143e6de8a2bb4735bd13692a6ff.jpg',
    link: '/auctions/auctions.html',
  },
  {
    title: 'Sunlit Reflections',
    artist: 'Miro Takeda',
    tagLine: 'Minimal sculpture, studio light, quiet tension.',
    imageUrl: 'https://i.pinimg.com/736x/c4/85/ae/c485aeff8cde1dc1c29889cd8418fbe4.jpg',
    link: '/auctions/auctions.html',
  },
  {
    title: 'Here',
    artist: 'Miro Takeda',
    tagLine: 'Minimal sculpture, studio light, quiet tension.',
    imageUrl: 'https://i.pinimg.com/736x/b9/8d/7b/b98d7b442b1fbf02a31ec6b9a73a267f.jpg',
    link: '/auctions/auctions.html',
  },
  {
    title: 'Hello',
    artist: 'Miro Takeda',
    tagLine: 'Minimal sculpture, studio light, quiet tension.',
    imageUrl: 'https://i.pinimg.com/1200x/38/f6/2b/38f62b8026f0b7bd0a0a2b38e41c3e65.jpg',
    link: '/auctions/auctions.html',
  },
];

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
          <img src="${item.imageUrl}" alt="${item.title} by ${item.artist}" class="listing-image" />
        </div>
        <div class="listing-content">
          <h3 class="listing-title">${item.title}</h3>
          <p class="listing-artist">by ${item.artist}</p>
          <p class="listing-bids">${item.tagLine}</p>
          <a href="${item.link}" class="listing-view-btn">View auctions</a>
        </div>
      </div>
    `;
    slidesContainer.appendChild(slide);
  });
}

function getVisibleSlides() {
  const width = window.innerWidth;
  if (width >= 992) return 3;
  if (width >= 600) return 2;
  return 1;
}

let slideIndex = 0;
let isTransitioning = false;

function getMaxIndex() {
  return Math.max(0, featuredArtworks.length - getVisibleSlides());
}

function showFeaturedSlide(index) {
  if (isTransitioning) return;

  const slideContainer = document.querySelector('.featured-slides');
  if (!slideContainer) return;

  const maxIndex = getMaxIndex();
  if (index > maxIndex) index = 0;
  if (index < 0) index = maxIndex;
  slideIndex = index;

  const firstSlide = slideContainer.querySelector('.featured-slide');
  if (!firstSlide) return;

  const slideWidth = firstSlide.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(slideContainer).gap) || 16;
  const stepPx = slideWidth + gap;

  slideContainer.style.transform = `translateX(-${slideIndex * stepPx}px)`;

  isTransitioning = true;
  setTimeout(() => {
    isTransitioning = false;
  }, 500);
}

function setupFeaturedCarousel() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.featured-next')) {
      console.log('[carousel] next clicked');
      showFeaturedSlide(slideIndex + 1);
    }
    if (e.target.closest('.featured-prev')) {
      console.log('[carousel] prev clicked');
      showFeaturedSlide(slideIndex - 1);
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      isTransitioning = false;
      showFeaturedSlide(Math.min(slideIndex, getMaxIndex()));
    }, 150);
  });
}

function initHomePage() {
  loadHeroSearch();
  renderFeaturedSlides();
  setupFeaturedCarousel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomePage);
} else {
  initHomePage();
}
