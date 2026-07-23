# Changelog

All notable changes to Armory are documented here.

---

## [1.6.0] — 2026-07-22

### Added
- **Submit feedback on every form** — clicking any submit button now disables it and shows a spinner ("Saving…" or "Uploading…" for file uploads) until the page navigates. Forms are plain POSTs with a full-page redirect after, so large video uploads previously looked frozen with no indication anything was happening.

---

## [1.5.2] — 2026-07-22

### Fixed
- **CSRF Origin check broke form submissions behind a TLS-terminating reverse proxy.** Re-enabling Astro's built-in Origin check in 1.5.1 broke form submissions ("Cross-site POST form submissions are forbidden") for anyone running behind a reverse proxy that terminates HTTPS, because Astro computes the request's own origin from the raw socket — which is always plain HTTP from the app's point of view — while the browser's real `Origin` header is `https://`. The `ORIGIN` env var this app has always documented was never actually wired into anything and silently did nothing.
- Replaced Astro's built-in check with an equivalent one in `src/middleware/index.ts` that correctly trusts the `ORIGIN` env var as the source of truth when set. No config changes needed if you already had `ORIGIN` set per the docs — it will just start working.

---

## [1.5.1] — 2026-07-22

### Security
- **Fixed a full authentication bypass.** The session cookie previously checked against a hardcoded, publicly-known constant value rather than a real secret — anyone who could reach an Armory instance over the network could bypass login entirely by setting `armory_session=authenticated`, without ever knowing `ARMORY_PASSWORD`. Sessions now use a random, per-install secret generated on first run and persisted in `data/`, compared with a constant-time check.
- Password comparison now uses a constant-time comparison instead of `===`, closing a theoretical timing side-channel.
- Re-enabled Astro's built-in CSRF Origin-header check (previously disabled in `astro.config.mjs`).
- **Upgrading is strongly recommended for everyone**, especially anyone exposing Armory beyond localhost (even behind a reverse proxy/VPN, since anyone with access to that network segment could previously have bypassed login). Existing sessions will be invalidated by this update — you'll need to log in again with your password.

---

## [1.5.0] — 2026-07-22

### Added
- **USPSA Matches** (`/matches`) — manual-entry match/stage tracker for USPSA competitors
  - Log a match with overall place/%, points lost, hit factor totals, and A/C/D/M/NS counts, matching the fields shown in the PractiScore app
  - Add stages one at a time with place/%, hit factor, time, and hit counts; % trend chart across matches
  - Attach video per-stage or match-wide (upload a file or paste a YouTube/Vimeo link) — clips also show up in the Footage library linked back to their match
  - Sidebar nav entry "Matches"

---

## [1.4.0] — 2026-07-21

### Added
- **Receipts** (`/receipts`) — expense tracking for range trips and purchases
  - Log a receipt with date, vendor, total, category (ammo/range fee/gear/firearm/accessory/other), photo/PDF, and notes
  - Link a receipt to a range session or an ammo purchase; linked receipts surface inline on the session detail and ammo purchase log pages
  - Sidebar nav entry under Reports
- **NFA Item firearm type** — added "NFA Item" alongside "Other" as a firearm category, available when adding/editing a firearm and in the vault filter tabs

---

## [1.3.1] — 2026-07-11

### Added
- **Quick Log location field** — optional Location / Range input on the Quick Log page so sessions it creates count toward range memberships
  - Prefilled from today's session, the most recent session's location, or the active membership name
  - Past-locations autocomplete (same datalist as New Session)
  - Backfills the location onto today's session if it was created earlier without one (never overwrites an existing location)

---

## [1.3.0] — 2026-06-06

### Added
- **Range Memberships & Pricing** (`/ranges`) — track range memberships alongside hourly and day-rate walk-in pricing
  - Log monthly membership fee, hourly walk-in rate, and day rate per range
  - Sessions linked to a range by substring-matching the session location field
  - Month-by-month breakdown: sessions, hours, membership cost, equivalent hourly cost, equivalent day-rate cost, savings vs. alternatives
  - Break-even calculator: how many visits or hours per month justify the membership over walk-in pricing
  - All-time stats: total paid, total sessions, effective cost per visit, effective cost per hour
  - Multiple ranges supported; active/inactive status

