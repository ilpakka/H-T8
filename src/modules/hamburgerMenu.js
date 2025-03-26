export function setupHamburgerMenu() {
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
  }