# GWA Premier League 2026-27 — Setup

This is the Premier League version of the WC26 prediction league, sharing your
existing `gwa-worldcup` Firebase project (data is isolated in `pl_`-prefixed
Firestore collections, so it will never touch or overwrite your World Cup data).

## Colors
**Navy blue (`#1D4ED8`) / white** is now the default theme — the pink/crimson
(`#E90052`) used before was applied to 60+ elements (borders, badges,
backgrounds, text), which read as "the whole site is red" rather than an
accent. Swapped it everywhere, including the login gradient and dark-theme
backgrounds (were purple-tinted, now navy-tinted). Also fixed a side-effect
where the "Battuta" house color had accidentally been swept into that same
replace, clashing with "Razi" — restored it to amber/gold.

## What's included
- `index.html`, `style.css`, `firebase-config.js` — the site
- `gwa-logo.png`, `gwa-logo-purple.png`, `pl-logo.png`, `pl-banner.jpg` — images
- **Fixed real bugs this pass**:
  - "Use Default Site Theme" button did nothing — `resetTeamTheme` was never exposed to the page (module-script scoping issue), now fixed
  - Couldn't scroll past the Predictions tab sidebar without jumping to the bottom of the page — the sidebar was `position: sticky`, which worked fine for the small calendar alone but broke once the Top 4/Bottom 3 picker cards made it taller than the screen; now normal (static) positioning
  - Calendar day clicks not registering — same sticky-positioning issue was very likely the cause (a trapped sticky container can block clicks on elements near it); should be resolved by the same fix above
  - Verified the Today/Tomorrow filter's date logic directly against the data — it's correct (today, 24 Aug, does have a match: Fulham vs Chelsea). If you see "no matches" again, it likely means whatever day you're testing on genuinely has no PL fixture (there are real gaps between gameweeks) — worth double-checking the date when it happens
- **Login page**: PL banner now on the left, login card on the right, side-by-side (wraps to stacked automatically on narrow/mobile screens so nothing overlaps)
- **Table tab**: removed the instructional note per your request, dropped the MP column and tightened padding/font so both tables fit side-by-side without cutting off columns
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
