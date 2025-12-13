import type { APIRoute } from 'astro';
import { createHash, randomBytes } from 'crypto';

export const prerender = false;

const PASSCODE_HASH = import.meta.env.UNIVERSAL_PORTFOLIO_PASSCODE_HASH;
const PASSCODE_SALT = import.meta.env.UNIVERSAL_PORTFOLIO_PASSCODE_SALT;
const PASSCODE_PLAINTEXT = import.meta.env.UNIVERSAL_PORTFOLIO_PASSCODE_PLAINTEXT;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // Validate environment configuration
  if (!PASSCODE_PLAINTEXT && (!PASSCODE_HASH || !PASSCODE_SALT)) {
    console.error('[auth] Passcode not configured - check environment variables');
    return new Response('Authentication not configured', { status: 500 });
  }

  // Validate content type
  const contentType = request.headers.get('content-type') || '';
  if (
    !contentType.includes('multipart/form-data') &&
    !contentType.includes('application/x-www-form-urlencoded')
  ) {
    return redirect('/portfolio-gate?error=invalid');
  }

  // Parse form data
  const formData = await request.formData();
  const passcode = (formData.get('passcode') as string | null) ?? '';
  const redirectTo = (formData.get('redirect') as string | null) || '/portfolio';

  if (!passcode) {
    return redirect(`/portfolio-gate?error=invalid&redirect=${encodeURIComponent(redirectTo)}`);
  }

  // Validate passcode
  let valid = false;

  if (PASSCODE_PLAINTEXT) {
    // Development mode: plaintext comparison
    valid = passcode === PASSCODE_PLAINTEXT;
  } else {
    // Production mode: hash comparison
    const hash = createHash('sha256')
      .update(passcode + PASSCODE_SALT)
      .digest('hex');
    valid = hash === PASSCODE_HASH;
  }

  if (!valid) {
    console.log('[auth] Invalid passcode attempt');
    return redirect(`/portfolio-gate?error=invalid&redirect=${encodeURIComponent(redirectTo)}`);
  }

  // Generate session token
  const sessionToken = createHash('sha256')
    .update(randomBytes(32).toString('hex') + (PASSCODE_SALT || 'dev-salt'))
    .digest('hex');

  // Set authentication cookie
  cookies.set('universal_portfolio_access', sessionToken, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  console.log('[auth] Passcode validated, session created');
  return redirect(redirectTo);
};
