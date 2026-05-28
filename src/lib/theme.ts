export const THEMES = {
  tactical: { label: 'Tactical', color: '#06b6d4' },
  ember:    { label: 'Ember',    color: '#f59e0b' },
  ranger:   { label: 'Ranger',   color: '#22c55e' },
  void:     { label: 'Void',     color: '#a855f7' },
  ghost:    { label: 'Ghost',    color: '#94a3b8' },
} as const;

export type ThemeName = keyof typeof THEMES;
export const DEFAULT_THEME: ThemeName = 'tactical';

export function getTheme(request: Request): ThemeName {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.split(';').find(c => c.trim().startsWith('armory_theme='));
  const val = match?.split('=')[1]?.trim() as ThemeName;
  return val && val in THEMES ? val : DEFAULT_THEME;
}

export function makeThemeCookie(theme: ThemeName): string {
  return `armory_theme=${theme}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 365}`;
}
