# GWA Premier League 2026-27 — Setup

This is the Premier League version of the WC26 prediction league, sharing your
existing `gwa-worldcup` Firebase project (data is isolated in `pl_`-prefixed
Firestore collections, so it will never touch or overwrite your World Cup data).

## What's included
- `index.html`, `style.css`, `firebase-config.js` — the site
- `gwa-logo.png` — original GEMS logo (used on the login screen in a white badge)
- `gwa-logo-purple.png` — transparent purple/white version (used in the compact header)
- `pl-logo.png`, `pl-banner.jpg` — Premier League crest and 2026/27 banner (yours)
- **Login screen rebuilt**: the PL banner is now one large centered hero image above the card, the GEMS logo sits in a small white badge at the top of the card — this fixes the side-by-side overlap bug from the previous version (the old layout put a big image and the card as flex siblings, which rendered side-by-side on wide screens)
- **Card style reverted** to WC26's plain rounded look (dropped the accent-border differentiation from the previous pass)
- **Team badges fixed**: real 3-letter club codes (ARS, MUN, LIV, etc.) via a proper lookup table — the old version was cutting single-word team names down to 1 letter
- **Top 4 / Bottom 3 predictions moved**: now sit under the calendar in the Predictions tab sidebar, in a much more compact card design (small text, tight spacing) instead of the previous full-width oversized cards
- **Favourite team overhaul**:
  - Can only be picked **once** — confirmed with a warning dialog, then locked permanently
  - Once locked, picking a team changes the **entire site theme** (backgrounds, cards, inputs, header — not just buttons/labels), derived from the team's color, with text color kept readable in both variants
  - After locking, a single toggle switches between a **dark** and **light** version of the team theme (replaces the general dark/light button while a team theme is active)
  - "Use Default Site Theme" button in the same settings modal to go back to plain PL purple/magenta
- **Colorblind mode contrast fix** for light theme, **Rules tab**, **active-tab highlighting fix**, **merged predictions/actual table view** with ✓ marks, **+1 bonus for joining before 31 Aug**, **+1 bonus per favourite-team win with a celebration toast** — all still in from the previous pass
- Verified: full JS syntax check clean, HTML tag balance checked

## Deploy

Your repo already exists at github.com/kmahmoudarda-art/gwa-premier-league —
just upload these 8 files to it (this will overwrite the older versions):

1. Go to https://github.com/kmahmoudarda-art/gwa-premier-league
2. Click **Add file → Upload files**
3. Drag in all 8 files from this folder → **Commit changes**
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
