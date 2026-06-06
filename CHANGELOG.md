# Changelog

All notable changes to Armory are documented here.

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
