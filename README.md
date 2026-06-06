# Armory

A self-hosted firearms tracker and range log. Track your collection, log range sessions, manage ammo, and review footage — all stored locally on your own hardware with no cloud dependencies.

- **Image:** `ghcr.io/matsukami7/armory-app:latest`
- **GitHub:** https://github.com/Matsukami7/armory-app

---

## Screenshots

| Dashboard | Firearm Detail | Ammo Inventory |
|---|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Firearm Detail](docs/screenshots/firearm-detail.png) | ![Ammo](docs/screenshots/ammo.png) |

---

## Features

### Dashboard
- At-a-glance stats: total firearms, sessions, lifetime rounds, collection value vs. what you paid, and all-time ammo spend
- Maintenance due alerts — set a service interval (rounds) and/or cleaning schedule (days) per firearm; dashboard flags overdue ones with reason detail
- Low ammo alerts with per-ammo configurable thresholds (not a global hardcoded value)
- Low gear stock warnings
- **⚡ Quick Log** button — log rounds to today's session in seconds without leaving the dashboard
- Recent sessions list

### Firearms
- Add each firearm with make, model, caliber, type, serial number, generation, and purchase info
- Track estimated current value separately from purchase price
- Upload a cover photo and an unlimited photo gallery per firearm
- Round count odometer — total lifetime rounds auto-summed from all sessions
- Label any firearm with color-coded tags; filter the vault by tag
- Attach accessories, maintain a log, and set a service interval for cleaning alerts
- **Transfer / Sale log** — mark a firearm as sold or transferred; record date, recipient, and price; hidden from active vault but preserved in history; reversible
- **Document storage** — attach PDFs, manuals, registrations, or other documents per firearm; PDFs open inline in the browser
- **Barrel round count** — track rounds fired through a specific barrel separately from lifetime firearm rounds; set a rated round count to get a progress bar and warning at 80%
- 5 firearm types: Pistol, Rifle, Shotgun, Revolver, Other

### Accessories
- Attach accessories to any firearm: optics, lights, suppressors, grips, stocks, triggers
- Track make, model, and purchase price per accessory
- **Lights:** output in lumens, power source (rechargeable or battery), battery type, and last battery change date
- **Optics:** zero data field (distance, elevation/windage notes)
- Upload a photo per accessory
- Inline notes editable without leaving the page

### Firearm Log
- Per-firearm log: **Note**, **Cleaning**, **Repair**, **Inspection**, **Modification**
- Record round count at time of service — used to calculate rounds since last cleaning
- **Dual cleaning schedule** — set a service interval in rounds, days, or both; dashboard alerts when either threshold is exceeded

### DOPE Cards (Ballistic Data)
- Per-firearm **DOPE cards** (Data On Previous Engagements) for long-range marksmanship
- Each card links to an ammo load, zero distance, and muzzle velocity
- Log distance entries with **both MOA and MRAD** corrections for elevation and wind (10mph full-value)
- **Printable DOPE sheet** — configurable unit display (MOA only / MRAD only / both), distance format (yards / meters / both), and number of blank rows to append
- Print card auto-populates rifle, ammo, optic, and zero data from your database
- App chrome (sidebar, nav) hidden automatically when printing

### Range Sessions
- Log sessions with date, location, duration, weather, and notes
- Location field autocompletes from previously used ranges
- Link firearms with rounds fired; ammo dropdown auto-filters to matching caliber
- Link ammo inventory to auto-deduct rounds on save
- Session cost calculated automatically (rounds fired × cost per round)
- Color-coded tags on sessions; filter the sessions list by tag
- **Session Templates** — save a named preset (location + firearm/ammo loadout); load it as a pill shortcut when creating a new session
- **Compare** any two sessions side-by-side: rounds, cost, drill scores (green/red improvement indicators), firearms used

### Drills
- Log drills per session: name, distance, score/result, par time, notes, firearm, and target photo
- **Drill History** page groups all drills by name, sorted by most recently used
- Score trend charts for drills with numeric results (times, scores, etc.)
- Par time tracked as a second dashed series on trend charts — see if you're beating the clock over time
- **Personal records** — gold PR badge on each drill's best score; ★ marker on the history entry; gold ring on the trend chart
- Full history per drill with session links and target photo thumbnails

