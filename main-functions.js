// DYNAMIC EVENTS

// Function to get the next occurrence of a recurring event
function getNextOccurrence(eventDate, recurrence) {
  if (!eventDate) {
    return null; // If date is null or undefined, return null
  }

  const now = new Date();
  let nextDate = new Date(eventDate);

  if (isNaN(nextDate.getTime())) {
    console.error("Invalid date for recurrence:", eventDate);
    return null;
  }

  // Handle different recurrence types
  if (recurrence === "weekly") {
    while (nextDate <= now) {
      nextDate.setDate(nextDate.getDate() + 7);
    }
  } else if (recurrence === "daily") {
    while (nextDate <= now) {
      nextDate.setDate(nextDate.getDate() + 1);
    }
  } else if (recurrence === "monthly") {
    while (nextDate <= now) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
  } else if (recurrence === "yearly") {
    while (nextDate <= now) {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
  }

  return nextDate;
}

// Function to render events in all containers with the specified class
function renderEvents(containerClass, eventFilter = {}, recurrence = "weekly") {
  fetch("/H-T8/toiminta/events.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {


      const containers = document.querySelectorAll(`.${containerClass}`);
      if (containers.length === 0) {
        console.warn("No containers found with class:", containerClass);
        return;
      }

      const today = new Date();
      const events = data.map(event => {
        // Ensure date is in ISO 8601 format for Safari compatibility
        let eventDate = null;

        if (event.date) {
          eventDate = Date.parse(event.date);
          if (isNaN(eventDate)) {
            console.error("Invalid date format in event:", event);
            return { ...event, date: null };
          }
          eventDate = new Date(eventDate);
        }

        // Handle recurring events
        if (event.recurring && eventDate) {
          const nextOccurrence = getNextOccurrence(eventDate, event.recurrence || recurrence);
          return { ...event, date: nextOccurrence ? nextOccurrence.toISOString() : null };
        }
        return event;
      });

      // Apply event filtering (if any)
      const filteredEvents = events.filter(event => {
        let matchesFilter = true;

        // Example filter: event.title or event.tag1 matching criteria
        if (eventFilter.title && !event.title.toLowerCase().includes(eventFilter.title.toLowerCase())) {
          matchesFilter = false;
        }

        if (eventFilter.tag && event.tag1 !== eventFilter.tag && event.tag2 !== eventFilter.tag) {
          matchesFilter = false;
        }

        return matchesFilter;
      });

      console.log("Filtered events:", filteredEvents);

      // Filter upcoming events
      const upcomingEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.date);
        return event.date && eventDate >= today;
      });
      upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

      console.log("Upcoming events:", upcomingEvents);

      // Render the events in each container
      containers.forEach(container => {
        container.innerHTML = upcomingEvents.length
          ? upcomingEvents
              .map(event => {
                let formattedDate;

                if (event.date === null || event.date === "TBA") {
                  formattedDate = "TBA";
                } else {
                  formattedDate = new Date(event.date).toLocaleString("fi-FI", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h23"
                  });
                }

                return `
                  <div class="event">
                    <h2 class="h4">${event.title}</h2>
                    ${event.showDate ? `<p><strong>Date:</strong> ${formattedDate}</p>` : ""}
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p>${event.description}</p>
                    <div class="tags">
                      ${event.tag1 ? `<span class="tag">${event.tag1}</span>` : ""}
                      ${event.tag2 ? `<span class="tag">${event.tag2}</span>` : ""}
                    </div>
                  </div>
                `;
              })
              .join("")
          : '<p class="paragraph">No upcoming events</p>';
      });
    })
    .catch(error => console.error("Error fetching JSON:", error));
}

// Here are all of the event classes and their properties:
// Make new classes for each type of event. These elements are dynamically created in the renderEvents function.

// Also remember to add relevant css and html for the new classes


document.addEventListener("DOMContentLoaded", () => {
  // Render events in all containers
  renderEvents("events-container-2", { title: "Hakkerointi ilta" });

  renderEvents("events-container-CTF", { title: "CTF" });



  // Render all events in another section
  renderEvents("events-container-all");
});




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

function showOverlay() {
    overlay.classList.remove('exiting');
    overlay.classList.add('active');
}

function hideOverlay() {
    overlay.classList.remove('active');
    overlay.classList.add('exiting');
}

window.addEventListener('popstate', () => {
    // Handle back button transitions
    hideOverlay();
});

document.addEventListener('DOMContentLoaded', () => {
    // Ensure overlay works across transitions
    hideOverlay();
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
  const tables = document.querySelectorAll("#resourceTable");

  tables.forEach((table) => {
    const tbody = table.querySelector("tbody");
    if (!tbody) {
      console.error("Error: Table body (tbody) not found for table", table);
      return;
    }

    const paginationContainer = table.closest(".table-container").querySelector(".pagination");
    const paginationPageNumbers = table.closest(".table-container").querySelector(".page-numbers");
    const prevPageBtn = table.closest(".table-container").querySelector(".prev-page");
    const nextPageBtn = table.closest(".table-container").querySelector(".next-page");

    if (!paginationContainer || !paginationPageNumbers || !prevPageBtn || !nextPageBtn) {
      console.error("Error: Pagination elements not found for table", table);
      return;
    }

    const rowsPerPage = 5;
    let currentPage = 1;
    const totalRows = tbody.rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    function renderTable() {
      // Hide all rows
      for (let i = 0; i < totalRows; i++) {
        tbody.rows[i].style.display = "none";
      }

      // Show rows for the current page
      const start = (currentPage - 1) * rowsPerPage;
      const end = Math.min(start + rowsPerPage, totalRows);

      for (let i = start; i < end; i++) {
        tbody.rows[i].style.display = "table-row";
      }

      // Update pagination buttons
      renderPagination();
    }

    function renderPagination() {
      paginationPageNumbers.innerHTML = ""; // Clear pagination buttons

      // Hide the entire pagination container if there is only one page
      if (totalPages <= 1) {
        paginationContainer.style.display = "none";
        return;
      } else {
        paginationContainer.style.display = "flex"; // Ensure pagination is visible if there are multiple pages
      }

      // Create page number buttons
      for (let i = 1; i <= totalPages; i++) {
        const start = (i - 1) * rowsPerPage;
        const end = Math.min(start + rowsPerPage, totalRows);

        // Only add buttons for pages with content
        if (start < totalRows) {
          const button = document.createElement("button");
          button.classList.add("page-number");
          button.textContent = i;

          // Highlight the active page
          if (i === currentPage) {
            button.classList.add("active");
          }

          button.addEventListener("click", () => {
            currentPage = i;
            renderTable();
          });

          paginationPageNumbers.appendChild(button);
        }
      }

      // Enable/disable prev and next buttons based on the current page
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;
    }

    // Event listeners for prev and next buttons
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
});

