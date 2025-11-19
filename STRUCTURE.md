# H-T8 Website Structure

## Overall Directory Structure

```
ht8.fi/
├── index.html                          # Homepage
├── main-style.css                      # Main stylesheet (2600+ lines)
├── robots.txt                          # SEO robots file
├── .htaccess                           # Apache server config
│
├── src/                                # JavaScript modules
│   ├── main.js                         # Entry point - initializes all modules
│   └── modules/
│       ├── header.html                 # Navigation header template
│       ├── footer.html                 # Footer template
│       ├── join-section.html           # Reusable join section template
│       ├── loadHeaderFooter.js         # Dynamically loads header/footer
│       ├── loadJoinSection.js          # Dynamically loads join section
│       ├── events.js                   # Renders events with recurrence logic
│       ├── carousel.js                 # Event gallery carousel (10s auto-rotate)
│       ├── pagination.js               # Table pagination (10 rows/page)
│       ├── tableSearch.js              # Filters table rows by search input
│       ├── breadcrumbs.js              # Auto-generates breadcrumbs from URL
│       ├── hamburgerMenu.js            # Mobile responsive menu
│       ├── linkHoverEffect.js          # "Flapper" hover animation for .flapper-link
│       ├── pageTransition.js           # Fade overlay during navigation
│       ├── setActiveNavLink.js         # Highlights current nav item
│       ├── honorBoard.js               # Leaderboard with rankings (localStorage)
│       └── progressTracker.js          # Tracks aloittelijan-opas guide progress
│
├── assets/                             # Static assets organized by section
│   ├── common/                         # Shared assets (3 files)
│   │   ├── main-logo.svg
│   │   ├── Upcloud_Logo-Purple.svg
│   │   ├── Upcloud_Logo_White.svg
│   │   ├── icons8-discord-50.png       # (moved from toiminta/)
│   │   └── icons8-email-50.png         # (moved from toiminta/)
│   ├── aloittelijan-opas/              # Guide screenshots (8 files)
│   │   ├── Screenshot 2025-07-12 at 23.43.40.png
│   │   ├── Screenshot 2025-07-12 at 23.44.06.png
│   │   ├── Screenshot 2025-07-12 at 23.52.59.png
│   │   ├── Screenshot 2025-07-13 at 14.19.58.png
│   │   ├── Screenshot 2025-07-13 at 14.54.56.png
│   │   ├── Pasted image 20250701002636.png
│   │   ├── Pasted image 20250701002831.png
│   │   └── Pasted image 20250701010904.png
│   ├── hall-of-fame/                   # Badge/event images (12 files)
│   │   ├── badges/
│   │   │   └── [7 badge image files]
│   │   └── events/
│   │       └── [5 event image files]
│   ├── resurssit/                      # Category images (18 files)
│   │   ├── Aloittelijan_opas.webp
│   │   ├── blue_team.webp
│   │   ├── red_team.webp
│   │   ├── general.webp
│   │   ├── front_page.webp
│   │   ├── tietoa1-4.webp
│   │   └── [other category images]
│   ├── yhteystiedot/                   # Board member images (2 files)
│   │   └── [board member photos]
│   ├── toiminta/                       # Now empty (icons moved to common/)
│   └── saannot/                        # Reserved (empty)
│
├── aloittelijan-opas/                  # FLATTENED STRUCTURE (moved from /resurssit/general/aloittelijan-opas/)
│   ├── index.html                      # Guide main page
│   ├── section1/
│   │   └── index.html                  # Introduction to Hacking
│   ├── section2/
│   │   └── index.html                  # Setting Up Environment
│   ├── section3/
│   │   └── index.html                  # Basic Hacking Techniques
│   ├── section4/
│   │   └── index.html                  # Tools and Resources
│   ├── section5/
│   │   └── index.html                  # Further Learning
│   ├── section6/
│   │   └── index.html                  # Linux Basics - Tools
│   ├── section7/
│   │   └── index.html                  # Networks in Hacking
│   ├── section8/
│   │   └── index.html                  # Basic Vulnerabilities
│   ├── section9/
│   │   └── index.html                  # Common Weak Spots
│   ├── section10/
│   │   └── index.html                  # [Content]
│   └── section11/
│       └── index.html                  # [Content]
│
├── resurssit/                          # Learning resources organized by category
│   ├── index.html                      # Resources overview
│   ├── general/
│   │   ├── index.html
│   │   ├── getting-started-with-hacking.html
│   │   ├── project-template.html
│   │   └── ctf-write-ups/
│   │       └── index.html
│   ├── blue-team/
│   │   ├── index.html
│   │   ├── digital-forensics/
│   │   │   └── index.html
│   │   ├── incident-response/
│   │   │   └── index.html
│   │   ├── network-defence/
│   │   │   └── index.html
│   │   └── threat-hunting/
│   │       └── index.html
│   └── red-team/
│       ├── index.html
│       ├── cryptography/
│       │   └── index.html
│       ├── OSINT/
│       │   └── index.html
│       ├── reverse-engineering/
│       │   └── index.html
│       └── web-security/
│           └── index.html
│
├── hal l-of-fame/                      # Member achievements & history
│   ├── index.html                      # Leaderboard page
│   ├── badges.json                     # Badge definitions (40+ entries)
│   └── events.json                     # Historical event gallery (4 events)
│
├── toiminta/                           # Club activities & events
│   ├── index.html
│   └── events.json                     # Event metadata with recurrence rules
│
├── yhteystiedot/                       # Contact information
│   └── index.html                      # Board members & contact details
│
├── saannot/                            # Club rules
│   └── index.html
│
├── licenses/                           # License files
│   └── LICENSE
│
├── .github/
│   └── copilot-instructions.md         # AI agent instructions (created)
│
└── .git/                               # Git repository

```

