import type { APIRoute } from 'astro';
import { runBackup } from '../../../lib/backup';

export const POST: APIRoute = async () => {
  const result = await runBackup();
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
};
