export function loadHeroSearch() {
    const form = document.getElementById('heroSearchForm'); 
const browseAllBtn = document.getElementById('heroBrowseAll');
const heroText = document.getElementById('heroText');

if (heroText) {
    window.requestAnimationFrame(() => {
        heroText.classList.add('visible');
    });
}

if (!form) return;

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const query = String(formData.get("query" || "")).trim();

    const url = query 
        ? `/auctions.html?query=${encodeURIComponent(query)}`
        : '/auctions.html';

    window.location.href = url;

});

if (browseAllBtn) {
    browseAllBtn.addEventListener('click', () => {
        window.location.href = '/auctions.html';
    });
}
}