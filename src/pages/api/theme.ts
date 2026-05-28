import type { APIRoute } from 'astro';
import { THEMES, makeThemeCookie, type ThemeName } from '../../lib/theme';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const theme = form.get('theme') as ThemeName;
  const back = form.get('back') as string || '/';

  if (!(theme in THEMES)) return redirect(back);

  return new Response(null, {
    status: 302,
    headers: { 'Location': back, 'Set-Cookie': makeThemeCookie(theme) },
  });
};
