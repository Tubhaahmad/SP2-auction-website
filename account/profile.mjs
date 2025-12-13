import '../src/scss/styles.scss';
import { loadNavbar } from '../src/navbar.mjs';
import { getUser, getToken, saveUserData } from '../src/auth.mjs';
import { loadFooter } from '../src/footer.mjs';

console.log('✅ profile.mjs loaded');

const API_BASE = 'https://v2.api.noroff.dev';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

loadNavbar();
loadFooter();

//load profile page structure//
export function loadProfilePage() {
  const page = document.getElementById('profilePage');
  if (!page) return;

  const token = getToken();
  const user = getUser();

  //if not logged in, show message//
  if (!token || !user) {
    page.innerHTML = `
      <section class="container profile-message">
        <h1 class="page-title">Profile</h1>
        <p>You need to be logged in to view your profile.</p>
        <a href="/account/login.html" class="btn btn--primary">Go to Login</a>
      </section>`;
    return;
  }

  //if logged in, show profile details//
  page.innerHTML = `
    <section class="profile-page container">
      <div class="profile-header">
        <div class="profile-banner" id="profileBanner"></div>

        <div class="profile-main-info">
          <div class="profile-img-wrapper">
            <img alt="Profile Picture" id="profilePicture" class="profile-img"/>
          </div>

          <div class="profile-text-info">
            <h1 id="profileName" class="profile-name"></h1>
            <p id="profileEmail" class="profile-email"></p>
            <p id="profileCredits" class="profile-credits"></p>
            <p id="profileBio" class="profile-bio"></p>
          </div>
        </div>
      </div>

      <section class="profile-edit">
        <div class="profile-section-header">
          <h2>Edit Profile</h2>
        </div>

        <form id="editProfileForm" class="profile-edit-form">
          <div class="form-grid">
            <div class="form-block">
              <label for="avatarUrl">Profile picture URL</label>
              <input
                type="url"
                id="avatarUrl"
                name="avatarUrl"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div class="form-block form-block--full">
              <label for="bioInput">Bio</label>
              <textarea
                id="bioInput"
                name="bio"
                rows="3"
                placeholder="Write something about yourself..."
              ></textarea>
            </div>
          </div>

           <div class="form-actions">
            <button type="submit" class="btn btn--primary">Save Profile</button>
            <p id="profileUpdateError" class="form-error"></p>
            <p id="profileUpdateSuccess" class="form-success"></p>
          </div>
        </form>
      </section>

      <section class="profile-auctions">
        <div class="profile-section-header">
          <h2>My Listings</h2>
          <a href="/listings/create.html">+ Create Listing</a>
        </div>
        <div id="profileListings" class="profile-listings-grid"></div>
      </section>

      <section class="profile-sections">
        <div class="profile-section-header">
          <h2>My Bids</h2>
        </div>
        <div id="profileBids" class="profile-bids-grid"></div>
      </section>
    </section>
  `;

  setupProfileLogic();
}

loadProfilePage();

