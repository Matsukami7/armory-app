import { randomBytes, timingSafeEqual } from 'crypto';
import { resolve } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

const SESSION_COOKIE = 'armory_session';
const DEFAULT_PASSWORD = 'changeme';

// Session secret is random per install and persisted alongside the DB — never hardcoded,
// never committed. Generated once on first run so sessions survive restarts/redeploys.
function loadOrCreateSessionSecret(): string {
  const dbPath = process.env.DB_PATH ?? resolve(process.cwd(), 'data/armory.db');
  const dataDir = resolve(dbPath, '..');
  mkdirSync(dataDir, { recursive: true });

  const secretPath = resolve(dataDir, 'session-secret');
  if (existsSync(secretPath)) {
    return readFileSync(secretPath, 'utf-8').trim();
  }
  const secret = randomBytes(32).toString('hex');
  writeFileSync(secretPath, secret, { mode: 0o600 });
  return secret;
}

const SESSION_TOKEN = loadOrCreateSessionSecret();

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Compare against itself to avoid a length-based timing short-circuit.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function checkPassword(input: string): boolean {
  const password = process.env.ARMORY_PASSWORD ?? DEFAULT_PASSWORD;
  return timingSafeStringEqual(input, password);
}

export function isAuthenticated(request: Request): boolean {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.split(';').find(c => c.trim().startsWith(`${SESSION_COOKIE}=`));
  if (!match) return false;
  const val = match.split('=')[1]?.trim() ?? '';
  return timingSafeStringEqual(val, SESSION_TOKEN);
}

export function isUsingDefaultPassword(): boolean {
  const pw = process.env.ARMORY_PASSWORD ?? DEFAULT_PASSWORD;
  return pw === DEFAULT_PASSWORD;
}

export function makeSessionCookie(): string {
  return `${SESSION_COOKIE}=${SESSION_TOKEN}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 30}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}
