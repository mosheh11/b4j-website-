// @ts-check
import { defineConfig } from 'astro/config';

// BASE_PATH lets the same build serve from a sub-path (GitHub Pages project
// sites live at /<repo>/). Locally and on a custom domain it stays "/".
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: process.env.SITE_URL || 'https://bikes4jlm.org',
  base,
  trailingSlash: 'always',
  // Astro 7 defaults to 'jsx' whitespace stripping; keep HTML-aware behavior
  // (same choice as the bikes4jlm.org repo).
  compressHTML: true,
  devToolbar: { enabled: false },
});
