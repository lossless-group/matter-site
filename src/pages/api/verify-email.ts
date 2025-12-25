import type { APIRoute } from 'astro';
import { createHash, randomBytes } from 'crypto';
import {
  checkEmailAccess,
  createEmailAccessSession,
  isAllowedDomain,
} from '@lib/nocodb';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // Validate content type
  const contentType = request.headers.get('content-type') || '';
  if (
    !contentType.includes('multipart/form-data') &&
    !contentType.includes('application/x-www-form-urlencoded')
  ) {
    return redirect('/portfolio-gate?error=invalid&method=email');
  }

  // Parse form data
  const formData = await request.formData();
  const email = (formData.get('email') as string | null) ?? '';
  const redirectTo = (formData.get('redirect') as string | null) || '/portfolio';

  // Validate email format
  if (!email || !email.includes('@')) {
    return redirect(`/portfolio-gate?error=invalid-email&redirect=${encodeURIComponent(redirectTo)}`);
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check email access
  const accessResult = await checkEmailAccess(normalizedEmail);

  if (accessResult.allowed) {
    // Email is allowed (domain allowlist or previously approved)
    // Create session record in NocoDB
    const sessionResult = await createEmailAccessSession(normalizedEmail);

    if (!sessionResult.success) {
      console.error('[auth] Failed to create session record:', sessionResult.error);
      // Continue anyway - don't block access due to logging failure
    }

    // Generate session token
    const sessionToken = createHash('sha256')
      .update(randomBytes(32).toString('hex') + normalizedEmail)
      .digest('hex');

    // Set authentication cookie
    cookies.set('universal_portfolio_access', sessionToken, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Store email in a separate cookie for session tracking
    cookies.set('accessor_email', normalizedEmail, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Store session record ID for potential session end tracking
    if (sessionResult.record?.id) {
      cookies.set('session_record_id', String(sessionResult.record.id), {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
    }

    console.log(`[auth] Email ${normalizedEmail} authenticated (${accessResult.status})`);
    return redirect(redirectTo);
  }

  // Email not allowed - create a pending request for tracking
  // Even though they can't access, we capture the request
  await createEmailAccessSession(normalizedEmail);

  console.log(`[auth] Access denied for ${normalizedEmail} - request logged`);

  // Redirect to gate with pending message
  return redirect(
    `/portfolio-gate?error=pending&email=${encodeURIComponent(normalizedEmail)}&redirect=${encodeURIComponent(redirectTo)}`
  );
};
