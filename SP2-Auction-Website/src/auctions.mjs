import "./scss/styles.scss";
import { loadNavbar } from './navbar.mjs';

loadNavbar();

const MAX_ITEMS = 12;

export function loadAuctionsPage() {
    const page = document.getElementById('auctionsPage');
    if (!page) return;

    page.innerHTML = `
    <section class="auction-header container">
        <h1 class="page-title">
            All Auctions
        </h1>

        <div class="auctions-controls">
            <form action="
            " id="searchForm" class="auctions-search">
            <input type="text" id="searchInput" class="auctions-search-input" placeholder="Search artworks..." aria-label="Search auctions" />
            <button type="submit" class="btn btn--primary">Search</button>
            </form>

            <select name="" id="sortSelect" class="auctions-sort">
                <option value="newest">Newest</option>
                <option value="endingSoon">Ending Soon</option>
                <option value="mostBids">Most bids</option>
            </select>
        </div>
    </section>

    <section class="auctions-list container">
        <div id="listings" class="listings-grid"></div>
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

    const placeholderData = [
        {
            id: 1,
            title: "Starry Night",
            artist: "Vincent van Gogh",
            bids: 5,
            endsIn: "2h 30m",
            image: "images/placeholder1.jpg"
        },

        {
            id: 1,
            title: "Starry Night",
            artist: "Vincent van Gogh",
            bids: 5,
            endsIn: "2h 30m",
            image: "images/placeholder1.jpg"
        },

        {
            id: 1,
            title: "Starry Night",
            artist: "Vincent van Gogh",
            bids: 5,
            endsIn: "2h 30m",
            image: "images/placeholder1.jpg"
        },

         {
            id: 1,
            title: "Starry Night",
            artist: "Vincent van Gogh",
            bids: 5,
            endsIn: "2h 30m",
            image: "images/placeholder1.jpg"
        }


        // Add more placeholder items as needed
    ];

    allListings = placeholderData.slice(0, MAX_ITEMS);
    filteredListings = allListings;

    renderListings();

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

            <a href="listing.html?id=${item.id}" class="btn btn--primary listing-view-btn">View Listing</a>
            `;
            listingsContainer.appendChild(card);
        });
    }
}

//search//

    searchForm.addEventListener('submit', (event) => { 
        event.preventDefault();
        const query = searchInput.value.toLowerCase().trim();

        if (!query) {
            filteredListings = allListings;
        } else {
            filteredListings = allListings.filter((item) =>
                item.title.toLowerCase().includes(query) ||
                item.artist.toLowerCase().includes(query)
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
    }
    );


    
    