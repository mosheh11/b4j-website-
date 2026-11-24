/**
 * Interface wording and choice-list labels — owned by the code, not the CMS
 * (content contract §1). One table per language; Hebrew only for now.
 */
import type { EventLevel, EventType, Lang, SocialPlatform } from './cms';

export const NAV = [
  { href: '/', label: 'בית' },
  { href: '/join/', label: 'הצטרפות לפעילות' },
  { href: '/about/', label: 'אודות' },
  { href: '/events/', label: 'אירועים' },
  { href: '/updates/', label: 'עדכונים' },
  { href: '/map/', label: 'מפה' },
] as const;

export const EVENT_TYPE: Record<EventType, string> = {
  monthly_ride: 'רכיבה חודשית',
  annual_ride: 'הרכיבה השנתית',
  workshop: 'סדנה',
  other: 'אירוע קהילה',
};

export const EVENT_LEVEL: Record<EventLevel, string> = {
  all: 'לכל הרמות',
  beginner: 'מתחילים',
  intermediate: 'בינוני',
  advanced: 'מתקדמים',
};

export const SOCIAL: Record<SocialPlatform, string> = {
  instagram: 'אינסטגרם',
  facebook: 'פייסבוק',
  x: 'X',
  whatsapp: 'וואטסאפ',
  youtube: 'יוטיוב',
  tiktok: 'טיקטוק',
};

export const UI = {
  join: 'הצטרפו',
  joinActivity: 'הצטרפות לפעילות',
  joinWhatsapp: 'הצטרפו בוואטסאפ',
  joinGroup: 'הצטרפות',
  register: 'הרשמה',
  addToCalendar: 'הוספה ליומן',
  facebookEvent: 'אירוע בפייסבוק',
  allEvents: 'לכל האירועים',
  allUpdates: 'הכל',
  readMore: 'להמשך קריאה',
  toGallery: 'לגלריית האירוע',
  loadMore: 'טעינת אירועים נוספים',
  filterAll: 'הכל',
  minutesRead: (n: number) => `${n} דקות קריאה`,
  participants: (n: number) => `${n.toLocaleString('he-IL')} משתתפים`,
  spotsLeft: (n: number) => `נותרו ${n.toLocaleString('he-IL')} מקומות`,
  menu: 'תפריט',
  closeMenu: 'סגירת התפריט',
  skipToContent: 'דילוג לתוכן',
  nextEvent: 'האירוע הקרוב',
  noUpcoming: 'אין כרגע אירועים קרובים. הצטרפו לקבוצה הכללית ונעדכן ראשונים.',
  noPosts: 'אין עדיין עדכונים בקטגוריה הזו.',
  newsletter: 'הרשמה לניוזלטר',
  contact: 'יצירת קשר',
  donate: 'תרומה לעמותה',
  countdown: { days: 'ימים', hours: 'שעות', minutes: 'דקות', started: 'הרכיבה יצאה לדרך!' },
} as const;

/* ---------------- dates (Jerusalem wall-clock strings) ---------------- */

const TZ = 'Asia/Jerusalem';
const LOCALE: Record<Lang, string> = { he: 'he-IL', en: 'en-GB', ar: 'ar' };

/** Parse "YYYY-MM-DDTHH:mm[:ss]" as a calendar value (no TZ shift for display). */
function parts(local: string) {
  const [d, t = '00:00'] = local.split('T');
  const [y, m, day] = d.split('-').map(Number);
  const [hh, mm] = t.split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, day, hh, mm));
}
const fmt = (o: Intl.DateTimeFormatOptions, lang: Lang = 'he') =>
  new Intl.DateTimeFormat(LOCALE[lang], { timeZone: 'UTC', ...o });

/** "יום שישי, 4.12" */
export function formatDay(local: string, lang: Lang = 'he') {
  const d = parts(local);
  const weekday = fmt({ weekday: 'long' }, lang).format(d);
  return `${weekday}, ${d.getUTCDate()}.${d.getUTCMonth() + 1}`;
}
/** "07:30" */
export function formatTime(local: string) {
  return local.split('T')[1]?.slice(0, 5) ?? '';
}
/** "4 בדצמבר 2026" */
export function formatDate(local: string, lang: Lang = 'he') {
  return fmt({ day: 'numeric', month: 'long', year: 'numeric' }, lang).format(parts(local));
}
/** "12.11.26" */
export function formatShortDate(local: string) {
  const d = parts(local);
  return `${d.getUTCDate()}.${d.getUTCMonth() + 1}.${String(d.getUTCFullYear()).slice(2)}`;
}
/** Month + day pieces for a date badge. */
export function dateBadge(local: string, lang: Lang = 'he') {
  const d = parts(local);
  return { day: d.getUTCDate(), month: fmt({ month: 'short' }, lang).format(d) };
}
/** "שעה וחצי" style duration. */
export function formatDuration(startLocal: string, endLocal: string) {
  const mins = Math.round((parts(endLocal).getTime() - parts(startLocal).getTime()) / 60000);
  if (mins <= 0) return '';
  const h = Math.floor(mins / 60), m = mins % 60;
  const hours = h === 0 ? '' : h === 1 ? 'שעה' : h === 2 ? 'שעתיים' : `${h} שעות`;
  if (m === 0) return hours;
  if (m === 30) return h ? `${hours} וחצי` : 'חצי שעה';
  return h ? `${hours} ו־${m} דקות` : `${m} דקות`;
}
/** True if start and end fall on the same calendar day. */
export function sameDay(a: string, b: string) {
  return a.slice(0, 10) === b.slice(0, 10);
}
