# fackt.io

Astro site for Fackt. No CMS: all content lives in this repo.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Where to edit

| What | File |
| --- | --- |
| Case studies (one file each) | `src/content/work/*.md` |
| Case study images | `public/work/` |
| Services, pricing, reviews, clients, links | `src/data/site.ts` |
| Video testimonials (thumbnails in `public/testimonials/`) | `src/data/site.ts` → `testimonials` |
| Search shortcuts and synonyms | `src/data/site.ts` → `searchChips`, `searchSynonyms` |
| Service pages (/services/...): headline, deliverables, process, FAQ, related work | `src/data/servicePages.ts` |
| Colors, glass material, spacing | `src/styles/global.css` |

### Add a case study
Create `src/content/work/<slug>.md` with the frontmatter used by the others. `keywords` are what people might type in the search bar. Set `featured: true` to show it in Selected work.

### Add a testimonial video
Put a URL (mp4, Mux or Cloudflare Stream file) in the `video` field. Tiles without a video show "Video coming soon".

## Search
`src/scripts/search.ts`. Keyword and synonym matching over the case studies, runs in the browser, no server.
Enter opens the best match. A search with no match offers a booking link prefilled with the query.
Shortcuts: Cmd/Ctrl + K or `/`. After the hero, the search hides behind a small pill at the bottom; opening it docks the full bar there until closed (Esc or ×).

## Booking page
`src/pages/book.astro` embeds the Cal.com event (`calLink` in `src/data/site.ts`). Every "Book a call" button links to `/book`.
Text typed into the search or the "Tell us what you're building" field arrives as `?notes=` and is prefilled into the booking form.

## Before launch
- Replace the placeholder images in `public/work/` with real screenshots (they are mockups with made-up data).
- Add real case study text to each `src/content/work/*.md`.
- Confirm the Contra rating in `src/data/site.ts` → `rating`.
- Add video URLs to the testimonials.

## Deploy
Netlify (`netlify.toml`). Build command `npm run build`, publish directory `dist`.

## CMS (Decap)

Editors work at `/admin`. Everything on the homepage that changes often is a content file:

| In the CMS | File(s) |
| --- | --- |
| Settings > Homepage (hero text, ask bar suggestions, logos, rating) | `src/content/settings/home.json` |
| Settings > Pricing | `src/content/settings/pricing.json` |
| Hero quotes | `src/content/quotes/*.json` |
| Work (incl. "Show in hero stage" and "Show in Selected work") | `src/content/work/*.md` |
| Video testimonials | `src/content/videos/*.json` |
| Written reviews | `src/content/reviews/*.json` |

Uploaded images go to `public/uploads`.

Hosting is Cloudflare (free). `wrangler.jsonc` + `worker/index.js` serve `dist` as a Worker and route the API (the `functions/` folder is used as-is, so Cloudflare Pages works too):
- `functions/api/auth.js` and `callback.js`: GitHub login for the CMS
- `functions/api/form.js`: emails the free audit and postcard forms to you through Resend

Cloudflare Pages settings: build command `npm run build`, output `dist`, and these variables:
`NODE_VERSION=22`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (secret), `RESEND_API_KEY` (secret), `FORM_TO` (your email), optional `FORM_FROM`.

GitHub OAuth app callback URL: `https://<your site>/api/callback`.

Local editing: `npm run dev` and `npx decap-server`, then open `http://localhost:4321/admin/index.html`.
