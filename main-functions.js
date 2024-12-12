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

// Handle fade-in on page load
window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('transition-overlay');
  setTimeout(() => {
    overlay.classList.add('hidden');
  }, 50); // Slight delay for smooth fade-in
});

// Handle link navigation with fade-out
const links = document.querySelectorAll('a');

links.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault(); // Prevent default navigation

    const href = link.getAttribute('href'); // Get the href attribute
    const overlay = document.getElementById('transition-overlay');

    // Trigger fade-out animation
    overlay.classList.remove('hidden');

    // Wait for the animation to complete, then navigate
    setTimeout(() => {
      window.location.href = href;
    }, 100); // Match the CSS transition duration
  });
});