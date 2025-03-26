export function initializeOverlayTransitions() {
    const overlay = document.getElementById('transition-overlay');

    if (!overlay) {
        console.error('Error: Transition overlay element not found');
        return;
    }

    window.addEventListener('beforeunload', () => {
        overlay.classList.add('active');
    });

    window.addEventListener('load', () => {
        overlay.classList.remove('active');
    });

    window.addEventListener('popstate', () => {
        // Handle back button transitions
        hideOverlay();
    });

    document.addEventListener('DOMContentLoaded', () => {
        // Ensure overlay works across transitions
        hideOverlay();
    });
}

export function showOverlay() {
    const overlay = document.getElementById('transition-overlay');
    if (overlay) {
        overlay.classList.remove('exiting');
        overlay.classList.add('active');
    }
}

export function hideOverlay() {
    const overlay = document.getElementById('transition-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.classList.add('exiting');
    }
}