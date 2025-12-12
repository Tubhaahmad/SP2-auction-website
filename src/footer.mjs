export function loadFooter() {
  const footerEl = document.getElementById('footer');
  if (!footerEl) return;

  footerEl.innerHTML = `
  <footer class="footer">
  <div class="footer-inner">
    <div class="footer-top">
    <div class="footer-brand">
            <h3 class="footer-logo">Student Art Auctions</h3>
            <p class="footer-line">
              Curated auctions for emerging student artists — viewed with care, acquired with confidence.
              This is a fictional website created for educational purposes. All artworks and auctions are part of a student project.
            </p>
          </div>

          <nav class="footer-nav" aria-label="Footer Navigation">
          <div class="footer-col">
              <h4 class="footer-title">Auctions</h4>
              <ul class="footer-list">
                <li><a href="/auctions.html">Live auctions</a></li>
                <li><a href="/upcoming.html">Upcoming</a></li>
                <li><a href="/results.html">Results</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4 class="footer-title">Artists</h4>
              <ul class="footer-list">
                <li><a href="/artists.html">Browse artists</a></li>
                <li><a href="/create-listing.html">Submit artwork</a></li>
                <li><a href="/guidelines.html">Guidelines</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4 class="footer-title">Information</h4>
              <ul class="footer-list">
                <li><a href="/how-it-works.html">How it works</a></li>
                <li><a href="/shipping.html">Shipping & pickup</a></li>
                <li><a href="/faq.html">FAQ</a></li>
              </ul>
            </div>
          </nav>
    </div>

    <div class="footer-bottom">
          <p>© 2025 SP2 Auction Website Project</p>
          <p class="footer-fine">
            <a href="/terms.html">Terms</a>
            <span aria-hidden="true">·</span>
            <a href="/privacy.html">Privacy</a>
            <span aria-hidden="true">·</span>
            <a href="/contact.html">Contact</a>
          </p>
        </div>
  
  </div>

  </footer>
  `;
}