---

## [1.2.2] — 2026-06-06

### Fixed
- **Update checker** now uses proper semver comparison — previously it showed an "update available" banner whenever the latest GitHub Release differed from the installed version, even if the release was *older*. It now only shows the banner when a genuinely newer version is available.

---

## [1.2.1] — 2026-06-06

### Fixed
- **`.env.example`** now documents the `ORIGIN` variable, which is required when running behind a reverse proxy (Caddy, nginx, Traefik, openresty, etc.). Without it, Astro's CSRF protection blocks all form submissions from a custom domain. Also corrects the default `ARMORY_PASSWORD` value (`changeme`) and `DB_PATH` to match the Docker default (`/data/armory.db`).

---

## [1.2.0] — 2026-06-06

### Added
- **AR Build Planner** (`/builds`) — dedicated section for planning AR-15 builds with multiple simultaneous build support
  - 12 standard part slots grouped by function: Lower Group (Lower Receiver, Trigger/FCG, Grip, Stock/Brace, Buffer System), Upper Group (Upper Receiver, Barrel, Handguard, Muzzle Device), Controls (BCG, Charging Handle), Optics
  - Per-part status tracking: Wanted → Ordered → Acquired with one-click cycling
  - Per-part fields: brand, model, price, link, photo upload, and notes
  - Build-level budget field with over-budget warning and acquired vs. total cost breakdown
  - Acquisition progress bar across all 12 standard slots
  - Extra parts section for accessories and anything beyond the standard 12 slots
  - **Compatibility warnings**: gas system vs. barrel length mismatches (pistol ≤10", carbine 10–16", mid 14–20", rifle 18"+) and caliber-specific notes for 6.5 Grendel, 6.8 SPC, .224 Valkyrie, 9mm, .458 SOCOM, .450 Bushmaster
  - Build statuses: Planning, In Progress, Complete
  - "AR Builds" added to sidebar navigation

---

## [1.1.0] — 2026-06-01

### Added
- **Drill PRs** — gold PR badge on each drill's best score; ★ marker on history; gold ring on trend chart
- **Ammo lot number tracking** — record batch/lot numbers per ammo type for consistency testing
- **Wish List** — track firearms, accessories, ammo, and gear to acquire; priority levels; mark acquired
- **CSV export** — download sessions, ammo inventory, purchase log, maintenance log, or drills as spreadsheets
- **Barrel round count** — track rounds through a specific barrel separately from lifetime firearm count; rated round count with progress bar and 80% warning
- **Shot Groups** (`/groups`) — log group size (inches/MOA/mm) per firearm/ammo/distance; trend charts; photo upload
- **Training Plans** (`/training`) — structured practice programs with drill checklists, target scores, and session logging
- **Maintenance Calendar** (`/maintenance`) — all firearms with cleaning schedules sorted overdue-first; barrel life progress
- **Push/email notifications** — ntfy, Gotify, and SMTP email alerts for cleaning overdue, low ammo, and barrel wear

---

## [1.0.0] — Initial Release

### Included
- Firearms vault with photo gallery, accessories, maintenance log, tags, documents, and transfer/sale log
- Range sessions with drills, target photos, video clips, ammo deduction, session templates, and side-by-side compare
- Ammo inventory with purchase log, price trend chart, price compare tab, and quick adjusters
- DOPE cards with printable DOPE sheet (MOA/MRAD, yards/meters, blank rows)
- Drills history with trend charts and par time tracking
- Gear/consumables tracker with low stock alerts
- Video footage library (upload or YouTube/Vimeo embed)
- Printable range card
- Global search
- Backup configuration (local path, S3/R2/B2)
- 5 color themes: Tactical, Ember, Ranger, Void, Ghost
- Docker Compose deployment
