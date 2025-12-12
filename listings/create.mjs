import '../src/scss/styles.scss';
import { loadNavbar } from '../src/navbar.mjs';
import { getToken, getUser } from '../src/auth.mjs';

const API_BASE = 'https://v2.api.noroff.dev';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

loadNavbar();

//load create listing page structure//
export function loadCreateListingPage() {
  const page = document.getElementById('createListingPage');
  if (!page) return;

  const token = getToken();
  const user = getUser();

  //if user is not logged in, show message//
  if (!token || !user) {
    page.innerHTML = `
      <section class="container create-listing-message" aria-label="Create Listing Message">
        <h1 class="page-title">Create Listing</h1>
        <p>You need to be logged in to create a listing.</p>
        <a href="/account/login.html" class="btn btn--primary" aria-label="Go to Login">Go to Login</a>
      </section>
    `;
    return;
  }

  //page layout//
  page.innerHTML = `
    <section class="create-listing container">
      <div class="create-listing-header">
        <h1 class="page-title" aria-label="Create Listing">Create Listing</h1>
        <p class="page-subtitle" >
          Add an artwork to the Artevia curated auctions.
        </p>
      </div>

      <form id="createListingForm" class="create-listing-form" aria-label="Create Listing Form">
        <div class="form-grid">
          
          <div class="form-block">
            <label for="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter title"
              required
              aria-label="Title"
            />
          </div>

          <div class="form-block">
            <label for="endsAt">Auction deadline</label>
            <input
              type="datetime-local"
              id="endsAt"
              name="endsAt"
              required
              aria-label="Auction deadline"
            />
            <p class="field-hint">
              Choose a future date and time for the auction to end.
            </p>
          </div>

          <div class="form-block form-block--full">
            <label for="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description"
              required
              aria-label="Description"
            ></textarea>
          </div>

          <div class="form-block form-block--full">
            <label>Images</label>

            <div id="mediaFields" class="media-fields" aria-label="Media Fields">
              <div class="media-row">
                <input type="url" name="mediaUrl" placeholder="Image URL" aria-label="Image URL" />
                <input type="text" name="mediaAlt" placeholder="Alt text (optional)" aria-label="Alt text (optional)" />
              </div>
            </div>

            <button type="button" id="addImageBtn" class="btn btn--ghost" aria-label="Add another image button">
              + Add another image
            </button>
          </div>

          <div class="form-block form-block--full" aria-label="Tags (optional)">
            <label for="tags">Tags (optional)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              placeholder="abstract, modern, portrait"
              aria-label="Tags"
            />
            <p class="field-hint" aria-label="Tags hint">
              We automatically add <strong>artevia</strong> to keep listings curated.
            </p>
          </div>

        </div>

        <div class="form-actions" aria-label="Form Actions">
          <button type="submit" class="btn btn--primary"  aria-label="Publish Listing Button">
            Publish Listing
          </button>
          <p id="errorMessage" class="form-error" aria-label="Error Message"></p>
          <p id="successMessage" class="form-success" aria-label="Success Message"></p>
        </div>
      </form>
    </section>
  `;

  setupCreateListingForm();
}

loadCreateListingPage();

//form logic//
function setupCreateListingForm() {
  const form = document.getElementById('createListingForm');
  const addImageBtn = document.getElementById('addImageBtn');
  const mediaFields = document.getElementById('mediaFields');

  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  if (!form) return;

  //add more image input rows//
  if (addImageBtn && mediaFields) {
    addImageBtn.addEventListener('click', () => {
      const mediaRow = document.createElement('div');
      mediaRow.className = 'media-row';
      mediaRow.innerHTML = `
        <input type="url" name="mediaUrl" placeholder="Image URL" />
        <input type="text" name="mediaAlt" placeholder="Alt text (optional)" />
      `;
      mediaFields.appendChild(mediaRow);
    });
  }

  //submit create listing//
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    errorMessage.textContent = '';
    successMessage.textContent = '';

    const token = getToken();
    if (!token) {
      errorMessage.textContent = 'You must be logged in to create a listing.';
      return;
    }

    if (!API_KEY) {
      errorMessage.textContent = 'API key is missing.';
      return;
    }

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

    //collect images//
    const urlInputs = [...form.querySelectorAll('input[name="mediaUrl"]')];
    const altInputs = [...form.querySelectorAll('input[name="mediaAlt"]')];

    const media = urlInputs
      .map((input, index) => {
        const url = input.value.trim();
        const alt = altInputs[index]?.value.trim() || title;

        if (!url) return null;
        return { url, alt };
      })
      .filter(Boolean);

    //collect tags//
    const tagsInput = form.tags.value.trim();

    const tagsFromUser = tagsInput
      ? tagsInput
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    const tags = Array.from(new Set(['artevia', ...tagsFromUser]));

    const newListing = {
      title,
      description,
      tags,
      media,
      endsAt: endsAtDate.toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE}/auction/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Noroff-API-Key': API_KEY,
        },
        body: JSON.stringify(newListing),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Create listing error:', result);
        errorMessage.textContent = result.errors?.[0]?.message || 'Failed to create listing.';
        return;
      }

      successMessage.textContent = 'Listing created successfully!';

      const listingId = result.data?.id;

      if (listingId) {
        window.location.href = `/auction.html?id=${listingId}`;
      } else {
        form.reset();
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      errorMessage.textContent = 'An error occurred. Please try again.';
    }
  });
}
