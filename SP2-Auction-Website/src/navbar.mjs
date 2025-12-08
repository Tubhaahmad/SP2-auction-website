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
          <a href="#" id="logout-btn" class="hidden">Logout</a>
        </div>
      </nav>
    </div>
  `;
}