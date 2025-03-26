import { renderEvents } from './modules/events.js';
import { setupHamburgerMenu } from './modules/hamburgerMenu.js';
import { initializeFlapperLinks } from './modules/linkHoverEffect.js';
import { showOverlay, hideOverlay, initializeOverlayTransitions } from './modules/pageTransition.js';
import { generateBreadcrumbs } from './modules/breadcrumbs.js';
import { setupPagination } from './modules/pagination.js';
import { setupTableSearch } from './modules/tableSearch.js';
import { fetchBadgeData } from './modules/honorBoard.js';
import { loadEvents } from './modules/carousel.js';
import { loadHeaderFooter } from './modules/loadHeaderFooter.js';
import { setActiveNavLink } from './modules/setActiveNavLink.js'; // Corrected file name

// Initialize modules
document.addEventListener("DOMContentLoaded", () => {

  loadHeaderFooter(() => {
    setActiveNavLink();
    setupHamburgerMenu();
    initializeFlapperLinks();
    initializeOverlayTransitions();
    showOverlay();
    hideOverlay();
    generateBreadcrumbs();
    setupPagination();
    setupTableSearch('searchInput', 'searchable');
    fetchBadgeData();
    loadEvents();
  });

  renderEvents("events-container-2", { title: "Hakkerointi ilta" });
  renderEvents("events-container-CTF", { title: "CTF" });
  renderEvents("events-container-all");
});