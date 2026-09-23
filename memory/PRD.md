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
- 2026-09-23: Standalone site built; real Skiddle data (brand page as ticket destination, RAGETRAIN event with direct ticket link, YOSHIKO × INFLICTION archive entry, real stats); EXHILARATION logo in header + hero; headline replaced with brand tagline; Connect section with working SoundCloud embed (live tracks) + Instagram/Skiddle links; lineup info on event cards; responsive fixes (375/768/1366 verified, no overflow).

## Notes
- Events board is manually maintained (hardcoded from Skiddle) — not a live Skiddle feed.
- Ticket buttons link to real Skiddle pages (event + brand).
- Waitlist emails stored in MongoDB; no confirmation email sent yet.

## Backlog
- P0: Auto-sync events from Skiddle brand page (scrape/API cron)
- P1: Past events / gallery section with photography
- P1: Email notifications via Resend when new dates drop
- P2: Custom domain + deploy

## Test Credentials
- None required (no auth). See /app/memory/test_credentials.md
