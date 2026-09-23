# EXHILARATION — Standalone Website

## Original Problem Statement
"Build a landing page: use the event artist tracker app i have created on here into a website"
Follow-ups: "Create it as a standalone website nothing to do with the app but extract the info from the website" · "Do it for https://www.skiddle.com/g/exhilaration-/" · "Include socials, lineups and soundcloud (soundcloud.com/exhilarationtechno, instagram.com/exhilaration.techno)" · "Use the exhilaration logo too and remove the every dj every warehouse one signal"

## Product
Standalone official website for EXHILARATION — a hard techno / trance event series based in Liverpool / North West. Content sourced from the real Skiddle brand page (https://www.skiddle.com/g/exhilaration-/): about text, stats (4.5★, 1,191 reviews, 8,643 followers), logo, and the live upcoming event "Exhilaration Presents: RAGETRAIN All Night Long" (Sat 03 Oct 2026, O2 Academy Liverpool).

## User Personas
- Ravers looking for upcoming EXHILARATION events and tickets
- Fans wanting mixes/sets (SoundCloud) and announcements (Instagram) 
- First-time visitors checking what the brand is about

## Architecture
- Frontend: React (CRA + craco), Tailwind, framer-motion, lenis smooth scroll, sonner toasts, shadcn accordion. Single-page site: Header (brand logo), Hero (logo, masked line reveal "Raw sound. Heavy line-ups. No compromise.", soundwave canvas, parallax, live stats), Marquee, Manifesto (3 numbered chapters), Events board (real Skiddle listings, genre filters, lineup details, archive state, empty state), Waitlist (email capture), FAQ, Connect (SoundCloud embed + Instagram/SoundCloud/Skiddle links), Footer (socials, watermark).
- Backend: FastAPI + MongoDB. `POST /api/waitlist` (dedupe by email), `GET /api/waitlist/count`, `GET /api/`.
- Design system: Void black #08080A, acid lime #CCFF00, crimson #FF2B56; Syne display + Space Mono body; clipped-corner frames, noise overlay, scanlines. Guidelines: /app/design_guidelines.json

## Implemented
- 2026-09-23: Standalone site built; real Skiddle data; EXHILARATION logo; brand tagline headline; Connect section with SoundCloud embed + socials; responsive fixes.
- 2026-09-23 (2): AUTO-SYNC live — backend scrapes Skiddle brand page JSON-LD on startup + every 6h, upserts into db.events, serves GET /api/events (upcoming only); events board is fully API-driven with real flyer art, prices and lineups; archive event removed. DROP ANNOUNCEMENTS live — Emergent managed Resend (EMERGENT_EMAIL_KEY, from_name EXHILARATION); new synced events trigger announcement emails to all notify-list subscribers (first seed does not email); guardrail gate on every send; test send to delivered@resend.dev accepted (202). RAVE GALLERY added ("The floor, framed", 7 curated images). Manifesto chapters 01/02 renamed to "Headline Line-ups" and "Warehouse Rooms". Admin force-sync: POST /api/admin/sync with X-Sync-Secret header (SYNC_SECRET in backend/.env).

## Notes
- Events auto-sync from https://www.skiddle.com/g/exhilaration-/ (JSON-LD scrape, 6h interval); genre is keyword-guessed from event name/description.
- Ticket buttons link to real Skiddle pages (event + brand).
- Waitlist emails stored in MongoDB; subscribers get automatic announcement emails when a new event syncs.
- Gallery images are the REAL photos from @exhilaration.techno Instagram, downloaded and bundled in frontend/public/gallery/ (Instagram CDN links expire, so local copies are used). Refresh by re-running the Instagram pull.

## Backlog
- P1: Refresh gallery with newer Instagram posts over time
- P1: Unsubscribe link for announcement emails
- P2: Custom domain + deploy

## Test Credentials
- None required (no auth). See /app/memory/test_credentials.md
