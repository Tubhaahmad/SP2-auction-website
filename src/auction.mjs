import './scss/styles.scss';
import { loadNavbar } from './navbar.mjs';
import { getUser, getToken } from './auth.mjs';
import { loadFooter } from './footer.mjs';

const API_BASE = 'https://v2.api.noroff.dev';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

loadNavbar();
loadFooter();

//load auction page structure//
export function loadAuctionPage() {
  const page = document.getElementById('auctionPage');
  if (!page) return;

  page.innerHTML = `
     <section class="auction-detail container" aria-label="Auction Details">
    <div class="auction-layout">
      <div class="auction-image-wrapper">
        <img id="auctionImage" alt="Artwork Image" class="auction-image" />
      </div>

      <div class="auction-info">
        <h1 id="auctionTitle" class="auction-title" aria-label="Auction Title"></h1>
        <p id="auctionArtist" class="auction-artist" aria-label="Auction Artist"></p>
        <p id="auctionSeller" class="auction-seller" aria-label="Auction Seller"></p>

        <p id="auctionEnds" class="auction-ends" aria-label="Auction Ends"></p>
        <p id="auctionEndsExact" class="auction-ends-exact" aria-label="Auction Ends Exact"></p>
        <p id="auctionDescription" class="auction-description" aria-label="Auction Description"></p>

        <div class="auction-meta">
          <p id="auctionBidsCount" class="auction-bids-count" aria-label="Auction Bids Count"></p>
        </div>
      </div>

      <div id="auctionActions" class="auction-actions" aria-label="Auction Actions"></div>
    </div>

    <!-- FULL-WIDTH BID HISTORY -->
    <section class="auction-bids-history" aria-label="Bid History">
      <h2 class="section-title">Bid History</h2>
      <ul id="bidsList" class="bids-list" aria-label="List of Bids"></ul>
    </section>

    <!-- FULL-WIDTH PLACE-BID CARD -->
    <section class="auction-bid-section-wrapper" aria-label="Place a Bid Section">
      <div id="bidSection" aria-label="Bid Section"></div>
    </section>
  </section>
  `;

  setupAuctionLogic();
}

loadAuctionPage();

