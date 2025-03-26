export function setActiveNavLink() {

    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').filter(Boolean);

    if (currentPath.length > 1) {
        const parentDir = currentPath[1];

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').filter(Boolean);
            if (linkPath.length > 1 && linkPath[1] === parentDir) {
                link.classList.add('active');
            }
        });
    }
}