//load profile data, listings, and bids//
async function setupProfileLogic() {
  console.log('setupProfileLogic running!');
  const user = getUser();
  const token = getToken();

  if (!user || !token || !API_KEY) {
    console.error('User not logged in or missing API key.');
    return;
  }

  //get profile elements//
  const profileNameEl = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmail');
  const creditsEl = document.getElementById('profileCredits');
  const bioEl = document.getElementById('profileBio');
  const profilePictureEl = document.getElementById('profilePicture');
  const profileBannerEl = document.getElementById('profileBanner');
  const listingsContainer = document.getElementById('profileListings');
  const bidsContainer = document.getElementById('profileBids');

  if (listingsContainer) {
    listingsContainer.addEventListener('click', async (event) => {
      const btn = event.target.closest('button[data-id]');
      if (!btn) return;

      const listingId = btn.dataset.id;
      if (!listingId) return;

      const confirmDelete = confirm('Are you sure you want to delete this listing?');
      if (!confirmDelete) return;

      try {
        const deleteResponse = await fetch(`${API_BASE}/auction/listings/${listingId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': API_KEY,
          },
        });

        if (!deleteResponse.ok) {
          const err = await deleteResponse.json().catch(() => null);
          alert(err?.errors?.[0]?.message || 'Failed to delete listing.');
          return;
        }

        btn.closest('.profile-listing-card')?.remove();
      } catch (error) {
        console.error('Delete listing error:', error);
        alert('An error occurred while deleting. Please try again.');
      }
    });
  }

  //get edit profile form elements//
  const editProfileForm = document.getElementById('editProfileForm');
  const avatarUrlInput = document.getElementById('avatarUrl');
  const bioInput = document.getElementById('bioInput');
  const profileUpdateError = document.getElementById('profileUpdateError');
  const profileUpdateSuccess = document.getElementById('profileUpdateSuccess');

  //load profile info (name, credits, avatar, bio etc)//
  async function loadProfile() {
    try {
      const response = await fetch(`${API_BASE}/auction/profiles/${user.name}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Noroff-API-Key': API_KEY,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Failed to fetch profile data:', result);
        return;
      }

      const profile = result.data;

      //save update profile in local storage//
      const updatedUser = { ...user, ...profile };
      if (typeof saveUserData === 'function') {
        saveUserData(updatedUser);
      }

      //display profile data//
      profileNameEl.textContent = profile.name || 'No username';
      emailEl.textContent = profile.email || 'No email provided';
      creditsEl.textContent = `Credits: ${profile.credits ?? 0}`;
      bioEl.textContent = profile.bio || 'No bio yet';

      profilePictureEl.src = profile.avatar?.url || '';
      profileBannerEl.style.backgroundImage = profile.banner?.url
        ? `url(${profile.banner.url})`
        : 'none';
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }

  //edit profile form submit //
  function setupEditProfileForm() {
    if (!editProfileForm) return;

    editProfileForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!profileUpdateError || !profileUpdateSuccess) return;

      profileUpdateError.textContent = '';
      profileUpdateSuccess.textContent = '';

      const avatarUrl = avatarUrlInput?.value.trim() || '';
      const bioValue = bioInput?.value.trim() || '';

      //always send bio (can be empty string)//
      const body = {
        bio: bioValue || '',
      };

      //only include avatar if user wrote something in the field//
      if (avatarUrl) {
        body.avatar = {
          url: avatarUrl,
          alt: `${user.name}'s avatar`,
        };
      }
      //if avatarUrl is empty, we DON'T touch avatar at all//
      //it stays whatever it already is on the profile//

      try {
        const response = await fetch(`${API_BASE}/auction/profiles/${user.name}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': API_KEY,
          },
          body: JSON.stringify(body),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error('Failed to update profile:', result);
          profileUpdateError.textContent =
            result.errors?.[0]?.message || 'Could not update profile.';
          return;
        }

        const updatedProfile = result.data;

        //update visible profile info//
        bioEl.textContent = updatedProfile.bio || 'No bio yet';
        const newAvatarUrl = updatedProfile.avatar?.url || '';
        profilePictureEl.src = newAvatarUrl;

        //sync form fields//
        if (avatarUrlInput) avatarUrlInput.value = newAvatarUrl;
        if (bioInput) bioInput.value = updatedProfile.bio || '';

        //update localStorage user//
        const newUserData = { ...user, ...updatedProfile };
        if (typeof saveUserData === 'function') {
          saveUserData(newUserData);
        }

        profileUpdateSuccess.textContent = 'Profile updated successfully.';
      } catch (error) {
        console.error('Error updating profile:', error);
        profileUpdateError.textContent =
          'An error occurred while saving your profile. Please try again.';
      }
    });
  }

  //load listings created by user//
  async function loadMyListings() {
    if (!listingsContainer) return;

    listingsContainer.innerHTML = '<p>Loading listings...</p>';

    try {
      const response = await fetch(
        `${API_BASE}/auction/profiles/${user.name}/listings?_bids=true`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': API_KEY,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('Failed to fetch profile listings:', result);
        listingsContainer.innerHTML = '<p>Failed to load listings.</p>';
        return;
      }

      const listings = result.data || [];

      if (listings.length === 0) {
        listingsContainer.innerHTML = '<p>No listings found.</p>';
        return;
      }

      listingsContainer.innerHTML = '';

      listings.forEach((item) => {
        const firstMedia = item.media?.[0];
        const image = firstMedia?.url || '';
        const bidsCount = item._count?.bids ?? 0;

        const card = document.createElement('article');
        card.className = 'profile-listing-card';

        card.innerHTML = `
          <img src="${image}" alt="${item.title}" class="profile-listing-image" />
          <div class="profile-listing-content">
            <h3 class="profile-listing-title">${item.title}</h3>
            <p class="profile-listing-bids">${bidsCount} bids</p>
            <p class="profile-listing-ends">Ends: ${formatDateTime(item.endsAt)}</p>
          </div>
          <div class="profile-listing-actions">
            <a href="/auctions/auction.html?id=${item.id}" class="btn btn--ghost">View</a>
            <a href="/listings/edit.html?id=${item.id}" class="btn btn--secondary">Edit</a>
            <button class="btn btn--danger" data-id="${item.id}">Delete</button>
          </div>
        `;

        listingsContainer.appendChild(card);
      });
    } catch (error) {
      console.error('Error fetching profile listings:', error);
      listingsContainer.innerHTML = '<p>Error loading listings.</p>';
    }
  }

  //load lsitings i have bid on//
  async function loadMyBids() {
    if (!bidsContainer) return;

    bidsContainer.innerHTML = '<p>Loading bids...</p>';

    try {
      const response = await fetch(
        `${API_BASE}/auction/profiles/${user.name}/bids?_listings=true`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': API_KEY,
          },
        }
      );

      const result = await response.json();
      console.log('bids result from API:', result);

      if (!response.ok) {
        console.error('Failed to fetch profile bids:', result);
        bidsContainer.innerHTML = '<p>Failed to load bids.</p>';
        return;
      }

      const bids = Array.isArray(result.data) ? result.data : [];

      if (bids.length === 0) {
        bidsContainer.innerHTML = '<p>No bids found.</p>';
        return;
      }

      bidsContainer.innerHTML = '';

      bids.forEach((bid) => {
        console.log('single bid from API:', bid);

        const amount = bid.amount;
        const created = formatDateTime(bid.created);
        const listing = bid.listing || {};

        const listingId = listing.id;
        //fallback if listing title is missing//
        const listingTitle =
          listing.title ||
          (listingId ? `Listing #${String(listingId).slice(0, 8)}` : 'Unknown listing');

        const firstMedia = listing.media?.[0];
        const imageUrl = firstMedia?.url || '';

        const card = document.createElement('article');
        card.className = 'profile-bid-card';

        card.innerHTML = `
        <img
            src="${imageUrl}"
            alt="${listingTitle}"
            class="profile-bid-image"
          />

  <div class="profile-bid-content">
    <h3 class="profile-bid-title">${listingTitle}</h3>
    <p class="profile-bid-amount">Your bid: ${amount} credits</p>
    <p class="profile-bid-time">Placed: ${created}</p>
  </div>
  <div class="profile-bid-actions">
    ${
      listingId
        ? `<a href="/auctions/auction.html?id=${listingId}" class="btn btn--ghost">
             View Listing
           </a>`
        : ''
    }
  </div>
`;

        bidsContainer.appendChild(card);
      });
    } catch (error) {
      console.error('Error fetching profile bids:', error);
      bidsContainer.innerHTML = '<p>Error loading bids.</p>';
    }
  }

  //function to format date and time//
  function formatDateTime(dateString) {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  }

  //load everythuing//
  console.log('calling loadprofile, loadMyListings, loadMyBids');
  setupEditProfileForm();
  await loadProfile();
  await loadMyListings();
  await loadMyBids();
}
