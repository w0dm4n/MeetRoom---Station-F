# MeetRoom — UI/UX Redesign

Improve the overall UI/UX of this existing website. Review the current codebase, identify pain points (layout, typography, color contrast, spacing, responsiveness, navigation flow, accessibility), and implement a polished, modern redesign. The end result should feel cohesive, professional, and visually refined.

Tech stack chosen by the user: HTML/CSS/JS (Vanilla)
You MUST use this stack. Do not suggest or use a different one.

## Static Output Constraint
The output MUST be fully static files — NO build step, NO dev server, NO package.json required.
- The project must work by simply opening index.html in a browser
- Use CDN links for libraries (Tailwind CSS via CDN, Alpine.js, GSAP, AOS, etc.)
- All assets (images, fonts, icons) must use relative paths
- Do NOT use React, Vue, Next.js, Vite, or any framework requiring npm/node
- Keep structure simple: index.html at root, css/ folder, js/ folder, images/ folder

---

## Architecture

### Tech Stack
- **HTML5** — semantic markup, ARIA attributes for accessibility
- **CSS** — custom design system via CSS custom properties (no framework)
- **JavaScript** — vanilla ES6+, no dependencies
- **Fonts** — Inter (Google Fonts CDN)

### File Structure
```
/
├── index.html          # Home page — hero, features, stats, CTA
├── rooms.html          # Rooms listing — search, filter, reserve
├── reservations.html   # Reservations listing
├── css/
│   └── main.css        # Full design system + all component styles
├── js/
│   └── app.js          # Navigation, rooms page, reservations page logic
└── PROJECT.md
```

### API Integration
All pages connect to the existing backend at `http://localhost:8080`.

Endpoints used:
- `GET /rooms` — fetch all rooms
- `POST /reservations` — create a reservation (`{ roomId, date }`)
- `GET /reservations` — fetch all reservations

---

## Design System (`css/main.css`)

### Color Tokens
| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#2563eb` | Buttons, links, accents |
| `--color-primary-hover` | `#1d4ed8` | Hover state |
| `--color-primary-light` | `#eff6ff` | Backgrounds, badges |
| `--color-text-heading` | `#0f172a` | Headings |
| `--color-text-body` | `#334155` | Body text |
| `--color-text-muted` | `#64748b` | Supporting text |
| `--color-border` | `#e2e8f0` | Card borders, dividers |
| `--color-bg` | `#f8fafc` | Page background |
| `--color-surface` | `#ffffff` | Card/panel surfaces |
| `--color-success` | `#16a34a` | Success alerts |
| `--color-error` | `#dc2626` | Error alerts |
| `--color-accent` | `#7c3aed` | Secondary accent (CTA gradient) |

### Typography
- Font: **Inter** (400, 500, 600, 700)
- Scale: xs (0.75rem) → 5xl (3rem), defined as CSS variables
- All headings use `letter-spacing: -0.02em` for a modern feel

### Spacing
All spacing uses CSS custom properties: `--space-1` through `--space-24` (0.25rem steps).

### Components
- **Navigation** — sticky, frosted glass, with responsive hamburger menu and dropdown
- **Hero** — dark gradient with grid overlay, animated badge, stat strip
- **Feature cards** — icon + heading + description, hover lift effect
- **Room cards** — image area, capacity badge, tags, date picker, reserve button
- **Reservation cards** — icon, equipment tags, date pill
- **Search bar** — custom-styled select + text input
- **Alerts** — success/error with dismiss button, entrance animation
- **Empty/error states** — illustrated with helpful CTAs
- **Skeleton loaders** — shimmer placeholders during API fetch
- **Footer** — dark, 4-column grid, copyright

### Accessibility
- Semantic HTML5 (`nav`, `main`, `header`, `footer`, `article`, `section`)
- ARIA roles: `navigation`, `main`, `contentinfo`, `alert`, `status`, `search`
- `aria-live` regions for dynamic content updates
- Focus management on mobile menu close
- Keyboard navigation: Escape to close menus
- `aria-label` and `aria-labelledby` throughout
- Color contrast: all text meets WCAG AA minimums
- `sr-only` class for screen-reader-only content

### Responsiveness
Three breakpoints:
- `≤1024px` — single-column hero, 2-col features grid, 2-col footer
- `≤768px` — collapsed nav (hamburger), stacked search bar, single-col rooms
- `≤480px` — reduced font sizes, tighter spacing

---

## Pages

### Home (`index.html`)
- Sticky navigation with logo, links, dropdown, CTA button
- Hero with gradient background, headline, stats, and live rooms preview card
- Stats strip (4 metrics)
- 6-card features section
- CTA banner with gradient background
- 4-column footer

### Rooms (`rooms.html`)
- Page header with title and description
- Search bar: filter by name / capacity / equipment
- Auto-updating results count
- Rooms grid: rendered from API via `fetch()`
- Skeleton loaders during fetch
- Empty state when no results match search
- Error state if API is unreachable (with retry button)
- Reservation form inline on each card (date picker + button)
- Alert banners for success/error after reservation attempt

### Reservations (`reservations.html`)
- Page header with "New booking" CTA button
- Reservations grid: rendered from API via `fetch()`
- Skeleton loaders during fetch
- Empty state with link to browse rooms
- Error state with retry button
- Each card shows: room name, equipment tags, description, formatted date

---

## Pain Points Fixed (vs. original Angular app)

| Issue | Fix |
|---|---|
| Outdated Hotel Empire theme (~2015 era) | New custom design system with modern tokens |
| Single red accent (`#ed5565`) — low contrast | Blue primary (`#2563eb`) passes WCAG AA |
| Serif/sans-serif font inconsistency | Single typeface: Inter, systematic scale |
| Excessive/inconsistent spacing | Design token system — `--space-*` variables |
| Basic box shadows, no elevation hierarchy | 5-level shadow scale (`xs` → `xl`) |
| No empty/error states | Designed empty + error states on all data pages |
| No loading feedback | Skeleton loaders with shimmer animation |
| Date picker positioned with `position: absolute; margin-left: 8px; margin-top: -20px` | Proper flexbox layout, inline date group |
| Footer: just a single copyright line | 4-column footer with links, brand copy, copyright |
| Angular framework — not openable as static | Pure HTML/CSS/JS, works by opening index.html |
| No ARIA labels, no keyboard navigation | Full ARIA + keyboard-accessible navigation |
| Mobile: relied on Bootstrap without refinement | Custom responsive breakpoints, hamburger menu |
