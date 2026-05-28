import type { APIRoute } from 'astro';
import { checkPassword, makeSessionCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const password = form.get('password')?.toString() ?? '';

  if (!checkPassword(password)) {
    return redirect('/login?error=wrong');
  }

  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/',
      'Set-Cookie': makeSessionCookie(),
    },
  });
};
