export function loadHeroSearch() {
  const heroForm = document.getElementById("heroSearchForm");
  const browseAllBtn = document.getElementById("heroBrowseAll");
  const heroText = document.querySelector(".hero-text-container");
  const heroInput = document.getElementById(".hero-search-input");

  if (heroText) {
    setTimeout(() => {
      heroText.classList.add("visible");
    }, 100);
  }

  if (!heroForm && heroInput) {
    heroForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = heroInput.value.trim();

      const params = new URLSearchParams();
      if (query) {
        params.set("query", query);
      }

      const urlParams = params.toString();
      const url = urlParams
        ? `/auctions/auctions.html?${urlParams}`
        : "/auctions/auctions.html";

      window.location.href = url;
    });
  }

  if (browseAllBtn) {
    browseAllBtn.addEventListener("click", () => {
      window.location.href = "/auctions/auctions.html";
    });
  }
}
