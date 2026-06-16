# אופניים בשביל ירושלים — אתר העמותה

אתר סטטי (HTML + CSS + JS בלבד), ללא שלב build, מוכן לפריסה ב-GitHub Pages.

## פריסה ב-GitHub Pages

1. דחפו את כל הקבצים לריפו (ענף `main`).
2. ב-Settings → Pages, בחרו Branch: `main`, Folder: `/ (root)`.
3. האתר יעלה בכתובת `https://<user>.github.io/<repo>/`.

אין צורך בהגדרות נוספות — כל הקישורים יחסיים.

## מבנה הקבצים

| קובץ | תיאור |
|------|-------|
| `index.html` | דף הבית |
| `about.html` | אודות, צוות ושותפים |
| `activities.html` | פעילויות עם סינון לפי סוג |
| `map.html` | מפת מסלולים (OpenStreetMap + Google Maps) |
| `join.html` | הצטרפות, רשתות חברתיות וחברות |
| `style.css` | עיצוב משותף |
| `nav.js` | תפריט נייד + סימון עמוד פעיל |

## פריטים להחלפה לפני העלייה (placeholders)

- **לוגו:** הוסיפו קובץ `logo.svg` בתיקייה הראשית. כל עוד אין קובץ, הלוגו פשוט לא יוצג (יש `onerror`).
- **כתובת מייל:** ב-`join.html` — `info@example.org` (גם בקישור `mailto` וגם בטקסט).
- **קישורי רשתות חברתיות** ב-`join.html`:
  - פייסבוק: `https://facebook.com/PLACEHOLDER`
  - אינסטגרם: `https://instagram.com/PLACEHOLDER`
- **קבוצות וואטסאפ** ב-`join.html`: `PLACEHOLDER1`, `PLACEHOLDER2`, `PLACEHOLDER3`.
- **שמות ותפקידי הצוות** ב-`about.html` — שמות לדוגמה בלבד.
- **שותפים** ב-`about.html` — שמות לדוגמה.
- **אירועים** ב-`activities.html` — תאריכים, שעות ומיקומים לדוגמה.
- **סכומי חברות** ב-`join.html` — בדקו שהמחירים נכונים.

## עיצוב

פלטת צבעים: סגול + לבן + אפורים בלבד. הגדרות הצבע נמצאות במשתני CSS בראש `style.css`.
