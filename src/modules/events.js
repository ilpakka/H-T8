export function getNextOccurrence(eventDate, recurrence) {
  if (!eventDate) {
    return null; // If date is null or undefined, return null
  }

  const now = new Date();
  let nextDate = new Date(eventDate);

  if (isNaN(nextDate.getTime())) {
    console.error("Invalid date for recurrence:", eventDate);
    return null;
  }

  const recurrenceHandlers = {
    weekly: () => addDays(nextDate, 7, now),
    biweekly: () => addDays(nextDate, 14, now),
    daily: () => addDays(nextDate, 1, now),
    monthly: () => addMonths(nextDate, 1, now),
    yearly: () => addYears(nextDate, 1, now),
  };

  const handler = recurrenceHandlers[recurrence];
  if (handler) {
    handler();
  }

  return nextDate;
}

function addDays(date, days, now) {
  while (date <= now) {
    date.setDate(date.getDate() + days);
  }
}

function addMonths(date, months, now) {
  while (date <= now) {
    date.setMonth(date.getMonth() + months);
  }
}

function addYears(date, years, now) {
  while (date <= now) {
    date.setFullYear(date.getFullYear() + years);
  }
}
  
  export function renderEvents(containerClass, eventFilter = {}, recurrence = "weekly") {
    fetch("/toiminta/events.json")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const containers = document.querySelectorAll(`.${containerClass}`);
        if (containers.length === 0) {
          console.info("No containers found with class:", containerClass);
          return;
        }
  
        const today = new Date();
        const events = data.map(event => {
          // Ensure date is in ISO 8601 format for Safari compatibility
          let eventDate = null;
  
          if (event.date) {
            eventDate = Date.parse(event.date);
            if (isNaN(eventDate)) {
              console.error("Invalid date format in event:", event);
              return { ...event, date: null };
            }
            eventDate = new Date(eventDate);
          }
  
          // Handle recurring events
          if (event.recurring && eventDate) {
            const nextOccurrence = getNextOccurrence(eventDate, event.recurrence || recurrence);
            return { ...event, date: nextOccurrence ? nextOccurrence.toISOString() : null };
          }
          return event;
        });
  
        // Apply event filtering (if any)
        const filteredEvents = events.filter(event => {
          let matchesFilter = true;
  
          // Example filter: event.title or event.tag1 matching criteria
          if (eventFilter.title && !event.title.toLowerCase().includes(eventFilter.title.toLowerCase())) {
            matchesFilter = false;
          }
  
          if (eventFilter.tag && event.tag1 !== eventFilter.tag && event.tag2 !== eventFilter.tag) {
            matchesFilter = false;
          }
  
          return matchesFilter;
        });
  
        // Filter upcoming events
        const upcomingEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.date);
          return event.date && eventDate >= today;
        });
        upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  
        // Render the events in each container
        containers.forEach(container => {
          container.innerHTML = upcomingEvents.length
            ? upcomingEvents
              .map(event => {
                let formattedDate;
  
                if (event.date === null || event.date === "TBA") {
                  formattedDate = "TBA";
                } else {
                  formattedDate = new Date(event.date).toLocaleString("fi-FI", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h23"
                  });
                }
  
                return `
                ${event.link ? `<a href="${event.link}" target="_blank" class="event-link">` : ""}
                  <div class="event">
                    <h2 class="h4">
                      ${event.title}
                      ${event.link ? `<span class="event-icon" aria-label="Event Link">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1160 960 960"><path d="m242-246-42-42 412-412H234v-60h480v480h-60v-378L242-246Z"/>
                      </svg>
                      </span>` : ""}
                    </h2>
                    ${event.showDate ? `<p><strong>Date:</strong> ${formattedDate}</p>` : ""}
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p>${event.description}</p>
                    
                    <div class="tags">
                      ${event.tag1 ? `<span class="tag">${event.tag1}</span>` : ""}
                      ${event.tag2 ? `<span class="tag">${event.tag2}</span>` : ""}
                      ${event.tag3 ? `<span class="tag">${event.tag3}</span>` : ""}
                    </div>
                  </div>
                ${event.link ? `</a>` : ""}
              `;
              })
              .join("")
            : '<p class="paragraph">No upcoming events</p>';
        });
      })
      .catch(error => console.error("Error fetching JSON:", error));
  }
