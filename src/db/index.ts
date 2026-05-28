import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { resolve } from 'path';
import { mkdirSync } from 'fs';

const dbPath = process.env.DB_PATH ?? resolve(process.cwd(), 'data/armory.db');
mkdirSync(resolve(dbPath, '..'), { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

// Auto-migrate on every startup — idempotent, safe to run repeatedly
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS firearms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    caliber TEXT NOT NULL,
    serial TEXT,
    generation TEXT,
    type TEXT NOT NULL,
    purchase_date TEXT,
    purchase_price REAL,
    notes TEXT,
    photo_path TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS accessories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firearm_id INTEGER REFERENCES firearms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    make TEXT,
    model TEXT,
    notes TEXT,
    purchase_date TEXT,
    purchase_price REAL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firearm_id INTEGER NOT NULL REFERENCES firearms(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    notes TEXT NOT NULL,
    round_count INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ammo_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    caliber TEXT NOT NULL,
    brand TEXT NOT NULL,
    grain INTEGER,
    type TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    cost_per_round REAL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS range_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    location TEXT,
    duration_minutes INTEGER,
    weather TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS session_firearms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL REFERENCES range_sessions(id) ON DELETE CASCADE,
    firearm_id INTEGER NOT NULL REFERENCES firearms(id),
    rounds_fired INTEGER NOT NULL DEFAULT 0,
    ammo_id INTEGER REFERENCES ammo_inventory(id)
  );

  CREATE TABLE IF NOT EXISTS drills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL REFERENCES range_sessions(id) ON DELETE CASCADE,
    firearm_id INTEGER REFERENCES firearms(id),
    name TEXT NOT NULL,
    distance TEXT,
    score TEXT,
    notes TEXT,
    target_photo_path TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

// Column migrations for existing databases — safe to run on every startup
const firearmColumns = (sqlite.prepare("SELECT name FROM pragma_table_info('firearms')").all() as { name: string }[]).map(r => r.name);
if (!firearmColumns.includes('generation')) {
  sqlite.exec("ALTER TABLE firearms ADD COLUMN generation TEXT");
}

const accColumns = (sqlite.prepare("SELECT name FROM pragma_table_info('accessories')").all() as { name: string }[]).map(r => r.name);
if (!accColumns.includes('lumens'))       sqlite.exec("ALTER TABLE accessories ADD COLUMN lumens INTEGER");
if (!accColumns.includes('power_type'))   sqlite.exec("ALTER TABLE accessories ADD COLUMN power_type TEXT");
if (!accColumns.includes('battery_type')) sqlite.exec("ALTER TABLE accessories ADD COLUMN battery_type TEXT");

export const db = drizzle(sqlite, { schema });
export type DB = typeof db;
