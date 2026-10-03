# Stellite Works — Website

Static marketing site for Stellite Works LLC, an SAP staffing and solutions firm (recruitment, C2C, contract and full-time placement across the USA, plus SAP project delivery).

## Files
- `index.html` — page content and sections
- `styles.css` — design system and responsive layout
- `script.js` — nav, scroll reveals, hiring-model tabs, footprint map, contact form
- `assets/` — logo and favicon

## Run locally
Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Before going live
- Replace `info@stelliteworks.com` in `index.html` and `script.js` (`CONTACT_EMAIL`) with your real address.
- The contact form opens the visitor's email app by default. To collect submissions in-page, set `FORM_ENDPOINT` in `script.js` to a form service URL (e.g. Formspree).
- Edit the city list in `script.js` (`cities`) to match the metros you actually serve.

## Deploy
Any static host works: GitHub Pages, Netlify, Vercel or Cloudflare Pages. No build step needed.
