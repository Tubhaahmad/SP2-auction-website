import '../src/scss/styles.scss';
import { loadNavbar } from '../src/navbar.mjs';
import { getToken, getUser } from '../src/auth.mjs';

const API_BASE = 'https://v2.api.noroff.dev';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

loadNavbar();

//load edit listing page structure//
export function loadEditListingPage() {
  const page = document.getElementById('editListingPage');
  if (!page) return;

  const token = getToken();
  const user = getUser();

  //get listing id from url//
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get('id');

  //if no listing id, show message//
  if (!listingId) {
    page.innerHTML = `
      <section class="container" aria-label="Edit Listing Message">
        <h1 class="page-title">Edit Listing</h1>
        <p>Missing listing ID.</p>
        <a href="/account/profile.html" class="btn btn--primary">Back to Profile</a>
      </section>
    `;
    return;
  }

  //if the user is not logged in, show message//
  if (!token || !user) {
    page.innerHTML = `
      <section class="container edit-listing-message" aria-label="Edit Listing Message">
        <h1 class="page-title" aria-label="Edit Listing">Edit Listing</h1>
        <p aria-label="Login required message">You need to be logged in to edit a listing.</p>
        <a href="/account/login.html" class="btn btn--primary" aria-label="Go to Login">Go to Login</a>
      </section>
    `;
    return;
  }

  //skeleton page while loading listing data//
  page.innerHTML = `
    <section class="create-listing container">
      <div class="create-listing-header">
        <h1 class="page-title">Edit Listing</h1>
        <p class="page-subtitle">
          Update your artwork details and keep the Artevia collection curated.
        </p>
      </div>

      <div id="editLoadingMessage">
        <p>Loading listing...</p>
      </div>
    </section>
  `;

  setupEditListingLogic(listingId);
}

loadEditListingPage();

