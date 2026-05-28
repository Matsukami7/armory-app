const COLORS = ['#06b6d4','#f59e0b','#22c55e','#a855f7','#f97316','#ec4899','#64748b'];

export function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
}

export function serializeTags(tags: string[]): string {
  return [...new Set(tags)].join(',');
}

export function tagColor(tag: string): string {
  let h = 0;
  for (const c of tag) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return COLORS[h % COLORS.length];
}