### Ammo Inventory
- Track ammo by caliber, brand, grain, and type (FMJ, HP, SP, Match, Subsonic, Other)
- Quick +50 / −50 round adjusters on the inventory page
- **Auto cost-per-round calculation** — enter quantity and total purchase price, cost/round fills in automatically; override manually if needed
- **Purchase log** per ammo type: date, quantity, total cost, retailer — quantity updates automatically
- **Price trend chart** — cost-per-round charted over all logged purchases; shows when prices go up or down
- **Price Compare tab** — groups ammo by caliber, sorted cheapest first; "Best Price" badge, cost delta vs. cheapest, relative bar chart
- Per-ammo low stock threshold — set a custom alert level per type; dashboard warns when stock hits it
- **Lot number tracking** — record the lot/batch number per ammo type for consistency testing

### Quick Log
- `/log` — minimal form for range use: pick firearm, enter rounds, optionally select ammo
- Automatically appends to today's session; creates a new session if none exists
- Ammo filtered by caliber automatically; round input auto-focused after firearm selection
- "View Today's Session" button appears once a session exists

### Shot Groups
- Log group size (inches, MOA, or mm) per firearm, ammo, distance, and session
- Upload a target photo per group entry
- **Trend charts** per firearm/distance combination — green dot marks the best (tightest) group recorded
- Lower is better — chart inverts intuitively

### Training Plans
- Create structured practice programs with a named drill checklist
- Set target scores, rep counts, and distances per drill
- Log completed sessions against a plan; link to actual range sessions
- **Completion tracking** — automatically detects which plan drills were logged in the linked session and shows a % complete badge

### Maintenance Calendar
- Single-page view of all firearms with a cleaning schedule configured
- Sorted overdue-first with red left-border indicators
- Shows rounds since last clean, days since last clean, and barrel life progress per firearm
- Direct link to log a cleaning from the calendar

### AR Build Planner
- Plan AR-15 builds part by part with **12 standard slots**: Lower Receiver, Upper Receiver, Barrel, BCG, Charging Handle, Handguard, Muzzle Device, Trigger/FCG, Buffer System, Stock/Brace, Grip, and Optic/Sights
- **Multiple simultaneous builds** — plan a 10.5" pistol and an 18" precision rifle at the same time
- **Compatibility warnings** — flags gas system vs. barrel length mismatches (pistol/carbine/mid/rifle length ranges) and caliber-specific notes (6.5 Grendel needs Type II bolt, .224 Valkyrie uses 6.8 SPC bolt face, 9mm needs dedicated lower, etc.)
- Per-part status tracking: **Wanted → Ordered → Acquired** — cycle with one click
- Per-part **photo upload**, link, price, brand/model, and notes
- **Budget tracking** — set a build budget; total and acquired cost shown with over-budget warning
- **Acquisition progress bar** — visual completion across all 12 standard slots
- **Extra parts** section for accessories, magazines, and anything beyond the standard 12 slots
- Slots grouped by function: Lower Group / Upper Group / Controls / Optics

### Wish List
- Track firearms, ammo, accessories, and gear you want to acquire
- Set priority (high/medium/low), estimated price, and a reference link
- Mark items as acquired — they move to a strikethrough "Acquired" section
- Total estimated cost shown in the page subtitle

### Global Search
- Search across all entities from the sidebar: firearms, sessions, ammo, accessories, drills, and gear
- Color-coded results by type with direct links

### Gear / Consumables
- Track cleaning supplies, targets, batteries, tools, and safety gear
- Category tabs: Cleaning, Targets, Batteries, Tools, Safety, Other
- +1 / −1 quick adjusters per item
- Low stock threshold — dashboard and gear page alert when quantity is at or below threshold
- Freeform unit (bottles, oz, pcs, rolls, etc.)

### Video Footage
- **Footage library** (`/footage`) — upload video clips or link external recordings
- Inline video player with seek support for uploaded files (mp4, mov, webm, mkv)
- YouTube and Vimeo URLs embed automatically as players
- Any other URL shows as an external link
- Optionally link footage to a specific range session
- **Session clips** — upload short clips directly from the session detail page; they appear inline with a player

### Printable Range Card
- Generate a blank range card to take to the range for handwritten notes
- Pre-select firearms you're bringing — they populate the firearm column automatically
- Configurable number of firearm rows and drill rows
- Clean black-on-white print layout — app chrome hidden automatically when printing

