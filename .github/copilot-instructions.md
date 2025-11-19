# AI Copilot Instructions for H-T8 (Hakkerointikerho)

## Project Overview
H-T8 is a static website for a Finnish hacking club (Haaga-Helia's cybersecurity student organization). The site is built with vanilla JavaScript, HTML, and CSS without a build system or framework.

**Key URLs:**
- Homepage: `/index.html`
- Resources: `/resurssit/` (learning materials by topic)
- Events: `/toiminta/` (activities and happenings)
- Hall of Fame: `/hall-of-fame/` (member achievements with badges)
- Contact: `/yhteystiedot/`

## Architecture

### Module System
All JavaScript functionality is organized in `/src/modules/` as ES modules, imported by `main.js`. Each module exports one primary function:

- **`loadHeaderFooter.js`**: Dynamically injects `header.html` and `footer.html` into `#header-container` and `#footer-container`. Triggers callback after both load.
- **`events.js`**: Renders events from `/toiminta/events.json` with filtering and recurrence logic (weekly/biweekly/monthly/yearly).
- **`carousel.js`**: Loads event gallery from `/hall-of-fame/events.json` with slide controls.
- **`honorBoard.js`**: Renders leaderboard from `/hall-of-fame/badges.json`, tracks ranking changes in localStorage.
- **`pagination.js`**: Handles table pagination (10 rows/page) for `#resourceTable` elements.
- **`breadcrumbs.js`**: Auto-generates breadcrumb navigation from URL path.
- **`hamburgerMenu.js`**: Mobile responsive menu toggle.
- **`tableSearch.js`**: Filters rows by input (`#searchInput` → elements with `.searchable` class).
- **`linkHoverEffect.js`**: "Flapper" hover animation for `.flapper-link` elements.
- **`pageTransition.js`**: Fade overlay during navigation.
- **`setActiveNavLink.js`**: Highlights current nav item based on URL path.

### Data Sources
Events and achievements are stored as JSON files:
- `/toiminta/events.json` - Event metadata with recurrence rules
- `/hall-of-fame/badges.json` - Member achievements and rankings
- `/hall-of-fame/events.json` - Historical event gallery

Events use `date` fields in ISO 8601 format and `recurrence` field for scheduling.

### Styling
Single monolithic `main-style.css` (2600+ lines) with CSS custom properties:
- `--primary`: Main text color (`#EEF4ED`)
- `--secondary`: Dim text (`#696969`)
- `--highlight`: Accent green (`#32c743`)
- Font: JetBrains Mono (monospace theme)

## Common Development Patterns

### Adding New Pages
1. Create HTML file in appropriate directory (e.g., `resurssit/new-section/index.html`)
2. Include `<div id="header-container"></div>` and `<div id="footer-container"></div>`
3. Import and call relevant modules in page script (or rely on `main.js` if using standard containers)
4. Modules auto-initialize on `DOMContentLoaded`

### Event Rendering
Use `renderEvents(containerId, {title: "filter"}, "weekly")` with optional filter object. The function calculates next occurrence based on `eventDate` and `recurrence` field from JSON.

```javascript
renderEvents("events-container-2", {title: "Hakkerointi ilta"});
```

### Dynamic Table Features
Tables with ID `#resourceTable` automatically get:
- Pagination (10 rows/page)
- Search via `#searchInput` on `.searchable` elements
- Breadcrumb navigation

### State Management
- **Ranking data**: Stored in `localStorage` (keys: `hallOfFameRankings`, `hallOfFameDataHash`)
- **Navigation state**: Tracked via URL pathname and URL hash (carousel position)

## Integration Points

- **Header/Footer**: Loaded dynamically to all pages; changes propagate site-wide
- **Navigation**: Links use `.flapper-link` class for hover effect and page transitions
- **Badge system**: Ranks computed from badge count; movement indicators compare against previous localStorage snapshot
- **Server requirements**: Needs MIME type support for `.html` files served as text (via `.htaccess` for Apache)

## Key Files to Know
- `/src/main.js` - Entry point; orchestrates all module initialization
- `/src/modules/header.html` - Navigation template; update to change site structure
- `/main-style.css` - All styling; uses CSS custom properties for theme
- `/index.html` - Homepage layout and front-page styling
- `/resurssit/`, `/hall-of-fame/`, `/toiminta/` - Main content directories with their own index.html files
