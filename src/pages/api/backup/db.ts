import type { APIRoute } from 'astro';
import { resolve } from 'path';
import { createReadStream, statSync, existsSync } from 'fs';
import { Readable } from 'stream';

export const GET: APIRoute = async () => {
  const dbPath = process.env.DB_PATH ?? resolve(process.cwd(), 'data/armory.db');
  if (!existsSync(dbPath)) {
    return new Response('Database not found', { status: 404 });
  }

  const stat = statSync(dbPath);
  const date = new Date().toISOString().split('T')[0];
  const filename = `armory-backup-${date}.db`;

  const nodeStream = createReadStream(dbPath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;

  return new Response(webStream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': stat.size.toString(),
    },
  });
};
