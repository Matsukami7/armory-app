import type { APIRoute } from 'astro';
import { createReadStream, existsSync, statSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { Readable } from 'stream';
import { getUploadsDir } from '../../../lib/uploads';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.heic': 'image/heic',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.mkv': 'video/x-matroska',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain',
};

const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm', '.mkv']);
const INLINE_EXTS = new Set(['.pdf', '.txt']);

export const GET: APIRoute = ({ params, request }) => {
  const rawPath = params.path ?? '';

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
  const isVideo = VIDEO_EXTS.has(ext);

  const stat = statSync(requested);
  const fileSize = stat.size;

  if (isVideo) {
    const rangeHeader = request.headers.get('range');

    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (!match) return new Response('Invalid range', { status: 416 });

      const start = parseInt(match[1]);
      const end = match[2] ? Math.min(parseInt(match[2]), fileSize - 1) : Math.min(start + 1024 * 1024 - 1, fileSize - 1);

      if (start >= fileSize || end < start) {
        return new Response('Range Not Satisfiable', {
          status: 416,
          headers: { 'Content-Range': `bytes */${fileSize}` },
        });
      }

      const stream = createReadStream(requested, { start, end });
      return new Response(Readable.toWeb(stream) as ReadableStream, {
        status: 206,
        headers: {
          'Content-Type': contentType,
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(end - start + 1),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Full video response (no range header)
    const stream = createReadStream(requested);
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileSize),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  const data = readFileSync(requested);
  const disposition = INLINE_EXTS.has(ext) ? 'inline' : 'attachment; filename="' + requested.split('/').pop() + '"';
  return new Response(data, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': disposition,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
