# Armory

A self-hosted firearms tracker and range log. Track your collection, document range sessions, log drills, and manage ammo inventory — all stored locally on your own hardware.

- **GitHub:** https://github.com/Matsukami7/armory-app
- **Image:** `ghcr.io/matsukami7/armory-app:latest`

---

## Features

### Firearms
- Add each firearm with make, model, caliber, type, serial number, purchase date and price
- Upload a photo per firearm (JPEG, PNG, WebP, HEIC)
- Edit all fields at any time
- View total lifetime rounds fired per firearm

### Accessories
- Attach accessories (optics, lights, suppressors, grips, stocks, triggers) to any firearm
- Track make, model, and purchase price per accessory
- Lights include dedicated fields: output in lumens, power source (rechargeable or battery), and battery type (CR123A, 18650, AA, etc.)

### Firearm Log
- Per-firearm log with five entry types: **Note**, **Cleaning**, **Repair**, **Inspection**, **Modification**
- Record round count at time of service for maintenance entries
- Entries displayed newest-first with type icons; individual entries deletable

### Range Sessions
- Log sessions with date, location, duration, weather, and general notes
- Location field autocompletes from your previously used ranges
- Link one or more firearms to a session with rounds fired
- Ammo dropdown automatically filters to matching caliber for the selected firearm
- Link ammo inventory to auto-deduct rounds on save
- Log drills per session: name, distance, score, notes, and which firearm was used
- Edit session details or remove individual firearm/drill entries after the fact

### Ammo Inventory
- Track ammo by caliber, brand, grain, and type (FMJ, HP, SP, Match, Subsonic)
- Quick +50 / −50 round adjusters directly on the inventory page
- Cost-per-round tracking
- Dashboard warns when any ammo type drops below 100 rounds

### Dashboard
- At-a-glance stats: total firearms, sessions, and lifetime rounds fired
- Quick-add buttons for new session and new firearm
- Recent sessions list
- Low ammo warnings

---

## Installation

### Requirements

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

That's it. No database to install, no external services.

---

### Quick Start — Pull from Registry (Recommended)

The pre-built image is published to GitHub Container Registry. No need to clone the repo or build anything.

**1. Create a working directory and grab the Compose file**

```bash
mkdir armory && cd armory
curl -O https://raw.githubusercontent.com/Matsukami7/armory-app/master/docker-compose.yml
```

**2. Set your password**

```bash
echo "ARMORY_PASSWORD=your-secure-password-here" > .env
```

> **Default password is `changeme`.** A warning banner is shown on every page until you change it. Change it before putting this on your network.

**3. Start the app**

```bash
docker compose up -d
```

Docker will pull the image from GHCR automatically on first run.

**4. Open it**

Navigate to `http://<your-server-ip>:4321` from any device on your network.

---

### Updating

```bash
docker compose pull
docker compose up -d
```

Your data in `./data/` is never touched during updates.

---

### Quick Start — Build from Source

If you want to modify the code or run without pulling from GHCR:

```bash
git clone https://github.com/Matsukami7/armory-app.git armory
cd armory
cp .env.example .env       # then edit ARMORY_PASSWORD
```

Edit `docker-compose.yml` and swap the image/build lines:

```yaml
# image: ghcr.io/matsukami7/armory-app:latest   ← comment this out
build: .                                          # ← uncomment this
```

Then:

```bash
docker compose up -d --build
```

---

### Local Development (without Docker)

Requires Node.js 22+.

```bash
npm install
ARMORY_PASSWORD=changeme npm run dev
```

The dev server starts at `http://localhost:4321` and initializes the database automatically on first run.

---

## Data & Backups

All data is stored in the `data/` directory next to your `docker-compose.yml`:

```
data/
  armory.db        — SQLite database (all your records)
  uploads/         — Uploaded photos
```

**To back up**, copy the entire `data/` directory. That's everything.

**To restore**, stop the container, replace `data/` with your backup, and restart.

```bash
docker compose down
cp -r /path/to/backup/data ./data
docker compose up -d
```

---

## Configuration

All configuration is via environment variables, set in `.env` or `docker-compose.yml`.

| Variable | Default | Description |
|---|---|---|
| `ARMORY_PASSWORD` | `changeme` | Password to access the app. **Change this.** |
| `DB_PATH` | `/data/armory.db` | Path to the SQLite database file |
| `PORT` | `4321` | Port the app listens on |
| `HOST` | `0.0.0.0` | Bind address |

### Changing the port

Edit `docker-compose.yml`:

```yaml
ports:
  - "8080:4321"   # expose on port 8080 instead
```

### Running behind a reverse proxy (nginx, Caddy, Traefik)

The app runs on plain HTTP. Terminate TLS at your reverse proxy and forward to `http://localhost:4321`. No special headers required.

---

## Usage Guide

### Adding your first firearm

1. Tap **Firearms** in the bottom nav
2. Tap **+ Add**
3. Fill in make, model, caliber, and type — the rest is optional
4. Save, then tap **+ Photo** on the detail page to attach an image

### Logging a range session

1. Tap **Range** in the bottom nav (or **+ Log Session** on the dashboard)
2. Enter the date and optionally location, duration, and weather
3. Save — you'll land on the session detail page
4. Tap **+ Add Firearm** to record which guns you shot and how many rounds
5. Tap **+ Log Drill** to record individual drills with score and notes

### Managing ammo

1. Tap **Ammo** in the bottom nav
2. Use the **Add Ammo** form at the bottom to create a new entry
3. Use **+50** / **−50** buttons to adjust counts manually
4. When logging a session, link ammo to a firearm and the rounds fired will be automatically deducted

### Editing records

- **Firearms**: tap the **Edit** button on the firearm detail page
- **Sessions**: tap the **Edit** button on the session detail page
- **Log entries / accessories / session firearms / drills**: tap the **✕** button next to any entry to remove it

---

## Publishing a New Image (Maintainers)

When you want to ship an update to GHCR:

```bash
# 1. Log in to GHCR (only needed once per machine)
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# 2. Build and push
docker build -t ghcr.io/matsukami7/armory-app:latest .
docker push ghcr.io/matsukami7/armory-app:latest

# 3. Users update by running on their server:
docker compose pull && docker compose up -d
```

To get a GitHub token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → New token → check `write:packages`.

---

## Security Notes

- The app is designed for **local network use**. There is no multi-user support.
- If exposed to the internet, use a reverse proxy with HTTPS.
- The session cookie is `HttpOnly` and `SameSite=Strict`.
- Uploaded files are restricted to image types and path-traversal is prevented server-side.
- Change the default password before putting the app on your network.

---

## Tech Stack

- **[Astro](https://astro.build)** — SSR framework
- **[Tailwind CSS v4](https://tailwindcss.com)** — Styling
- **[Drizzle ORM](https://orm.drizzle.team)** + **[better-sqlite3](https://github.com/WiseLibs/better-sqlite3)** — Database
- **[Docker](https://docker.com)** — Containerized deployment
- **[GHCR](https://ghcr.io)** — Image registry
