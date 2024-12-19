// HAMBURGER MENU

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navMenu.classList.toggle("open");

  const links = document.querySelectorAll(".nav-link");
  links.forEach((link, index) => {
    link.style.setProperty("--delay", index);
  });
});




// LINK HOVER EFFECT

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("transition-overlay");

  // Function to activate and deactivate the overlay
  const activateOverlay = () => {
      overlay.classList.add("active");
      setTimeout(() => overlay.classList.remove("active"), 500); // Matches transition duration
  };

  // Trigger overlay on link clicks
  document.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", e => {
          if (link.href && link.target !== "_blank" && !link.href.startsWith("#")) {
              e.preventDefault();
              activateOverlay();
              setTimeout(() => {
                  window.location.href = link.href;
              }, 500); // Matches transition duration
          }
      });
  });

  // Handle back and forward navigation
  window.addEventListener("popstate", () => {
      activateOverlay();
  });

  // Initial activation (if needed for page loads)
  activateOverlay();
});


// PAGE TRANSITION

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("transition-overlay");

  // Function to activate and deactivate the overlay
  const activateOverlay = () => {
      overlay.classList.add("active");
  };

  const deactivateOverlay = () => {
      overlay.classList.remove("active");
  };

  // Ensure overlay starts hidden
  deactivateOverlay();

  // Trigger overlay on link clicks
  document.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", e => {
          if (link.href && link.target !== "_blank" && !link.href.startsWith("#")) {
              e.preventDefault(); // Prevent immediate navigation
              activateOverlay();
              setTimeout(() => {
                  window.location.href = link.href; // Navigate after animation
              }, 500); // Matches transition duration
          }
      });
  });

  // Handle back and forward navigation
  window.addEventListener("popstate", () => {
      activateOverlay();
      setTimeout(() => deactivateOverlay(), 1000); // Deactivate after animation
  });
});




// BREADCRUMBS

function generateBreadcrumbs() {
  const fullPath = window.location.pathname; // e.g., /red-team/index.html
  const segments = fullPath
    .split('/')
    .filter(segment => segment && segment !== 'index.html'); // Remove empty and "index.html" segments

  const breadcrumbContainer = document.getElementById('breadcrumb-container');
  breadcrumbContainer.innerHTML = ''; // Clear existing breadcrumbs

  let currentPath = '';
  segments.forEach((segment, index) => {
    const listItem = document.createElement('li');
    currentPath += `/${segment}`;

    if (index < segments.length - 1) {
      // Add clickable links for intermediate items
      const link = document.createElement('a');
      link.href = currentPath;
      link.textContent = capitalize(segment);
      listItem.appendChild(link);
    } else {
      // Add plain text for the last item (current page)
      listItem.textContent = getCurrentPageLabel() || capitalize(segment);
    }

    breadcrumbContainer.appendChild(listItem);
  });
}

// Function to get the label for the current page
function getCurrentPageLabel() {
  // Check for a meta tag with a breadcrumb label
  const metaTag = document.querySelector('meta[name="breadcrumb-label"]');
  if (metaTag) return metaTag.content;

  // Default to "Current Page" or last folder name
  return "Current Page";
}

// Helper function to capitalize words
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Generate breadcrumbs on page load
generateBreadcrumbs();

// Remember to add a meta tag with the breadcrumb label in the head section of each page:
// <meta name="breadcrumb-label" content="Custom Label">



// PAGINATION

document.addEventListener("DOMContentLoaded", () => {
  const rowsPerPage = 5;
  const table = document.getElementById("resourceTable");
  const tbody = table.querySelector("tbody");
  const paginationContainer = document.querySelector(".page-numbers");
  const prevPageBtn = document.querySelector(".prev-page");
  const nextPageBtn = document.querySelector(".next-page");

  let currentPage = 1;
  let totalRows = tbody.rows.length;
  let totalPages = Math.ceil(totalRows / rowsPerPage);

  function renderTable() {
      // Hide all rows
      for (let i = 0; i < totalRows; i++) {
          tbody.rows[i].style.display = "none";
      }

      // Show rows for current page
      const start = (currentPage - 1) * rowsPerPage;
      const end = Math.min(start + rowsPerPage, totalRows);

      for (let i = start; i < end; i++) {
          tbody.rows[i].style.display = "table-row";
      }

      // Update pagination buttons
      renderPagination();
  }

  function renderPagination() {
      paginationContainer.innerHTML = ""; // Clear pagination
      for (let i = 1; i <= totalPages; i++) {
          const button = document.createElement("button");
          button.classList.add("page-number");
          button.textContent = i;
          if (i === currentPage) button.classList.add("active");

          button.addEventListener("click", () => {
              currentPage = i;
              renderTable();
          });

          paginationContainer.appendChild(button);
      }

      // Enable/disable prev and next buttons
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;
  }

  prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
          currentPage--;
          renderTable();
      }
  });

  nextPageBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
          currentPage++;
          renderTable();
      }
  });

  // Initial render
  renderTable();
});