### Settings & Backup
- One-click database download from Settings — no SSH required
- Vault summary: firearm, session, and ammo counts
- Default password warning until `ARMORY_PASSWORD` is changed
- **Update checker** — shows when a new release is available with a changelog link; checks GitHub Releases, cached 6h
- **Backup configuration** — add local path or S3-compatible destinations (AWS S3, Cloudflare R2, Backblaze B2); "Backup Now" triggers an immediate backup and shows per-destination results
- **CSV export** — download sessions, ammo inventory, purchase log, maintenance log, or drills as spreadsheets

### Notifications
- Push and email alerts for cleaning overdue, low ammo stock, and barrel wear warnings
- **ntfy** — works with ntfy.sh or a self-hosted ntfy server
- **Gotify** — self-hosted push notification server
- **Email** — any SMTP server (Gmail, Fastmail, self-hosted, etc.)
- Trigger alerts on-demand via the Settings page or automate with a cron job hitting `POST /api/notify/send`

### Theming
- 5 color themes selectable per user: **Tactical** (cyan), **Ember** (amber), **Ranger** (green), **Void** (purple), **Ghost** (slate)
- Theme saved in a cookie — no flash on load

---

## Quick Start

**Requirements:** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/). Nothing else.

```bash
mkdir armory && cd armory
curl -O https://raw.githubusercontent.com/Matsukami7/armory-app/master/docker-compose.yml
curl -O https://raw.githubusercontent.com/Matsukami7/armory-app/master/.env.example
mv .env.example .env
# Edit .env — set ARMORY_PASSWORD and ORIGIN before starting
docker compose up -d
```

Open `http://<your-server-ip>:4321`.

> **Default password is `changeme`.** A warning banner appears on every page until you change it.

> **Behind a reverse proxy?** Set `ORIGIN=https://your-domain.com` in your `.env` — required for Caddy, nginx, Traefik, openresty, and any other proxy. Without it, Astro's CSRF protection will block all form submissions.

---

## Usage Guide

### Adding your first firearm
1. Click **Vault** → **+ Add Firearm**
2. Fill in make, model, caliber, and type — everything else is optional
3. Save, then tap **+ Photo** on the detail page to attach a cover image
4. Tap the photo gallery section to add additional reference photos

### Logging a range session
1. Click **Range** → **+ Log Session** (or **⚡ Quick Log** on the dashboard for a fast entry)
2. Enter date and optionally location, duration, weather, and notes
3. On the session detail page, tap **+ Add Firearm** to record rounds fired per gun
4. Link an ammo type to auto-deduct from inventory
5. Tap **+ Log Drill** to record individual drills with score, par time, and target photo

### Using session templates
1. Go to **Range** → **Templates** and create a preset with your usual location and firearm/ammo loadout
2. When logging a new session, click the template pill at the top to pre-fill the form

### Creating a DOPE card
1. Open a firearm → tap **🎯 DOPE** in the page header
2. Create a card — give it a name, link an ammo load, set your zero distance and muzzle velocity
3. Add distance entries: fill in elevation and wind corrections in MOA and/or MRAD
4. Tap **🖨 Print Card** to open the printable version; choose unit and distance display options before printing

### Tracking drills over time
- Go to **Drills** to see all drills grouped by name
- Any drill with ≥ 2 numeric scores gets a trend chart automatically
- If you log par times, they appear as a second dashed line on the chart

### Comparing sessions
- Click **Compare** on the Range page, pick two sessions, and view them side-by-side
- Drill scores show green ▲ / red ▼ indicators for improvement

### Managing ammo
1. Go to **Ammo** → **+ Add Ammo**
2. Enter quantity and total purchase cost — cost per round is calculated automatically
3. Use **+50 / −50** buttons to adjust counts manually
4. Tap **Edit** on any ammo entry to log purchases — each purchase auto-adds to inventory and logs for the price trend chart
5. Set a **Low Stock Threshold** per ammo type to get dashboard alerts at your preferred level

### Tagging firearms and sessions
- On any firearm or session detail page, type a tag name in the tag input and press Enter
- Tags appear as colored chips — tap the **✕** to remove
- Filter the Vault and Range lists by clicking any tag chip

