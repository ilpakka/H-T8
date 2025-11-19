import { renderEvents } from './modules/events.js';
import { setupHamburgerMenu } from './modules/hamburgerMenu.js';
import { initializeFlapperLinks } from './modules/linkHoverEffect.js';
import { hideOverlay } from './modules/pageTransition.js';
import { generateBreadcrumbs } from './modules/breadcrumbs.js';
import { setupPagination } from './modules/pagination.js';
import { setupTableSearch } from './modules/tableSearch.js';
import { fetchBadgeData } from './modules/honorBoard.js';
import { loadEvents } from './modules/carousel.js';
import { loadHeaderFooter } from './modules/loadHeaderFooter.js';
import { setActiveNavLink } from './modules/setActiveNavLink.js'; // Corrected file name
import { loadJoinSection } from './modules/loadJoinSection.js';

// Initialize modules
document.addEventListener("DOMContentLoaded", () => {

  loadHeaderFooter(() => {
    setActiveNavLink();
    setupHamburgerMenu();
    initializeFlapperLinks();

    hideOverlay();
    generateBreadcrumbs();

    // For Hall of Fame page, pagination is set up after data is loaded
    // For other pages, set up pagination immediately
    if (!document.querySelector('#hallOfFamePage')) {
      setupPagination();
    }

    setupTableSearch('searchInput', 'searchable');
    fetchBadgeData();
    loadEvents();
    loadJoinSection();
  });

  renderEvents("events-container-2", { title: "Hakkerointi ilta" });
  renderEvents("events-container-CTF", { title: "CTF" });
  renderEvents("events-container-all");
});