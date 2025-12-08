import { getToken, logoutUser } from "./auth.mjs";

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
          <a href="/post/create.html" id="create-link" class="hidden">Create Post</a>
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

  if (token) {
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    divider.style.display = "none";

    logoutBtn.classList = "hidden";
    logoutBtn.style.display = "inline";

    logoutBtn.addEventListener("click", (event) => {
      logoutUser();
      alert ("You have been logged out.");
      window.location.href = "/index.html";
    });
  } else {
    loginLink.style.display = "inline";
    registerLink.style.display = "inline";
    divider.style.display = "inline";

    logoutBtn.style.display = "none";
  }
}