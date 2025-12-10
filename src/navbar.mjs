import { getToken, getUser, logoutUser, saveUserData } from "./auth.mjs";


const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export function loadNavbar() {
  const header = document.querySelector('header');
  if (!header) return;

  header.innerHTML = `
    <div class="site-header">
      <nav class="nav-container">
        <input type="checkbox" id="nav-toggle" class="nav-toggle" />
        <label for="nav-toggle" class="nav-toggle-label">☰</label>

        <div class="nav-left">
          <a href="/">Home</a>
          <span class="divider">|</span>
          <a href="/auctions/auctions.html">Auctions</a>
        </div>

        <div class="logo" id="navbar-logo">
          <a href="#">Artevia</a>
        </div>

        <div class="nav-right">
         <span id="navbar-credits" class="nav-credits"></span>

          <a href="/account/profile.html" id="profile-link">Profile</a>
           <a href="/listings/create.html" id="create-link">Create listing</a>

         
          <a href="/account/login.html" id="login-link">Login</a>
          <span class="divider">|</span>
          <a href="/account/register.html" id="register-link">Register</a>
          <a href="/account/login.html" id="logout-btn" class="hidden">Logout</a>
        </div>
      </nav>
    </div>
  `;

  updateNavbar();
}

function updateNavbar() {
  const token = getToken();
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  const logoutBtn = document.getElementById("logout-btn");
  const divider = document.querySelector(".divider");
  const profileLink = document.getElementById("profile-link");
  const createLink = document.getElementById("create-link");

  if (token) {
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    divider.style.display = "none";
    
    profileLink.style.display = "inline";
    createLink.style.display = "inline";

    logoutBtn.classList = "hidden";
    logoutBtn.style.display = "inline";

    logoutBtn.addEventListener("click", (event) => {
      logoutUser();
      alert ("You have been logged out.");
      window.location.href = "/index.html";
    });

    showNavbarCredits();
  } else {
    loginLink.style.display = "inline";
    registerLink.style.display = "inline";
    divider.style.display = "inline";
   

    profileLink.style.display = "none";
    createLink.style.display = "none";
    logoutBtn.style.display = "none";
    createLink.style.display = "none";




    const creditsEl = document.getElementById("navbar-credits");
    if (creditsEl) {
      creditsEl.textContent = "";
    }
  }
}

//display user credits in navbar//
function showNavbarCredits() {
  const creditsEl = document.getElementById("navbar-credits");
  if (!creditsEl) return;

  const user = getUser();

  if (!user) {
    creditsEl.textContent = "";
    return;
  }

//initial display before fetch//
const currentCredits = typeof user.credits === "number" ? user.credits : "0";
  creditsEl.textContent = `Credits: ${currentCredits}`;

  //fetch latest credits//
  fetchProfileCredits(creditsEl);
}

async function fetchProfileCredits(creditsEl) {
  const token = getToken();
  const user = getUser();

  if (!token || !user) return;
  if (!API_KEY) {
    console.error("API key is missing.");
    return;
}
  try {
    const response = await fetch(
      `${API_BASE}/auction/profiles/${user.name}`, 
      {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    }
  );

  const data = await response.json();

    if (!response.ok) {
      console.error("Failed to fetch profile credits:", data);
      return;
    }

    const updatedProfile = data.data;

    if (!updatedProfile) return;

    const updatedUser = { ...user, ...updatedProfile };
    saveUserData(updatedUser);

    const credits = typeof updatedProfile.credits === "number" ? updatedProfile.credits : "0";
    creditsEl.textContent = `Credits: ${credits}`;
  } catch (error) {
    console.error("Error fetching profile credits:", error);
  }
}





