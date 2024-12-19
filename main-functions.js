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
  const links = document.querySelectorAll(".flapper-link"); // Select all links
  const scrambleChars = "!@#$%^&*()_+<>?|~{}[]";

  links.forEach((link) => {
    const text = link.textContent;
    link.textContent = ""; // Clear the link text content

    // Wrap each character in a <span>
    text.split("").forEach((char, index) => {
      const charSpan = document.createElement("span");
      charSpan.textContent = char;
      charSpan.dataset.original = char; // Store the original character
      charSpan.style.transitionDelay = `${index * 0.05}s`;
      link.appendChild(charSpan);
    });

    // Add hover effect
    link.addEventListener("mouseover", () => {
      const chars = link.querySelectorAll("span");
      let isAnimating = true; // Flag to track the animation state

      // Stop animation after 300ms
      setTimeout(() => {
        isAnimating = false;
      }, 320);

      chars.forEach((span, index) => {
        const originalChar = span.dataset.original;
        let scrambleTimeout = setInterval(() => {
          if (!isAnimating) {
            clearInterval(scrambleTimeout); // Stop scrambling
            span.textContent = originalChar; // Reset to original
            return;
          }
          span.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }, 60); // Faster scrambling
      });
    });
  });
});


// PAGE TRANSITION

const overlay = document.getElementById('transition-overlay');

// Handle fade-in on page load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    overlay.classList.add('hidden');
  }, 50); // Slight delay for smooth fade-in
});

// Handle link navigation with fade-out
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault(); // Prevent default link behavior

    const href = link.getAttribute('href'); // Get the link's href

    // Trigger fade-out animation
    overlay.classList.remove('hidden');

    // Push the new state to the history
    setTimeout(() => {
      window.location.href = href;
    }, 100); // Match CSS transition duration
  });
});

// Handle back/forward button navigation
window.addEventListener('popstate', () => {
  overlay.classList.remove('hidden'); // Show overlay for smooth transition
  setTimeout(() => {
    overlay.classList.add('hidden'); // Fade out after loading the previous page
  }, 50); // Adjust delay for fade-out
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
