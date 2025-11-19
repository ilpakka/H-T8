export function generateBreadcrumbs() {
  const fullPath = window.location.pathname; // e.g., /red-team/index.html
  const segments = fullPath
    .split('/')
    .filter(segment => segment && segment !== 'index.html'); // Remove empty and "index.html" segments

  const breadcrumbContainer = document.getElementById('breadcrumb-container');
  if (!breadcrumbContainer) {
    return;
  }
  breadcrumbContainer.innerHTML = ''; // Clear existing breadcrumbs

  let currentPath = '';
  segments.forEach((segment, index) => {
    const listItem = document.createElement('li');
    currentPath += `/${sanitize(segment)}`;

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

// Helper function to sanitize input to prevent XSS attacks
function sanitize(input) {
  const element = document.createElement('div');
  element.textContent = input;
  return element.innerHTML;
}

// Ensure breadcrumbs are generated after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", generateBreadcrumbs);