import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  const pathname = url.pathname;

  // Define protected route prefixes
  const protectedPrefixes = [
    '/portfolio/confidential',
    '/pipeline/confidential',
    '/memos',
  ];

  const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

  if (isProtected) {
    const accessCookie = cookies.get('universal_portfolio_access');

    if (!accessCookie?.value) {
      // Preserve the original URL for redirect after authentication
      const redirectPath = encodeURIComponent(pathname + (url.search || ''));
      console.log(`[middleware] Unauthorized access to ${pathname}, redirecting to gate`);
      return redirect(`/portfolio-gate?redirect=${redirectPath}`);
    }
  }

  return next();
});
