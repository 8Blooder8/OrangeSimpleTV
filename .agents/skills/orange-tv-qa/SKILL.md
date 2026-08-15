---
name: orange-tv-qa
description: Verify OrangeSimpleTV channel discovery, channel activation and player-state behavior using deterministic tests first and real browser state transitions when needed.
---

# OrangeSimpleTV QA

Use this skill after changing Orange DOM selectors, channel activation, player detection, fullscreen cleanup, navigation or remote-control behavior.

## Non-negotiable order

1. Read `AGENTS.md` and `docs/HARNESS.md`.
2. If a Graphify graph is available, query the relevant flow before broad source reading.
3. Run `./tools/quality-gate.ps1` before browser exploration.
4. Use sanitized fixtures before live Orange.
5. A click/tap command returning success is not evidence. Verify a state change after every action.

## Fixture QA

Validate these states against `tests/fixtures/` and `tests/run_dom_tests.py`:

- `/channels` discovers channel cards from `data-testid="Channel-ChannelWrapper"`;
- exact/normalized channel selection resolves the intended card;
- activation target is inside the card's actionable visual area;
- native tap, DOM-event and React-handler fallbacks remain distinguishable in diagnostics;
- player is not considered open merely because a `<video>` exists;
- successful player state requires `player-container mode="expanded"` and `#video-player`;
- clean-player mode does not replace Orange playback or extract DRM material.

## Browser QA

When browser operation is needed, use the maintained `agent-browser` skill/tools. Follow snapshot → action → snapshot:

1. capture initial URL, visible text and relevant DOM state;
2. identify the intended element by stable semantic attributes, not pixel guessing;
3. perform one action;
4. capture state again;
5. call it successful only if the expected URL/DOM/player state changed.

If an action does nothing, report the exact target, event strategy and before/after state instead of adding more heuristics immediately.

## Live Orange safety

Live mode is allowed only with an already-authenticated user session and explicit local invocation.

Never:

- ask for, print, export, store or commit the Orange password;
- read/export cookies, localStorage tokens, Authorization headers or session secrets;
- save raw authenticated Orange HTML to the repository;
- inspect/extract Widevine keys, licenses, PSSH, MPD/M3U8 URLs for bypass purposes;
- modify subscriptions/account settings.

Screenshots/logs from live mode must be treated as temporary diagnostic data and must not be committed unless sanitized.

## Completion criteria

A QA pass should end with a compact matrix containing:

- discovery result;
- selected channel/card;
- activation strategy used;
- player mode before/after;
- video presence/playing state;
- exact failing step if not successful.
