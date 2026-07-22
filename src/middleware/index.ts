import { defineMiddleware } from 'astro:middleware';
import { isAuthenticated } from '../lib/auth';

const PUBLIC_PATHS = ['/login', '/api/auth/login'];

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
const FORM_CONTENT_TYPES = ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'];

function isFormLike(contentType: string | null): boolean {
  if (!contentType) return true; // fail closed, matches Astro's own default behavior
  const lower = contentType.toLowerCase();
  return FORM_CONTENT_TYPES.some(t => lower.includes(t));
}

// Astro's built-in CSRF Origin check computes the request's own origin from the raw
// socket + Host header, which is wrong behind a TLS-terminating reverse proxy (the
// Node process only ever sees plain HTTP). We replicate the check here but trust the
// ORIGIN env var as the source of truth when set, matching what this app has always
// told self-hosters to configure.
function checkOrigin(request: Request, url: URL): boolean {
  if (SAFE_METHODS.includes(request.method)) return true;
  if (!isFormLike(request.headers.get('content-type'))) return true;

  const trustedOrigin = process.env.ORIGIN || url.origin;
  return request.headers.get('origin') === trustedOrigin;
}

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = new URL(context.request.url);

  if (!checkOrigin(context.request, context.url)) {
    return new Response(`Cross-site ${context.request.method} form submissions are forbidden`, { status: 403 });
  }

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return next();
  }

  if (!isAuthenticated(context.request)) {
    return context.redirect('/login');
  }

  return next();
});
