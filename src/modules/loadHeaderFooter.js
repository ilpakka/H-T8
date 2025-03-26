import { setActiveNavLink } from './setActiveNavLink.js';

export function loadHeaderFooter(callback) {
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');
  
    const loadHeader = fetch('/H-T8/src/modules/header.html')
      .then(response => response.text())
      .then(data => {
        if (headerContainer) {
          headerContainer.innerHTML = data;
          setActiveNavLink(); // Set active class after loading header
        }
      });
  
    const loadFooter = fetch('/H-T8/src/modules/footer.html')
      .then(response => response.text())
      .then(data => {
        if (footerContainer) {
          footerContainer.innerHTML = data;
        }
      });
  
    Promise.all([loadHeader, loadFooter]).then(() => {
      if (typeof callback === 'function') {
        callback();
      }
    });
}