//load listing information//
async function setupAuctionLogic() {
  const page = document.getElementById('auctionPage');

  //getting listing id from url//
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get('id');

  //if no ID, show error//
  if (!listingId) {
    page.innerHTML = `
      <section class="container">
        <p>Invalid auction.</p>
      </section>
    `;
    return;
  }

  //fetching all DOM elements//
  const titleEl = document.getElementById('auctionTitle');
  const artistEl = document.getElementById('auctionArtist');
  const sellerEl = document.getElementById('auctionSeller');
  const imageEl = document.getElementById('auctionImage');
  const endsEl = document.getElementById('auctionEnds');
  const endsExactEl = document.getElementById('auctionEndsExact');
  const descriptionEl = document.getElementById('auctionDescription');
  const bidsCountEl = document.getElementById('auctionBidsCount');
  const bidsListEl = document.getElementById('bidsList');
  const bidSectionEl = document.getElementById('bidSection');
  const actionsEl = document.getElementById('auctionActions');

  let currentListing = null;
  let highestBid = 0; //tracking the highest bid

  //function to load listing data//
  async function loadListing() {
    try {
      //fetching listing inc. seller and bids//
      const response = await fetch(
        `${API_BASE}/auction/listings/${listingId}?_seller=true&_bids=true`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch listing data.');
      }

      const result = await response.json();
      const listing = result.data;
      currentListing = listing;

      //displaying listing data//
      const firstMedia = listing.media && listing.media.length > 0 ? listing.media[0] : null;

      //fill in page details//
      titleEl.textContent = listing.title || 'No Title';

      const sellerName = listing.seller?.name || 'Unknown Seller';
      artistEl.textContent = `By: ${sellerName}`;
      sellerEl.textContent = `Seller: ${sellerName}`;

      descriptionEl.textContent = listing.description || 'No Description';

      endsEl.textContent = `Ends in: ${formatEndsIn(listing.endsAt)}`;
      const endsDate = listing.endsAt ? new Date(listing.endsAt) : null;
      endsExactEl.textContent = endsDate
        ? `Ends at: ${endsDate.toLocaleString()}`
        : 'Ends at: Unknown';

      //display image//
      imageEl.src = firstMedia ? firstMedia.url || '' : '';
      imageEl.alt = firstMedia ? listing.title || 'Artwork Image' : 'No Image Available';

      //display bids count//
      const bids = listing.bids || [];
      bidsCountEl.textContent = `Total Bids: ${bids.length}`;

      highestBid = bids.length > 0 ? Math.max(...bids.map((bid) => bid.amount)) : 0;

      //render bid history + bid form//
      renderBids(bids);
      renderBidSection();
    } catch (error) {
      console.error('Error loading listing:', error);
      page.innerHTML = `
        <section class="container">
          <p>Error loading auction details. Please try again later.</p>
        </section>
      `;
    }

    function renderOwnerActions() {
      if (!actionsEl) return;
      actionsEl.innerHTML = '';

      const token = getToken();
      const user = getUser();
      if (!token || !user || !currentListing) return;

      const isOwner = currentListing.seller?.name === user.name;
      if (!isOwner) return;

      const editUrl = `${import.meta.env.BASE_URL}listings/edit.html?id=${currentListing.id}`;

      actionsEl.innerHTML = `
    <a href="${editUrl}" class="btn btn--ghost" aria-label="Edit this listing">
      Edit listing
    </a>
  `;
    }
    renderOwnerActions();
  }

  //render bid history//
  function renderBids(bids) {
    bidsListEl.innerHTML = '';

    if (!bids || bids.length === 0) {
      bidsListEl.innerHTML = '<li>No bids yet. Be the first to bid.</li>';
      return;
    }

    //sort newest to oldest//
    const sorted = [...bids].sort((a, b) => new Date(b.created) - new Date(a.created));

    sorted.forEach((bid) => {
      const li = document.createElement('li');
      li.className = 'bid-item';

      const bidderName = bid.bidder?.name || 'Anonymous';
      const created = formatDateTime(bid.created);

      li.innerHTML = `
        <div class="bid-row">
          <span class="bid-amount">${bid.amount} credits</span>
          <span class="bid-meta">${bidderName}</span>
        </div>
        <div class="bid-time">${created}</div>
      `;

      bidsListEl.appendChild(li);
    });
  }

  //render bid form only if user is logged in and auction is active//
  function renderBidSection() {
    const user = getUser();
    const token = getToken();

    const ended = currentListing && new Date(currentListing.endsAt).getTime() < Date.now();

    //if not logged in, show login prompt//
    if (!token) {
      bidSectionEl.innerHTML = `
        <p class="bid-login-message">
          Please log in to place a bid.
          <a href="/account/login.html">Go to Login</a>
        </p>
      `;
      return;
    }

    //if auction is ended, show message//
    if (ended) {
      bidSectionEl.innerHTML = `
        <p class="bid-ended-message">This auction has ended.</p>
      `;
      return;
    }

    //render bid form//
    bidSectionEl.innerHTML = `
      <form id="bidForm" class="bid-form">
        <label for="bidAmount">Place a bid</label>
        <input 
          type="number" 
          id="bidAmount" 
          min="${highestBid + 1}"
          step="1"
          required
        />
        <p class="bid-helper">Current highest bid: ${highestBid} credits</p>
        <button type="submit" class="btn btn--primary">Place bid</button>
        <p id="bidError" class="bid-error"></p>
      </form>
    `;

    const bidForm = document.getElementById('bidForm');
    if (!bidForm) return;

    const bidInput = document.getElementById('bidAmount');
    const bidError = document.getElementById('bidError');

    //handle bid submit//
    bidForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      bidError.textContent = '';

      const bidAmount = Number(bidInput.value.trim());

      //check if bid amount is valid//
      if (isNaN(bidAmount)) {
        bidError.textContent = 'Please enter a valid bid amount.';
        return;
      }

      //bid must be higher than current highest//
      if (bidAmount <= highestBid) {
        bidError.textContent = `Your bid must be higher than ${highestBid} credits.`;
        return;
      }

      const freshToken = getToken();
      if (!freshToken) {
        bidError.textContent = 'You must be logged in to place a bid.';
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auction/listings/${currentListing.id}/bids`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${freshToken}`,
            'X-Noroff-API-Key': API_KEY,
          },
          body: JSON.stringify({ amount: bidAmount }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Bid error:', data);
          bidError.textContent =
            data.errors?.[0]?.message || 'Failed to place bid. Please try again.';
          return;
        }

        //if bid worked, clear input and reload listing//
        bidInput.value = '';
        loadListing(); // reload to update bids and highest
      } catch (error) {
        console.error('Error placing bid:', error);
        bidError.textContent = 'An error occurred while placing your bid. Please try again later.';
      }
    });
  }

  //format time remaining - ends in//
  function formatEndsIn(endsAt) {
    if (!endsAt) return 'Unknown';

    const endDate = new Date(endsAt).getTime();
    const now = new Date().getTime();
    const diffMs = endDate - now;

    if (diffMs <= 0) return 'Ended';

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 24) {
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      return `${hours} hours, ${minutes} minutes`;
    }

    return `${days} days`;
  }

  //format date time for bids//
  function formatDateTime(dateString) {
    if (!dateString) return 'Unknown time';
    return new Date(dateString).toLocaleString();
  }

  //run the first load//
  await loadListing();
}
