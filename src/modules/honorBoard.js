// Create a global tooltip
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
document.body.appendChild(tooltip);

// Helper functions for ranking management
function getPreviousRankings() {
  const stored = localStorage.getItem('hallOfFameRankings');
  return stored ? JSON.parse(stored) : {};
}

function saveCurrentRankings(snapshot) {
  localStorage.setItem('hallOfFameRankings', JSON.stringify(snapshot.rankings));
  localStorage.setItem('hallOfFameDataHash', snapshot.hash);
}

function createRankingSnapshot(groupedData) {
  const rankings = {};
  const dataForHash = [];
  
  groupedData.forEach((user, index) => {
    rankings[user.resipiant] = {
      rank: index + 1,
      badgeCount: user.badges.length
    };
    // Create a string representation for change detection
    dataForHash.push(`${user.resipiant}:${user.badges.length}`);
  });
  
  // Create a simple hash of the data
  const hash = dataForHash.join('|');
  
  return { rankings, hash };
}

function hasDataChanged(currentSnapshot) {
  const previousHash = localStorage.getItem('hallOfFameDataHash');
  return previousHash !== currentSnapshot.hash;
}

function getMovementIndicator(username, currentRank, previousRankings, dataChanged) {
  if (!dataChanged || !previousRankings[username]) {
    return '<span class="rank-indicator rank-new">●</span>';
  }
  
  const previousRank = previousRankings[username].rank;
  const movement = previousRank - currentRank; // Positive = moved up, Negative = moved down
  
  if (movement > 0) {
    return `<span class="rank-indicator rank-up" title="Up ${movement} position${movement > 1 ? 's' : ''}">▲</span>`;
  } else if (movement < 0) {
    return `<span class="rank-indicator rank-down" title="Down ${Math.abs(movement)} position${Math.abs(movement) > 1 ? 's' : ''}">▼</span>`;
  } else {
    return '<span class="rank-indicator rank-same">━</span>';
  }
}

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

  // Convert grouped object into an array and sort by badge count (most to least)
  const groupedArray = Object.values(grouped);
  groupedArray.sort((a, b) => b.badges.length - a.badges.length);
  
  return groupedArray;
}

export function renderTable(groupedData) {
  const tableBody = document.querySelector('#resourceTable tbody');
  if (!tableBody) {
    console.error("Error: Table body (tbody) not found");
    return;
  }
  tableBody.innerHTML = ''; // Clear previous data

  // Get previous rankings from localStorage
  const previousRankings = getPreviousRankings();
  const currentSnapshot = createRankingSnapshot(groupedData);
  
  // Check if data has actually changed (new badges added)
  const dataChanged = hasDataChanged(currentSnapshot);

  groupedData.forEach((user, index) => {
    const row = document.createElement('tr');
    const currentRank = index + 1;

    // Create rank cell with movement indicator
    const rankCell = document.createElement('td');
    const movementIndicator = getMovementIndicator(user.resipiant, currentRank, previousRankings, dataChanged);
    rankCell.innerHTML = `<div class="rank-cell"><span class="rank-number">${currentRank}</span>${movementIndicator}</div>`;
    rankCell.style.textAlign = 'center';

    // Create a cell for the user's name
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

    row.appendChild(rankCell);
    row.appendChild(userCell);
    row.appendChild(badgesCell);

    tableBody.appendChild(row);
  });

  // Update stored rankings only if data changed
  if (dataChanged) {
    saveCurrentRankings(currentSnapshot);
  }

  // Import and setup pagination after table is populated
  import('./pagination.js').then(module => {
    module.setupPagination();
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