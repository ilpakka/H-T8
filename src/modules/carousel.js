let currentIndex = 0;
let events = [];
let interval;

export async function loadEvents() {
  try {
    const response = await fetch('/H-T8/hall of fame/events.json'); // Adjust path if needed
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    events = await response.json();
    renderCarousel(events);

    if (events.length > 1) {
      startCarousel(); // Start sliding if more than one event exists
    }
} catch (error) {
  console.error('Failed to load events:', error);
}
}

export function renderCarousel(events) {
  const track = document.querySelector('.carousel-track');
  track.innerHTML = events.map(event => `
    <div class="carousel-slide">
    <a class="none-link" href="${event.link}" target="_blank">
      <img class="throphy" src="${event.icon}">
      <img src="${event.image}">
      <h3 class="h4">${event.title}</h3>
      <p>${event.date}</p>
      <p><b>Event location: </b>${event.location}</p>
      <p><b>Finishing position: </b>${event.finishing_position}</p>
      <p><b>Team size: </b>${event.team_size}</p>
      <p><b>Flags Obtained: </b>${event.flags}</p>
      <p class="space">${event.description}</p>
      <div class="tags">
        ${event.tag1 ? `<span class="tag">${event.tag1}</span>` : ""}
        ${event.tag2 ? `<span class="tag">${event.tag2}</span>` : ""}
        ${event.tag3 ? `<span class="tag">${event.tag3}</span>` : ""}
        ${event.tag4 ? `<span class="tag">${event.tag4}</span>` : ""}
      </div>
      </a>
    </div>
  `).join('');

  // Reset position
  currentIndex = 0;
  updateCarousel();
}

export function updateCarousel() {
  const track = document.querySelector('.carousel-track');
  const slideWidth = track.children[0].clientWidth;
  track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
}

export function moveSlide(direction) {
  if (events.length <= 1) return; // Don't slide if only one event
  
  currentIndex += direction;

  // Handle looping
  if (currentIndex < 0) {
    currentIndex = events.length - 1;
  } else if (currentIndex >= events.length) {
    currentIndex = 0;
  }

  updateCarousel();

  // Restart the timer after manual interaction
  resetCarouselTimer();
}

export function startCarousel() {
  interval = setInterval(() => {
    moveSlide(1);
  }, 10000);
}

export function resetCarouselTimer() {
  clearInterval(interval);
  startCarousel();
}
