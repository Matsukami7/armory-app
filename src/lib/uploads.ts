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
