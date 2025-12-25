import type { APIRoute } from 'astro';
import { createHash, randomBytes } from 'crypto';
import { createEmailAccessSession } from '@lib/nocodb';

export const prerender = false;

/**
 * Simple temporary access endpoint.
 *
 * 1. Captures email + sessionStartTime to NocoDB
 * 2. Sets auth cookie + session record ID for heartbeat tracking
 * 3. Redirects to confidential content
 *
 * No domain checking, no approval workflow - just capture and grant.
 */
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
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
  const email = (formData.get('email') as string | null) ?? '';
  const redirectTo = (formData.get('redirect') as string | null) || '/portfolio/confidential';

  // Basic email validation
  if (!email || !email.includes('@')) {
    return redirect('/portfolio-gate?error=invalid-email');
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Create session in NocoDB and get the record ID for heartbeat tracking
  let sessionRecordId: number | null = null;
  try {
    const result = await createEmailAccessSession(normalizedEmail);
    if (result.success && result.record) {
      // NocoDB v3 returns array of created records
      const records = Array.isArray(result.record) ? result.record : [result.record];
      sessionRecordId = records[0]?.id || null;
      console.log(`[temp-access] Created session record ID: ${sessionRecordId}`);
    }
  } catch (err) {
    console.error('[temp-access] Failed to create session:', err);
  }

  // Generate session token
  const sessionToken = createHash('sha256')
    .update(randomBytes(32).toString('hex') + normalizedEmail + Date.now())
    .digest('hex');

  // Set authentication cookie
  cookies.set('universal_portfolio_access', sessionToken, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  // Store email for reference
  cookies.set('accessor_email', normalizedEmail, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  // Store session record ID for heartbeat tracking (client-readable)
  if (sessionRecordId) {
    cookies.set('session_record_id', String(sessionRecordId), {
      httpOnly: false, // Client needs to read this for heartbeat
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
  }

  console.log(`[temp-access] Granted access to ${normalizedEmail}`);
  return redirect(redirectTo);
};
