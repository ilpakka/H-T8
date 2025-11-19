export function setActiveNavLink() {

    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').filter(Boolean);

    if (currentPath.length > 0) {
        let parentDir = currentPath[0];

        // Special case: aloittelijan-opas is part of resources
        if (parentDir === 'aloittelijan-opas') {
            parentDir = 'resurssit';
        }

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').filter(Boolean);
            if (linkPath.length > 0 && linkPath[0] === parentDir) {
                link.classList.add('active');
            }
        });
    }
}