import type { APIRoute } from 'astro';
import { getEvents } from '../lib/cms';
import { toICS } from '../lib/calendar';

/** Synced calendar feed: every published event (upcoming and past). */
export const GET: APIRoute = async ({ site }) => {
  const events = await getEvents();
  return new Response(toICS(events, site?.href ?? 'https://bikes4jlm.org'), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
