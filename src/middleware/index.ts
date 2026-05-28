import { defineMiddleware } from 'astro:middleware';
import { isAuthenticated } from '../lib/auth';

const PUBLIC_PATHS = ['/login', '/api/auth/login'];

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = new URL(context.request.url);

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return next();
  }

  if (!isAuthenticated(context.request)) {
    return context.redirect('/login');
  }

  return next();
});