//load listing info and form logic//
async function setupEditListingLogic(listingId) {
  const page = document.getElementById('editListingPage');
  const token = getToken();
  const user = getUser();

  if (!token || !user || !API_KEY) {
    console.error('Missing authentication or API key.');
    page.innerHTML = `
      <section class="container">
        <h1 class="page-title">Edit Listing</h1>
        <p>Missing login or API key.</p>
        <a href="/account/login.html" class="btn btn--primary">Go to Login</a>
      </section>
    `;
    return;
  }

  //this function fetches the listing and builds the form//
  async function loadListingToEdit() {
    try {
      const response = await fetch(
        `${API_BASE}/auction/listings/${listingId}?_seller=true&_bids=true`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': API_KEY,
          },
        }
      );

      const result = await response.json();
      const listing = result.data;

      if (!response.ok || !listing) {
        page.innerHTML = `
          <section class="container create-listing-message">
            <h1 class="page-title">Edit Listing</h1>
            <p>Could not load this listing.</p>
            <a href="/account/profile.html" class="btn btn--primary">Back to Profile</a>
          </section>
        `;
        return;
      }

      const firstMedia = listing.media?.[0] || null;

      //remove the artevia tag from shown tags//
      const tagsValue = (listing.tags || []).filter((tag) => tag !== 'artevia').join(', ');

      //format endsAt for datetime-local//
      const endsLocal = listing.endsAt ? new Date(listing.endsAt).toISOString().slice(0, 16) : '';

      //populate form with listing data//
      page.innerHTML = `
        <section class="create-listing container">
          <div class="create-listing-header">
            <h1 class="page-title" aria-label="Edit Listing">Edit Listing</h1>
            <p class="page-subtitle" aria-label="Edit Listing Subtitle">
              Update your artwork details and keep the Artevia collection curated.
            </p>
          </div>

          <form id="editListingForm" class="create-listing-form" aria-label="Edit Listing Form">
            <div class="form-grid">
              <div class="form-block">
                <label for="title">Title</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  required 
                  aria-label="Title"
                  value="${listing.title || ''}" 
                />
              </div>

              <div class="form-block" aria-label="Auction deadline">
                <label for="endsAt">Auction deadline</label>
                <input 
                  type="datetime-local" 
                  id="endsAt" 
                  name="endsAt" 
                  required 
                  aria-label="Auction deadline"
                  value="${endsLocal}" 
                />
                <p class="field-hint">Choose a future date and time for the auction to end.</p>
              </div>

              <div class="form-block form-block--full" aria-label="Description">
                <label for="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  required
                  aria-label="Description"
                >${listing.description || ''}</textarea>
              </div>

              <div class="form-block form-block--full" aria-label="Images">
                <label for="imageUrl">Image URL</label>
                <input 
                  type="url" 
                  id="imageUrl" 
                  name="imageUrl" 
                  placeholder="Enter image URL" 
                  aria-label="Image URL"
                  value="${firstMedia?.url || ''}" 
                />
              </div>

              <div class="form-block form-block--full" aria-label="Alt text (optional)">
                <label for="imageAlt">Alt text (optional)</label>
                <input 
                  type="text" 
                  id="imageAlt" 
                  name="imageAlt" 
                  aria-label="Alt text (optional)"
                  placeholder="Enter image alt text" 
                  value="${firstMedia?.alt || ''}" 
                />
              </div>

              <div class="form-block form-block--full" aria-label="Tags (optional)">
                <label for="tags">Tags (comma separated)</label>
                <input 
                  type="text" 
                  id="tags" 
                  name="tags" 
                  placeholder="e.g. abstract, modern" 
                  aria-label="Tags (comma separated)"
                  value="${tagsValue}" 
                />
                <p class="field-hint" aria-label="Tags hint">We automatically add the <strong>artevia</strong> tag for you.</p>
              </div>
            </div>

            <div class="form-actions" aria-label="Form Actions">
              <button type="submit" class="btn btn--primary" aria-label="Update Listing Button">Update Listing</button>
              <button type="button" id="deleteListingBtn" class="btn btn--danger" aria-label="Delete Listing Button">Delete Listing</button>

              <p id="errorMessage" class="form-error" aria-label="Error Message"></p>
              <p id="successMessage" class="form-success" aria-label="Success Message"></p>
            </div>
          </form>
        </section>
      `;

      const form = document.getElementById('editListingForm');
      const deleteBtn = document.getElementById('deleteListingBtn');
      const errorMessage = document.getElementById('errorMessage');
      const successMessage = document.getElementById('successMessage');

      if (!form) return;

      //handle form submission for updating listing//
      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        errorMessage.textContent = '';
        successMessage.textContent = '';

        const title = form.title.value.trim();
        const description = form.description.value.trim();
        const endsAtValue = form.endsAt.value;

        if (!title || !description || !endsAtValue) {
          errorMessage.textContent = 'Please fill in all required fields.';
          return;
        }

        const endsAtDate = new Date(endsAtValue);

        if (endsAtDate.getTime() <= Date.now()) {
          errorMessage.textContent = 'Auction deadline must be a future date and time.';
          return;
        }

        const tagsInput = form.tags.value.trim();
        const userTags = tagsInput
          ? tagsInput
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [];

        const tags = Array.from(new Set(['artevia', ...userTags]));

        const imageUrl = form.imageUrl.value.trim();
        const imageAlt = form.imageAlt.value.trim();

        const updatedListing = {
          title,
          description,
          tags,
          endsAt: endsAtDate.toISOString(),
          media: imageUrl ? [{ url: imageUrl, alt: imageAlt }] : [],
        };

        try {
          const updateResponse = await fetch(`${API_BASE}/auction/listings/${listingId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Noroff-API-Key': API_KEY,
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedListing),
          });

          const updateJson = await updateResponse.json();

          if (!updateResponse.ok) {
            errorMessage.textContent =
              updateJson.errors?.[0]?.message || 'Failed to update listing.';
            return;
          }

          successMessage.textContent = 'Listing updated successfully!';
          window.location.href = `/auctions/auction.html?id=${listingId}`;
        } catch (error) {
          console.error('Update listing error:', error);
          errorMessage.textContent =
            'An error occurred while updating the listing. Please try again later.';
        }
      });

      //delete listing//
      if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
          const confirmDelete = confirm('Are you sure you want to delete this listing?');
          if (!confirmDelete) return;

          try {
            const deleteResponse = await fetch(`${API_BASE}/auction/listings/${listingId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'X-Noroff-API-Key': API_KEY,
                Authorization: `Bearer ${token}`,
              },
            });

            if (!deleteResponse.ok) {
              errorMessage.textContent = 'Failed to delete listing.';
              return;
            }

            alert('Listing deleted successfully.');
            window.location.href = '/account/profile.html';
          } catch (error) {
            console.error('Delete listing error:', error);
            errorMessage.textContent =
              'An error occurred while deleting the listing. Please try again later.';
          }
        });
      }
    } catch (error) {
      console.error('Load listing error:', error);
      page.innerHTML = `
        <section class="container create-listing-message" aria-label="Edit Listing Error Message">
          <h1 class="page-title">Edit Listing</h1>
          <p>Could not load this listing.</p>
          <a href="/account/profile.html" class="btn btn--primary" aria-label="Back to Profile Button">Back to Profile</a>
        </section>
      `;
    }
  }

  //run when page loads//
  loadListingToEdit();
}
