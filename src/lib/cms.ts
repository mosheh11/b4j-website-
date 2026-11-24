/**
 * Content layer — the only place pages get CMS-owned content from.
 *
 * Follows the bikes4jlm.org content contract (Directus):
 *   - content is read at build time only;
 *   - visitor-facing text lives in `translations` keyed by language code;
 *   - collection items without a translation in a language are hidden there,
 *     singletons fall back to Hebrew field by field;
 *   - choice-list values (event `type`, `level`, social `platform`) are fixed
 *     here and the code owns their labels (see ./labels.ts).
 *
 * If CMS_URL and CMS_TOKEN are set, items come from Directus REST. Otherwise
 * the mock JSON in src/mock/ is used, shaped like the Directus responses.
 */
import mockSite from '../mock/site_settings.json';
import mockGroups from '../mock/whatsapp_groups.json';
import mockEvents from '../mock/events.json';
import mockPosts from '../mock/posts.json';
import mockCategories from '../mock/post_categories.json';
import mockCollections from '../mock/collections.json';
import mockPages from '../mock/pages.json';

export type Lang = 'he' | 'en' | 'ar';
export const DEFAULT_LANG: Lang = 'he';

/** A Directus file reference. `id` is a Directus file id, or a local path in mock mode. */
export interface CmsImage {
  id: string;
  /** Alt text (the file's Description in Directus). Empty only for decorative images. */
  description?: string | null;
}

type Translated<T> = { translations?: Array<{ languages_code: string } & Partial<T>> };

const CMS_URL = (import.meta.env.CMS_URL as string | undefined)?.replace(/\/$/, '');
const CMS_TOKEN = import.meta.env.CMS_TOKEN as string | undefined;
export const USING_MOCK = !(CMS_URL && CMS_TOKEN);

/* ------------------------------------------------------------------ */
/* Fetching                                                            */
/* ------------------------------------------------------------------ */

async function directus<T>(path: string): Promise<T> {
  const res = await fetch(`${CMS_URL}${path}`, {
    headers: { Authorization: `Bearer ${CMS_TOKEN}` },
  });
  // Contract: if the CMS is unreachable or broken, the build fails.
  if (!res.ok) throw new Error(`CMS ${res.status} on ${path}`);
  const json = (await res.json()) as { data: T };
  return json.data;
}

const DEEP = 'fields=*,translations.*,image.id,image.description';
/** Contract: the production build reads only published items (for collections with a status). */
const PUBLISHED = '&filter[status][_eq]=published';

async function collection<T>(name: string, mock: unknown, query = ''): Promise<T[]> {
  if (USING_MOCK) return structuredClone(mock) as T[];
  return directus<T[]>(`/items/${name}?${DEEP}&limit=-1${query}`);
}

async function singleton<T>(name: string, mock: unknown): Promise<T> {
  if (USING_MOCK) return structuredClone(mock) as T;
  return directus<T>(`/items/${name}?fields=*.*`);
}

/* ------------------------------------------------------------------ */
/* Localization                                                        */
/* ------------------------------------------------------------------ */

type Flat<T> = Omit<T, 'translations'>;

/** Collection item → localized, or null if it has no translation in `lang`. */
function localizeItem<T extends Translated<any>, F>(item: T, lang: Lang): (Flat<T> & F) | null {
  const t = item.translations?.find((x) => x.languages_code === lang);
  if (!t) return null;
  const { translations, ...rest } = item;
  const { languages_code, ...fields } = t;
  return { ...rest, ...fields } as Flat<T> & F;
}

/** Singleton → localized, falling back to Hebrew field by field. */
function localizeSingleton<T extends Translated<any>, F>(item: T, lang: Lang): Flat<T> & F {
  const he = item.translations?.find((x) => x.languages_code === DEFAULT_LANG) ?? {};
  const own = item.translations?.find((x) => x.languages_code === lang) ?? {};
  const { translations, ...rest } = item;
  const merged: Record<string, unknown> = { ...he };
  for (const [k, v] of Object.entries(own)) if (v !== null && v !== '' && v !== undefined) merged[k] = v;
  delete merged.languages_code;
  return { ...rest, ...merged } as Flat<T> & F;
}

