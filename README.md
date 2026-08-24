# GWA Premier League 2026-27 — Setup

This is the Premier League version of the WC26 prediction league, sharing your
existing `gwa-worldcup` Firebase project (data is isolated in `pl_`-prefixed
Firestore collections, so it will never touch or overwrite your World Cup data).

## What's included
- `index.html`, `style.css`, `firebase-config.js` — the site
- `gwa-logo-purple.png` — purple/white transparent GWA logo (fixes the broken-image issue from the original white-background logo)
- `pl-logo.png`, `pl-banner.jpg` — Premier League crest and 2026/27 banner (yours), shown on the login screen
- **Team badges**: 3-letter club-color badges (e.g. "ARS" in Arsenal red) replace the ⚽ emoji everywhere — used instead of official club crests, which I can't reproduce due to trademark/copyright, and instead of the Pinterest image you linked, which I can't access or reuse
- **Premier League color theme**: deep purple/magenta (`#38003C` / `#E90052`)
- Real fixtures for **Gameweeks 1–9**, UAE kickoff times, real stadium names — all cross-checked against ESPN/Sky Sports/Opta/the official PL fixture-amendments page
- GW1's pre-launch matches are included with real scores but excluded from prediction scoring (nobody could have predicted them) — still count in the real League Table
- Knockout-stage system fully removed (no bracket in the Premier League) — Table tab now shows your predicted table and the actual table side by side, with a ✓ when a team sits in the same position in both
- **Rules tab** — scoring, bonus points, and prediction rules all spelled out
- **Favourite team system**: pick a team (❤️ My Team button in the header) — get a one-time celebration toast + **+1 point** every time they win; optional "Use My Team's Colors" site-theme toggle
- **+1 bonus point** for joining before 31 August 2026
- **Top 4 / Bottom 3 season predictions**: pick your Champions League top 4 and relegated bottom 3, in order — 5 days from joining to lock them in (or lock immediately by confirming); +1 point per correct team, +1 more if the order is exact. Scoring activates once you fill in `ACTUAL_TOP4` / `ACTUAL_RELEGATED` in `index.html` at the end of the season.
- **Bug fixes this pass**: accuracy % denominator now correctly excludes pre-launch matches; tab-highlighting was broken (matched by stale array position) and is now fixed; colorblind mode had several low-contrast pastel colors on light theme, now fixed; removed a leftover World Cup warning banner
- Verified: full JS syntax check clean, HTML tag balance checked

## Deploy

Your repo already exists at github.com/kmahmoudarda-art/gwa-premier-league —
just upload these 7 files to it (this will overwrite the older versions):

1. Go to https://github.com/kmahmoudarda-art/gwa-premier-league
2. Click **Add file → Upload files**
3. Drag in all 7 files from this folder → **Commit changes**
4. Go to https://pages.cloudflare.com → **Create a project** → **Connect to Git**
5. Select the `gwa-premier-league` repo → Build command: *(leave empty)* →
   Build output directory: `/` → **Save and Deploy**
6. Once live, go to Firebase console → Authentication → Settings →
   **Authorized domains** → add your new `*.pages.dev` URL (skip this if
   your WC26 domain pattern already covers it — same Firebase project)

## Keeping it updated
- **Add results**: edit `MANUAL_RESULTS` in `index.html` the same way you do
  for WC26 — add `'Mxx': { home: X, away: Y }` after each match.
- **Add future gameweeks (GW10-38)**: append more entries to `STATIC_MATCHES`
  and `KICKOFF_TIMES` in the same format. I only generated GW1-9 because
  broadcaster scheduling means later Premier League kickoff times shift as
  the season goes on — I'd recommend pulling the next few gameweeks in every
  few weeks rather than all 38 at once (this avoids re-doing times that
  change).

## Points system (unchanged from WC26)
Exact score = 3 pts · Correct result = 1 pt · Wrong = 0 pts
