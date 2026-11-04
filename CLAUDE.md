# Instructions for Claude

## Score updates
- Match results live in the results object in `index.html` (e.g. `'M55': { home: 0, away: 1 }, // Home 0-1 Away`), keyed by the fixture IDs in the fixtures list.
- When given new scores: add them, commit, push, open a PR, and **merge it yourself (squash) once checks pass**. Do not ask the user for permission to merge score-update PRs.
