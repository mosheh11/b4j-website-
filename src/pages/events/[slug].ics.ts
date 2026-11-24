import type { APIRoute, GetStaticPaths } from 'astro';
import { getEvents, type CmsEvent } from '../../lib/cms';
import { toICS } from '../../lib/calendar';

export const getStaticPaths = (async () => {
  const events = await getEvents();
  return events.map((event) => ({ params: { slug: event.slug }, props: { event } }));
}) satisfies GetStaticPaths;

/** Single-event .ics for "Add to calendar → Apple / Outlook". */
export const GET: APIRoute = ({ props, site }) => {
  const { event } = props as { event: CmsEvent };
  return new Response(toICS([event], site?.href ?? 'https://bikes4jlm.org', event.title), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.slug}.ics"`,
    },
  });
};
