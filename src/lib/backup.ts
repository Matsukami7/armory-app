import { resolve } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export type BackupDestination =
  | { type: 'local'; path: string }
  | { type: 's3'; endpoint?: string; region: string; bucket: string; prefix: string; accessKeyId: string; secretAccessKey: string };

export interface BackupConfig {
  destinations: BackupDestination[];
}

function configPath(): string {
  const dbPath = process.env.DB_PATH ?? resolve(process.cwd(), 'data/armory.db');
  return resolve(dbPath, '..', 'backup-config.json');
}

export function loadConfig(): BackupConfig {
  const p = configPath();
  if (!existsSync(p)) return { destinations: [] };
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return { destinations: [] }; }
}

export function saveConfig(cfg: BackupConfig): void {
  writeFileSync(configPath(), JSON.stringify(cfg, null, 2));
}

export function dbPath(): string {
  return process.env.DB_PATH ?? resolve(process.cwd(), 'data/armory.db');
}

export async function runBackup(): Promise<{ ok: boolean; results: { dest: string; ok: boolean; error?: string }[] }> {
  const cfg = loadConfig();
  if (cfg.destinations.length === 0) return { ok: false, results: [{ dest: 'none', ok: false, error: 'No destinations configured' }] };

  const db = dbPath();
  const ts  = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `armory-backup-${ts}.db`;
  const results: { dest: string; ok: boolean; error?: string }[] = [];

  for (const dest of cfg.destinations) {
    if (dest.type === 'local') {
      try {
        mkdirSync(dest.path, { recursive: true });
        copyFileSync(db, resolve(dest.path, filename));
        results.push({ dest: `local:${dest.path}`, ok: true });
      } catch (e: any) {
        results.push({ dest: `local:${dest.path}`, ok: false, error: e.message });
      }
    } else if (dest.type === 's3') {
      try {
        const client = new S3Client({
          region: dest.region,
          ...(dest.endpoint ? { endpoint: dest.endpoint, forcePathStyle: true } : {}),
          credentials: { accessKeyId: dest.accessKeyId, secretAccessKey: dest.secretAccessKey },
        });
        const body = readFileSync(db);
        const key  = dest.prefix ? `${dest.prefix.replace(/\/$/, '')}/${filename}` : filename;
        await client.send(new PutObjectCommand({ Bucket: dest.bucket, Key: key, Body: body, ContentType: 'application/octet-stream' }));
        results.push({ dest: `s3:${dest.bucket}/${key}`, ok: true });
      } catch (e: any) {
        results.push({ dest: `s3:${dest.bucket}`, ok: false, error: e.message });
      }
    }
  }

  return { ok: results.every(r => r.ok), results };
}
