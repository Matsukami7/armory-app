import { resolve, join, extname } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.mp4', '.mov', '.webm', '.mkv', '.pdf', '.doc', '.docx', '.txt']);

export function getUploadsDir(): string {
  const dbPath = process.env.DB_PATH ?? resolve(process.cwd(), 'data/armory.db');
  return resolve(dbPath, '..', 'uploads');
}

export async function saveUpload(file: File, subdir: string): Promise<string | null> {
  const ext = extname(file.name).toLowerCase();
  if (!ALLOWED_EXTS.has(ext)) return null;

  const dir = join(getUploadsDir(), subdir);
  mkdirSync(dir, { recursive: true });

  const filename = `${Date.now()}${ext}`;
  const bytes = await file.arrayBuffer();
  writeFileSync(join(dir, filename), Buffer.from(bytes));

  return `/api/uploads/${subdir}/${filename}`;
}

export function embedUrl(url: string): string | null {
  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
