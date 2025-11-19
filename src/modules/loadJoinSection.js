/**
 * Dynamically loads the join section template from join-section.html
 * Insert by adding: <div id="join-section-container"></div> where you want it to appear
 */
export function loadJoinSection() {
    const container = document.getElementById('join-section-container');
    if (!container) {
        console.warn('Join section container not found');
        return Promise.resolve();
    }

    // Try multiple fetch paths to handle different scenarios
    const fetchPath = '/src/modules/join-section.html';

    return fetch(fetchPath, { cache: 'no-store' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, path: ${fetchPath}`);
            }
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            // Re-initialize any event listeners or effects if needed
            console.log('Join section loaded successfully');
        })
        .catch(error => {
            console.error('Error loading join section:', error);
            container.innerHTML = '<p style="color: red; padding: 20px;">Error loading join section - ' + error.message + '</p>';
        });
}
