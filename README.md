# SP2-auction-website
Artevia is an online auction platform where students can list, browse, and bid on artworks.  
The project is built using the Noroff Auction API and focuses on clean UI, accessibility, and core auction functionality.

## Resources

- [Brief](https://lms.noroff.no/mod/book/view.php?id=124625&chapterid=61899)
- [Design](https://www.figma.com/design/lv39SeyqyiWwdDNXeBCLc9/Artevia---SP2?node-id=0-1&t=sCI6i3QDvEIyvUwa-1)
- [Production deploy](https://artevia-sp2.netlify.app/index.html)
- [Deployment CI](https://artevia-sp2.netlify.app/index.html)
- [API Docs](https://docs.noroff.dev/docs/v2/auction-house/listings)
- [API Endpoint](https://docs.noroff.dev/docs/v2/auth/register)

## 🧩 Features

### Public (no login required)

- View **all active auctions** in a responsive grid
- See **single auction pages** with:
  - Large artwork image
  - Seller name
  - Description
  - Time remaining
  - Bid history (if any)
- Browse **home page** with:
  - Featured artworks carousel
  - Short sections explaining how Artevia works

### Authenticated features

> Requires a valid `@stud.noroff.no` account with the Auction API.

- **Register** a new user (Noroff student email only)
- **Log in / log out**
- View **current credits** directly in the navbar
- **Create listings** with:
  - Title, description
  - Optional media (image URL)
  - End date and tags
- **Edit your own listings**
- **Place bids** on active listings  
  - Only if logged in  
  - Only if the bid is higher than the current highest
- **Profile page** with:
  - Username, email, credits
  - Editable avatar (URL) and bio
  - “My Listings” – all listings created by the user  
  - “My Bids” – listings the user has bid on

---

## 🛠 Tech Stack

- **Frontend framework:** Vite + vanilla JavaScript (ES Modules)
- **Styling:** SCSS (Sass), custom components, layout variables
- **UI libraries:**
  - Bootstrap 5 (grid/utilities)
  - Bootstrap Icons
  - Font Awesome (carousel arrows)
- **API:** [Noroff Auction API](https://docs.noroff.dev/docs/v2)
- **Auth + state:** localStorage (token + user data)
- **Build tool:** Vite (`npm run build`)
- **Deployment:** Netlify 
---

## ⚙️ Getting Started (Local Setup)
### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/SP2-auction-website.git
```
```bash
cd SP2-auction-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables
Create a .env file in the project root:
```bash
VITE_NOROFF_API_KEY=<YOUR_NOROFF_API_KEY_HERE>
```

### 4.Run the dev server
```bash
npm run dev
```

### 5.Build for production
```bash
npm run build
```

## Authors
- Tubha Ahmad(@Tubhaahmad)
