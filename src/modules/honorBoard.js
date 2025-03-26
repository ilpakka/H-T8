// Create a global tooltip
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
document.body.appendChild(tooltip);

// Fetch the badge data from badge.json
export async function fetchBadgeData() {
  // Check if the current page is the correct page by looking for a specific element
  if (!document.querySelector('#hallOfFamePage')) {
    return;
  }

  try {
    const response = await fetch('/H-T8/hall of fame/badges.json');  // Replace with the correct path to your badge.json file
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const groupedData = groupBadgesByUser(data);  // Group data by recipient
    renderTable(groupedData);  // Render table with grouped data
  } catch (error) {
    console.error("Error fetching badge data:", error);
  }
}

// Group badges by recipient
export function groupBadgesByUser(data) {
  const grouped = {};

  // Group the badges based on recipient
  data.forEach((badge) => {
    const { resipiant, badge_name, date, image, description, flags } = badge;
    
    // If the user doesn't exist in the grouped object, create an empty array for them
    if (!grouped[resipiant]) {
      grouped[resipiant] = {
        user_id: badge.user_id,
        resipiant: resipiant,
        badges: []
      };
    }

    // Add the badge to the user's badge list
    grouped[resipiant].badges.push({
      badge_name,
      date,
      image,
      description,
      flags
    });
  });

  return Object.values(grouped); // Convert grouped object into an array of grouped users
}

export function renderTable(groupedData) {
  const tableBody = document.querySelector('#resourceTable tbody');
  if (!tableBody) {
    console.error("Error: Table body (tbody) not found");
    return;
  }
  tableBody.innerHTML = ''; // Clear previous data

  groupedData.forEach((user) => {
    const row = document.createElement('tr');

    // Create a cell for the user's name and badges
    const userCell = document.createElement('td');
    userCell.innerHTML = `<strong>${user.resipiant}</strong>`;

    const badgesList = user.badges.map(badge => `
      <div class="badge-item">
        <img src="${badge.image}" 
             alt="${badge.badge_name}" 
             class="badge"
             data-badge-name="${badge.badge_name}" 
             data-date="${badge.date || ''}" 
             data-description="${badge.description || ''}" 
             ${badge.flags ? `data-flags="${badge.flags}"` : ''}
        />
      </div>
    `).join('');

    const badgesCell = document.createElement('td');
    badgesCell.innerHTML = badgesList;

    row.appendChild(userCell);
    row.appendChild(badgesCell);

    tableBody.appendChild(row);
  });

  // After rendering, attach hover handlers to badges
  document.querySelectorAll('.badge').forEach((badge) => {
    badge.addEventListener('mouseenter', (e) => {
      let metadata = `<strong>${badge.getAttribute('data-badge-name')}</strong>`;

      // Show only non-empty attributes
      const date = badge.getAttribute('data-date');
      if (date) metadata += `<br><strong>Date: </strong>${date}`;

      const description = badge.getAttribute('data-description');
      if (description) metadata += `<br><strong>Description: </strong>${description}`;

      const flags = badge.getAttribute('data-flags');
      if (flags) metadata += `<br><strong>Flags: </strong>${flags}`;

      tooltip.innerHTML = metadata;

      const rect = badge.getBoundingClientRect();

      tooltip.style.left = `${rect.left + rect.width - 150}px`;
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = '1';
    });

    badge.addEventListener('mouseleave', () => {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = '0';
    });
  });
}