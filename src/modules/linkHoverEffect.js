export function initializeFlapperLinks() {
  const links = document.querySelectorAll(".flapper-link"); // Select all links
  const scrambleChars = "!@#$%^&*()_+<>?|~{}[]";

  links.forEach((link) => {
    const text = link.textContent;
    link.textContent = ""; // Clear the link text content
    wrapCharacters(link, text);
    addHoverEffect(link, scrambleChars);
  });
}

function wrapCharacters(link, text) {
  text.split("").forEach((char, index) => {
      const charSpan = document.createElement("span");
      charSpan.textContent = char;
      charSpan.dataset.original = char; // Store the original character
      charSpan.style.transitionDelay = `${index * 0.05}s`;
      link.appendChild(charSpan);
  });
}

function addHoverEffect(link, scrambleChars) {
  link.addEventListener("mouseover", () => {
      const chars = link.querySelectorAll("span");
      let isAnimating = true; // Flag to track the animation state

      // Stop animation after 320ms
      setTimeout(() => {
          isAnimating = false;
      }, 320);

      chars.forEach((span) => {
          startScrambling(span, scrambleChars, () => isAnimating);
      });
  });
}

function startScrambling(span, scrambleChars, isAnimating) {
  const originalChar = span.dataset.original;
  const scrambleInterval = setInterval(() => {
      if (!isAnimating()) {
          clearInterval(scrambleInterval);
          span.textContent = originalChar;
      } else {
          const randomIndex = Math.floor(Math.random() * scrambleChars.length);
          span.textContent = scrambleChars[randomIndex];
      }
  }, 50);
}