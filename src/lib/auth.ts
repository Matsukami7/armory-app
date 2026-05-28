const SESSION_COOKIE = 'armory_session';
const SESSION_TOKEN = 'authenticated';
const DEFAULT_PASSWORD = 'armory';

export function checkPassword(input: string): boolean {
  const password = process.env.ARMORY_PASSWORD ?? DEFAULT_PASSWORD;
  return input === password;
}

export function isAuthenticated(request: Request): boolean {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.split(';').find(c => c.trim().startsWith(`${SESSION_COOKIE}=`));
  if (!match) return false;
  const val = match.split('=')[1]?.trim();
  return val === SESSION_TOKEN;
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
