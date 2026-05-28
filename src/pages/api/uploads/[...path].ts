import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { getUploadsDir } from '../../../lib/uploads';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.heic': 'image/heic',
};

export const GET: APIRoute = ({ params }) => {
  const rawPath = params.path ?? '';

  // Prevent path traversal
  const uploadsDir = getUploadsDir();
  const requested = resolve(join(uploadsDir, rawPath));
  if (!requested.startsWith(uploadsDir + '/') && requested !== uploadsDir) {
    return new Response('Forbidden', { status: 403 });
  }

  if (!existsSync(requested)) {
    return new Response('Not found', { status: 404 });
  }

  const ext = requested.slice(requested.lastIndexOf('.')).toLowerCase();
  const contentType = MIME[ext] ?? 'application/octet-stream';

  const data = readFileSync(requested);
  return new Response(data, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