function localizeAll<T extends Translated<any>, F>(items: T[], lang: Lang) {
  return items.map((i) => localizeItem<T, F>(i, lang)).filter((x): x is Flat<T> & F => x !== null);
}

const bySort = <T extends { sort?: number }>(a: T, b: T) => (a.sort ?? 0) - (b.sort ?? 0);

/* ------------------------------------------------------------------ */
/* Assets                                                              */
/* ------------------------------------------------------------------ */

/** Prefix a site-relative path with the deploy base (GitHub Pages sub-path). */
export function withBase(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Image URL for a CMS file (or a local path in mock mode). */
export function assetUrl(img: CmsImage | null | undefined, opts: { width?: number } = {}): string {
  if (!img?.id) return '';
  if (img.id.startsWith('/')) return withBase(img.id);
  const q = opts.width ? `?width=${opts.width}&format=webp` : '';
  return `${CMS_URL}/assets/${img.id}${q}`;
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type SocialPlatform = 'instagram' | 'facebook' | 'x' | 'whatsapp' | 'youtube' | 'tiktok';
export type EventType = 'monthly_ride' | 'annual_ride' | 'workshop' | 'other';
export type EventLevel = 'all' | 'beginner' | 'intermediate' | 'advanced';

export interface SiteSettings {
  name: string;
  short_name: string;
  tagline: string;
  footer_about: string;
  address?: string;
  logo: CmsImage;
  logo_on_dark: CmsImage;
  email: string;
  phone?: string;
  newsletter_url?: string;
  donation_url?: string;
  contact_form_url?: string;
  calendar_subscribe_url?: string;
  community_group: number;
  /** X post URLs to show in the social feed (X blocks profile timelines for logged-out visitors). */
  x_featured_posts?: string[];
  social_links: Array<{ platform: SocialPlatform; url: string; handle?: string }>;
}

export interface WhatsappGroup { id: number; sort: number; invite_url: string; name: string; description?: string }

export interface CmsEvent {
  id: number; slug: string; type: EventType;
  start: string; end: string;
  image?: CmsImage | null;
  level?: EventLevel | null; distance_km?: number | null;
  price?: string | null; capacity?: number | null; spots_left?: number | null;
  registration_url?: string; facebook_event_url?: string;
  participants_count?: number | null; gallery_url?: string;
  title: string; summary?: string; meeting_point?: string; route?: string; instructor?: string; body?: string;
  /** Derived by the code from `end` at build time. */
  is_upcoming: boolean;
}

export interface Post {
  id: number; slug: string; date_published: string; category: string;
  author?: string; reading_minutes?: number; image?: CmsImage | null;
  title: string; excerpt: string; body: string;
}
export interface PostCategory { id: string; sort: number; name: string }
export interface Team { id: number; sort: number; name: string; description?: string; members?: string[]; contact_email?: string }
export interface Milestone { id: number; year: number; title: string; description?: string }
export interface Stat { id: number; sort: number; value: string; label: string }
export interface Partner { id: number; sort: number; name: string; url?: string; logo?: CmsImage | null }
export interface GalleryItem { id: number; sort: number; image: CmsImage }
export interface LegalPage { id: number; slug: string; title: string; body: string }

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

export async function getSiteSettings(lang: Lang = DEFAULT_LANG): Promise<SiteSettings> {
  return localizeSingleton(await singleton<any>('site_settings', mockSite), lang);
}

/** Page copy singleton, e.g. getPage('home') reads `page_home`. Fields are defined by the page template. */
export async function getPage<T = Record<string, any>>(route: string, lang: Lang = DEFAULT_LANG): Promise<T> {
  const mock = (mockPages as Record<string, unknown>)[`page_${route}`] ?? {};
  return localizeSingleton(await singleton<any>(`page_${route}`, mock), lang) as T;
}

export async function getWhatsappGroups(lang: Lang = DEFAULT_LANG): Promise<WhatsappGroup[]> {
  return localizeAll<any, WhatsappGroup>(await collection('whatsapp_groups', mockGroups), lang).sort(bySort);
}

/** The general community group (site_settings.community_group) and the rest, split. */
export async function getGroupsSplit(lang: Lang = DEFAULT_LANG) {
  const [site, groups] = await Promise.all([getSiteSettings(lang), getWhatsappGroups(lang)]);
  const community = groups.find((g) => g.id === site.community_group) ?? groups[0];
  return { community, topics: groups.filter((g) => g !== community) };
}

/** Jerusalem wall-clock string → comparable Date (build server may not be in Asia/Jerusalem). */
export function jlmDate(local: string): Date {
  // Israel is UTC+2 in winter, UTC+3 in summer (last Fri of Mar → last Sun of Oct).
  const probe = new Date(`${local}Z`);
  const offset = israelOffsetHours(probe);
  return new Date(probe.getTime() - offset * 3600_000);
}
function israelOffsetHours(d: Date): number {
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jerusalem', timeZoneName: 'shortOffset' });
  const part = fmt.formatToParts(d).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+2';
  return Number(part.replace('GMT', '')) || 2;
}

export async function getEvents(lang: Lang = DEFAULT_LANG): Promise<CmsEvent[]> {
  const now = Date.now();
  return localizeAll<any, CmsEvent>(await collection('events', mockEvents, PUBLISHED), lang)
    .map((e) => ({ ...e, is_upcoming: jlmDate(e.end).getTime() > now }))
    .sort((a, b) => a.start.localeCompare(b.start));
}

export async function getUpcomingEvents(lang: Lang = DEFAULT_LANG) {
  return (await getEvents(lang)).filter((e) => e.is_upcoming);
}
export async function getPastEvents(lang: Lang = DEFAULT_LANG) {
  return (await getEvents(lang)).filter((e) => !e.is_upcoming).reverse();
}
/** "The next ride" = the soonest upcoming monthly or annual ride. */
export async function getNextRide(lang: Lang = DEFAULT_LANG) {
  return (await getUpcomingEvents(lang)).find((e) => e.type === 'monthly_ride' || e.type === 'annual_ride') ?? null;
}

export async function getPosts(lang: Lang = DEFAULT_LANG): Promise<Post[]> {
  return localizeAll<any, Post>(await collection('posts', mockPosts, PUBLISHED), lang)
    .sort((a, b) => b.date_published.localeCompare(a.date_published));
}
export async function getPostCategories(lang: Lang = DEFAULT_LANG): Promise<PostCategory[]> {
  return localizeAll<any, PostCategory>(await collection('post_categories', mockCategories), lang).sort(bySort);
}

const C = mockCollections;
export const getTeams = async (lang: Lang = DEFAULT_LANG) => localizeAll<any, Team>(await collection('teams', C.teams), lang).sort(bySort);
export const getMilestones = async (lang: Lang = DEFAULT_LANG) => localizeAll<any, Milestone>(await collection('milestones', C.milestones), lang).sort((a, b) => a.year - b.year);
export const getStats = async (lang: Lang = DEFAULT_LANG) => localizeAll<any, Stat>(await collection('stats', C.stats), lang).sort(bySort);
export const getPartners = async (lang: Lang = DEFAULT_LANG) => localizeAll<any, Partner>(await collection('partners', C.partners), lang).sort(bySort);
export const getLegalPages = async (lang: Lang = DEFAULT_LANG) => localizeAll<any, LegalPage>(await collection('legal_pages', C.legal_pages), lang);
export async function getGallery(): Promise<GalleryItem[]> {
  return (await collection<GalleryItem>('gallery', C.gallery)).sort(bySort);
}
