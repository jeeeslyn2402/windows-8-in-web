/**
 * @summary
 * Load the component to the DOM
 */
function loadComponent(selector, url) {
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.status}`);
        }
        return response.text();
    })
    .then(html => {
        document.querySelector(selector).innerHTML = html;
    })
    .catch(error => {
        console.error(error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('#appbar', '/windows-8/appbar.html');
});