## Key Changes from Original Structure

### 1. **Aloittelijan-Opas Flattened**
- **Old**: `/resurssit/general/aloittelijan-opas/sections/section1/`
- **New**: `/aloittelijan-opas/section1/`
- **Result**: 4 levels → 2 levels

### 2. **Assets Reorganized**
- **Icon files**: Moved from `/assets/toiminta/` → `/assets/common/`
  - `icons8-discord-50.png`
  - `icons8-email-50.png`
- **Guide screenshots**: Moved to `/assets/aloittelijan-opas/`
- **All asset references updated** (121+ paths across HTML, CSS, JSON)

### 3. **Join Section Extracted**
- Created `/src/modules/join-section.html` template
- Created `/src/modules/loadJoinSection.js` dynamic loader
- Used on `/index.html` and `/toiminta/index.html`
- Links now use `.icon-link` as proper anchor tags

## Module Dependencies

```
main.js
├── loadHeaderFooter.js
├── setActiveNavLink.js
├── setupHamburgerMenu.js
├── initializeFlapperLinks.js (linkHoverEffect.js)
├── hideOverlay.js (pageTransition.js)
├── generateBreadcrumbs.js
├── setupPagination.js
├── setupTableSearch.js
├── fetchBadgeData.js (honorBoard.js)
├── loadEvents.js (carousel.js)
└── loadJoinSection.js

Other pages:
└── progressTracker.js (aloittelijan-opas only)
```

## Data Files

### Events
- `/toiminta/events.json` - Club events with recurrence rules (ISO 8601 dates)
- `/hall-of-fame/events.json` - Historical event gallery

### Achievements
- `/hall-of-fame/badges.json` - Badge definitions with images and point values

## CSS Architecture

- **Main stylesheet**: `main-style.css` (2600+ lines)
- **Architecture**: Single monolithic file with nested SCSS syntax
- **Variables**: CSS custom properties
  - `--primary`: Main text color (`#EEF4ED`)
  - `--secondary`: Dim text (`#696969`)
  - `--highlight`: Accent green (`#32c743`)
- **Font**: JetBrains Mono (monospace theme)

## Navigation Flow

```
Homepage (/)
├── Resurssit (/resurssit/)
│   ├── General
│   │   ├── Aloittelijan Opas (/aloittelijan-opas/)
│   │   │   ├── Section 1-11 (/aloittelijan-opas/section1-11/)
│   │   │   └── Progress tracked in localStorage
│   │   ├── CTF Write-ups
│   │   └── Project Template
│   ├── Blue Team
│   │   ├── Digital Forensics
│   │   ├── Incident Response
│   │   ├── Network Defence
│   │   └── Threat Hunting
│   └── Red Team
│       ├── Cryptography
│       ├── OSINT
│       ├── Reverse Engineering
│       └── Web Security
├── Toiminta (/toiminta/)
│   └── Events from JSON (recurring events)
├── Hall of Fame (/hall-of-fame/)
│   └── Leaderboard with badges
├── Yhteystiedot (/yhteystiedot/)
│   └── Board member info
└── Säännöt (/saannot/)
    └── Club rules
```

## Special Features

### Dynamic Loading
- Header/Footer injected dynamically via `loadHeaderFooter.js`
- Join section injected via `loadJoinSection.js` (fetch-based)
- Both use `.html` template files

### Interactive Elements
- **Events**: Rendered with recurrence calculation (weekly/biweekly/monthly/yearly)
- **Carousel**: 10-second auto-rotation for event gallery
- **Pagination**: Automatic 10-row pagination for resource tables
- **Search**: Real-time table filtering by search input
- **Breadcrumbs**: Auto-generated from URL path
- **Progress Tracking**: Guide completion tracked in localStorage
- **Leaderboard**: Ranking changes tracked with visual indicators (▲/▼/━)

### Mobile Responsive
- Hamburger menu for mobile navigation
- Responsive CSS grid/flex layouts
- Hidden elements on mobile (`.hide-on-mobile`)

## Language

- **Primary**: Finnish (Suomi)
- **Guide**: English (for accessibility)
- **All filenames**: Preserved original naming (no renaming of concepts)
