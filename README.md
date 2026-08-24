# GWA Premier League 2026-27 — Setup

This is the Premier League version of the WC26 prediction league, sharing your
existing `gwa-worldcup` Firebase project (data is isolated in `pl_`-prefixed
Firestore collections, so it will never touch or overwrite your World Cup data).

## What's included
- `index.html`, `style.css`, `firebase-config.js` — the site
- `gwa-logo.png`, `gwa-logo-dark.png` — same GWA branding assets as WC26
- `pl-logo.png`, `pl-trophy.png` — Premier League crest and trophy images (yours), shown on the login screen and in the header
- **Premier League color theme**: deep purple/magenta (`#38003C` / `#E90052`)
  replacing the World Cup gold/navy theme, including the login screen
  background (the old background video was WC26-specific footage I don't
  have rights to reuse, so it's now a purple gradient instead)
- Real fixtures for **Gameweeks 1–9** (Aug 21 – Nov 2, 2026), pulled from the
  official Premier League/FPL fixture list, with kickoff times converted to
  UAE time and real stadium names
- **GW1 matches that were already played before this league launched are
  included with their real scores, but explicitly excluded from prediction
  scoring** — nobody had a chance to predict them, so no player earns or
  loses points for them (they still count toward the real League Table,
  since that reflects actual football results). This is a `NO_SCORE_MATCHES`
  set in the code — if you want to open more matches up the same way later,
  add their IDs there.
- The knockout-stage system has been fully removed (Premier League has no
  bracket) — the Groups tab is now a single 20-team League Table (top 4
  highlighted for Champions League qualification, bottom 3 for relegation)
- No API key needed: matches are static data you update by hand, exactly like
  WC26's `MANUAL_RESULTS`
- Verified: the entire script passes a clean JS syntax check, no dangling
  references to removed World Cup functionality (knockout tab, flags, group
  lettering)

## Deploy

Your repo already exists at github.com/kmahmoudarda-art/gwa-premier-league —
just upload these 8 files to it:

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