### Tracking gear
1. Click **Gear** → **+ Add Item**
2. Set a **Low Stock Alert** threshold — you'll see a warning on the dashboard and gear page when stock hits that level
3. Use **+1 / −1** buttons to adjust counts after each range trip

### Uploading footage
- **Short clips:** open a session, scroll to **Video Clips**, and upload an mp4/mov/webm file
- **Helmet cam / body cam:** go to **Footage** in the sidebar, click **+ Add Footage**, and either upload a file or paste a YouTube/Vimeo URL
- For large files (multi-GB recordings) that are impractical to upload through a browser, drop them directly into `data/uploads/footage/` on your server, then add an entry in the Footage library manually

### Maintenance reminders
1. On a firearm's **Edit** page, set a **Service Interval (rounds)** and/or **Cleaning Interval (days)**
2. Log a **Cleaning** entry in the firearm log each time you clean — record the round count at that moment
3. The dashboard flags the firearm when rounds since the last cleaning exceeds the round interval, or days since the last cleaning exceeds the day interval

### Printing a range card
1. Click **Range** → **🖨 Range Card**
2. Check which firearms you're bringing and set row counts
3. Print — the config panel disappears and you get a clean card

---

## Data & Backups

All data lives in `data/` next to your `docker-compose.yml`:

```
data/
  armory.db          — SQLite database (all records)
  uploads/           — Photos, videos, and documents
    firearms/
    accessories/
    targets/
    footage/
    documents/
    builds/
  backup-config.json — Backup destinations (auto-created; keep private)
```

**To back up:** copy the entire `data/` directory.

**To restore:**
```bash
docker compose down
cp -r /path/to/backup/data ./data
docker compose up -d
```

You can also download the database directly from the **Settings** page, or configure automated backups to a local path or S3-compatible destination (Settings → Backup).

---

## Updating

```bash
docker compose pull
docker compose up -d
```

Your `data/` directory is never touched during updates. Database migrations run automatically on startup.

The app shows an update notification on the Settings page when a new GitHub Release is available.

---

## Configuration

All configuration via environment variables (`.env` or `docker-compose.yml`):

| Variable | Default | Description |
|---|---|---|
| `ARMORY_PASSWORD` | `changeme` | App password — **change this** |
| `DB_PATH` | `/data/armory.db` | Path to the SQLite database |
| `ORIGIN` | *(unset)* | Public URL — **required behind a reverse proxy** (e.g. `https://armory.example.com`) |
| `PORT` | `4321` | Port the app listens on |
| `HOST` | `0.0.0.0` | Bind address |

**Changing the port:**
```yaml
# docker-compose.yml
ports:
  - "8080:4321"   # exposes on 8080
```

**Behind a reverse proxy (nginx, Caddy, Traefik):**
The app runs plain HTTP — terminate TLS at your proxy and forward to `http://localhost:4321`. You **must** set the `ORIGIN` variable to your public URL or logins will be blocked by Astro's CSRF protection:

```bash
# .env
ORIGIN=https://armory.yourdomain.com
```

---

## Build from Source

```bash
git clone https://github.com/Matsukami7/armory-app.git armory
cd armory
cp .env.example .env    # edit ARMORY_PASSWORD
```

Edit `docker-compose.yml` and swap the image/build lines:
```yaml
# image: ghcr.io/matsukami7/armory-app:latest   ← comment out
build: .                                          # ← uncomment
```

```bash
docker compose up -d --build
```

**Local dev without Docker** (Node.js 22+ required):
```bash
npm install
ARMORY_PASSWORD=changeme npm run dev
# → http://localhost:4321
```

---

## Security Notes

- Designed for **local network use**. No multi-user support.
- If exposed to the internet, use a reverse proxy with HTTPS.
- Session cookie is `HttpOnly`, `SameSite=Strict`, 30-day expiry.
- Uploaded files are restricted to allowed extensions; path traversal is prevented server-side.
- Change the default password before putting the app on your network.
- `data/backup-config.json` contains S3/R2 credentials — never commit it; it is excluded from the image.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Astro](https://astro.build) v6, SSR |
| Styles | [Tailwind CSS v4](https://tailwindcss.com) |
| Database | SQLite via [Drizzle ORM](https://orm.drizzle.team) + [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| Runtime | Node.js 22 |
| Deployment | Docker Compose + GHCR |
