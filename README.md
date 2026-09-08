# GWA Champions League 2026-27 — Setup

This site has been converted from the Premier League prediction league to the
**2026-27 UEFA Champions League League Phase**, sharing your existing
`gwa-worldcup` Firebase project (data is isolated in `pl_`-prefixed Firestore
collections — untouched from the PL version, so nothing is lost).

## What changed in this conversion
- **All 36 League Phase clubs** replace the 20 Premier League clubs (colors +
  3-letter badge abbreviations for each).
- **All 144 League Phase fixtures** (Matchday 1 – 8, 8 Sept 2026 to 27 Jan
  2027) replace the old 38-gameweek PL fixture list, pulled from UEFA's
  official fixture list.
- **Kickoff times converted to UAE (GST, UTC+4)**, correctly accounting for
  the European daylight-saving change on 25 Oct 2026 (Matchdays 1-3 are
  CEST → UAE +2h; Matchdays 4-8 are CET → UAE +3h).
- **Table/standings zones** now reflect the League Phase: 1st-8th (direct to
  Round of 16, blue), 9th-24th (Knockout Play-offs, amber), 25th-36th
  (eliminated, red) — replacing the PL's top-4/relegation zones.
- **Season picks** now ask for the Top 8 (direct qualifiers) and Bottom 4
  (early exits) instead of Top 4/Bottom 3.
- `MANUAL_RESULTS` and `NO_SCORE_MATCHES` reset to empty — this league
  launches right at Matchday 1, before a ball is kicked.
- The knockout bracket (Round of 16 onward) is **not yet built** — the real
  Play-off Round draw doesn't happen until the League Phase finishes in
  January 2027, since who finishes 9th-24th isn't known yet. Once that draw
  happens, ask me and I'll wire up the bracket the same way this fixture
  list was built.
- Logos/branding images (`pl-logo.png`, `pl-banner.jpg`, `pl-trophy.png`)
  were **left as-is** — I can't generate or source UEFA's official
  trademarked Champions League branding. Swap those files for your own if
  you'd like different artwork; everything else references them by the same
  filenames.

## Deploy
Your repo already exists at github.com/kmahmoudarda-art/gwa-premier-league —
upload these files to it (this will overwrite the older versions). You may
want to rename the repo (e.g. to `gwa-champions-league`) for clarity, but
that's optional — nothing in the code depends on the repo name.

1. Go to https://github.com/kmahmoudarda-art/gwa-premier-league
2. Click **Add file → Upload files**
3. Drag in `index.html`, `style.css`, `firebase-config.js` → **Commit
   changes**
4. Your existing Cloudflare Pages project will redeploy automatically on
   push (or trigger a manual deploy from the Cloudflare dashboard)

## Keeping it updated
- **Add results**: edit `MANUAL_RESULTS` in `index.html` — add
  `'Mxx': { home: X, away: Y }` after each match.
- **Once the League Phase ends** (after Matchday 8, 27 Jan 2027): fill in
  `ACTUAL_TOP4` (the real top 8, in order) and `ACTUAL_RELEGATED` (the real
  bottom 4) to activate scoring for the season picks.
- **Knockout stage**: once the Play-off Round draw happens (Jan 2027), send
  me the draw and I'll add the bracket, matches, and kickoff times the same
  way.

## Points system (unchanged)
Exact score = 3 pts · Correct result = 1 pt · Wrong = 0 pts
