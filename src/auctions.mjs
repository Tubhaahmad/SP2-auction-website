import './scss/styles.scss';
import { loadNavbar } from './navbar.mjs';

loadNavbar();

const API_BASE = 'https://v2.api.noroff.dev';
const MAX_LISTINGS = 20;

export function loadAuctionsPage() {
  const page = document.getElementById('auctionsPage');
  if (!page) return;

  page.innerHTML = `
    <section class="auctions-page container" aria-label="Auctions Page">
      <header class="auctions-header" aria-label="Auctions Header">
        <h1 class="page-title" aria-label="All Auctions">All Auctions</h1>
      </header>

      <div class="auctions-controls" aria-label="Auctions Controls">
        <form id="searchForm" class="auctions-search" aria-label="Search Auctions Form">
          <input 
            type="text" 
            id="searchInput" 
            placeholder="Search artworks..." 
            aria-label="Search auctions" 
          />
          <button type="submit" class="btn btn--primary" aria-label="Search Auctions Button">Search</button>
        </form>

        <select id="sortSelect" class="auctions-sort" aria-label="Sort Auctions Select">
          <option value="newest" aria-label="Sort by Newest">Newest</option>
          <option value="endingSoon" aria-label="Sort by Ending Soon">Ending Soon</option>
          <option value="mostBids" aria-label="Sort by Most Bids">Most bids</option>
        </select>
      </div>

      <section class="auctions-list" aria-label="Auctions Listings Section">
        <div id="listings" class="listings-grid" aria-label="Listings Grid"></div>
      </section>
    </section>
    `;

  setupAuctionsList();
}

loadAuctionsPage();

function setupAuctionsList() {
  const listingsContainer = document.getElementById('listings');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  let allListings = []; // This will hold all fetched listings
  let filteredListings = []; // This will hold filtered listings based on search and sort

  //fetching listings from noroff api//
  async function loadListings() {
    try {
      const response = await fetch(
        `${API_BASE}/auction/listings?_active=true&_tag=artevia&_seller=true&_bids=true`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const result = await response.json();
      const listings = result.data || [];

      allListings = listings.slice(0, MAX_LISTINGS).map((item) => {
        const firstMedia = item.media && item.media.length > 0 ? item.media[0] : null;

        return {
          id: item.id,
          title: item.title,
          artist: item.seller?.name || 'Unknown Artist',
          bids: item._count?.bids ?? 0,
          endsIn: formatEndsIn(item.endsAt),
          image: firstMedia?.url || 'https://via.placeholder.com/300x200?text=No+Image',
        };
      });

      filteredListings = allListings;
      renderListings();
    } catch (error) {
      console.error('Error loading listings:', error);
      listingsContainer.innerHTML = `
        <p class="no-results">
          We couldn’t load the listings at this time. Please try again later.
        </p>`;
    }
  }

  loadListings();

  //helper function to format time remaining//
  function formatEndsIn(endsAt) {
    if (!endsAt) return 'Unknown';

    const endTime = new Date(endsAt).getTime();
    const currentTime = Date.now();
    const diffInMs = endTime - currentTime;

    if (diffInMs <= 0) {
      return 'Ended';
    }

    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 24) {
      const minutes = Math.floor(diffInMs / (1000 * 60)) % 60;
      return `${hours}h ${minutes}m`;
    } else {
      const minutes = Math.floor(diffInMs / (1000 * 60)) % 60;
      return `${hours}h ${minutes}m`;
    }

    return `${days}d`;
  }

  //rendering function//
  function renderListings() {
    listingsContainer.innerHTML = '';

    if (filteredListings.length === 0) {
      listingsContainer.innerHTML = '<p>No auctions found.</p>';
      return;
    }
    filteredListings.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'listing-card';
      card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="listing-image" />
            <div class="listing-content"> 
                <h2 class="listing-title">${item.title}</h2>
                <p class="listing-artist">by ${item.artist}</p>
                <p class="listing-bids">${item.bids} bids</p>
                <p class="listing-ends-in">Ends in: ${item.endsIn}</p>
            </div>

            <a href="auction.html?id=${item.id}" class="btn btn--primary listing-view-btn">View Listing</a>
            `;
      listingsContainer.appendChild(card);
    });
  }

  //search//

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
      filteredListings = allListings;
    } else {
      filteredListings = allListings.filter(
        (item) =>
          item.title.toLowerCase().includes(query) || item.artist.toLowerCase().includes(query)
      );
    }
    renderListings();
  });

  //sort//

  sortSelect.addEventListener('change', () => {
    const value = sortSelect.value;

    if (value === 'mostBids') {
      filteredListings = [...filteredListings].sort((a, b) => b.bids - a.bids);
    }

    if (value === 'newest') {
      filteredListings = [...filteredListings].reverse();
    }

    //ending soon sorting will be implemented when i have real data (API) later)
    renderListings();
  });
}
