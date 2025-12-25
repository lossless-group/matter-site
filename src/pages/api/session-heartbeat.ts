import type { APIRoute } from 'astro';
import { updateSessionHeartbeat } from '@lib/nocodb';

export const prerender = false;

/**
 * Session Heartbeat Endpoint
 *
 * Called periodically by client-side script while user is viewing
 * confidential content. Updates sessionEndTime as a rolling "last seen"
 * timestamp.
 *
 * When heartbeats stop (user closes tab, navigates away), the last
 * sessionEndTime represents when they stopped viewing.
 *
 * Session duration = sessionEndTime - sessionStartTime
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  // Get session record ID from cookie
  const sessionRecordId = cookies.get('session_record_id')?.value;

  if (!sessionRecordId) {
    return new Response(
      JSON.stringify({ success: false, error: 'No session record ID' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const recordId = parseInt(sessionRecordId, 10);
  if (isNaN(recordId)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid session record ID' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Update the session's "last seen" time
  const result = await updateSessionHeartbeat(recordId);

  if (result.success) {
    return new Response(
      JSON.stringify({ success: true, timestamp: new Date().toISOString() }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: false, error: result.error }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
};

/**
 * GET endpoint for simple health check / debugging
 */
export const GET: APIRoute = async ({ cookies }) => {
  const sessionRecordId = cookies.get('session_record_id')?.value;
  const accessorEmail = cookies.get('accessor_email')?.value;

  return new Response(
    JSON.stringify({
      hasSession: Boolean(sessionRecordId),
      sessionRecordId: sessionRecordId || null,
      email: accessorEmail ? `${accessorEmail.slice(0, 3)}***` : null,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
