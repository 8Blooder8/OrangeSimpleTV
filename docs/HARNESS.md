# OrangeSimpleTV Harness

This repository is optimized for short, repeatable agent iterations. The harness is deliberately split into a fast deterministic path and optional deeper agent/security passes.

## Fast path — required for every code change

1. Use Graphify to narrow the affected flow when `graphify-out/graph.json` is available.
2. Change the smallest possible surface.
3. Run `./tools/quality-gate.ps1`.
4. Fix the regression before adding broader heuristics.
5. Update Graphify incrementally with `./tools/graphify-update.ps1` when the code graph is present.

The fast path must stay local, deterministic and cheap. It must not invoke an LLM, build an APK, or contact Orange.

## Mechanical invariants

`tests/test_invariants.py` encodes rules that must not regress silently:

- channel list route is `/channels`, never the obsolete `/live/channels`;
- channels are discovered from `[data-testid="Channel-ChannelWrapper"]`;
- player shell is `[data-testid="player-container"]`;
- an active player requires `mode="expanded"`;
- playback video is `#video-player`;
- real DOM fixtures must not contain obvious session tokens, Cookie/Set-Cookie headers or committed credentials;
- official Orange playback remains inside the Orange WebView/EME path; no DRM extraction/circumvention is introduced.

When a real DIW377 failure reveals a new stable fact, add a focused fixture/test/invariant before or together with the fix.

## UI QA — Open Interpreter

Open Interpreter is an optional local QA harness, not an APK dependency. Bootstrap once with:

```powershell
.\tools\openinterpreter-bootstrap.ps1
```

Then run a verification-only agent pass:

```powershell
.\tools\openinterpreter-qa.ps1
```

The project skill at `.agents/skills/orange-tv-qa/SKILL.md` requires snapshot → action → snapshot verification. A reported click is not success until the visible/DOM state changes as expected.

Live Orange QA is opt-in:

```powershell
.\tools\openinterpreter-qa.ps1 -Live
```

Live mode may use an already-authenticated session, but must never print, export, commit or inspect cookies, passwords, tokens or Widevine material.

## Security — DeepSec

DeepSec is development tooling only. The default integration runs the local pattern scanner, which does not call an AI model:

```powershell
.\tools\deepsec-scan.ps1
```

The first run scaffolds `.deepsec/` locally and installs its workspace dependencies; later scans reuse that workspace and package cache.

GitHub Actions runs the free pattern scan on pull requests and manual dispatch only, so normal push iterations are not slowed down.

AI-backed DeepSec `process`/`revalidate` is intentionally not automatic because it can incur model cost. Run it manually only when explicitly desired and after reviewing the current `.deepsec` configuration.

## Source of truth / entropy control

- `AGENTS.md` is the short navigation and policy entry point.
- `docs/HARNESS.md` explains the feedback loop.
- Tests and CI enforce stable facts mechanically.
- Sanitized fixtures capture only the DOM needed for a regression.
- Never commit private Orange session exports.
- Prefer a small explicit selector/state rule over a growing chain of guesses.
