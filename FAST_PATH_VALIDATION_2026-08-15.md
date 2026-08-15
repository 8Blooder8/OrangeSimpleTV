# v0.17 fast-path validation — 2026-08-15

Validated against the 10-minute fast-path specification.

## Confirmed v0.16 failure mechanism

The v0.16 tune failure path could become visually terminal without becoming logically terminal: delayed `evaluateJavascript()` / page callbacks could continue recovery while `pendingChannelIndex` remained active. Channel activation and media startup were also insufficiently separated, so DOM churn could lead back toward channel activation.

## v0.17 controls

- one monotonic `tuneSessionId` owns each tune attempt;
- stale callbacks are ignored;
- terminal failure invalidates the tune before final diagnostics are requested;
- `channelActivated` prevents re-clicking the tile after Orange has created its player;
- one hard tune deadline bounds the whole attempt;
- UA recovery is restricted to pre-player site compatibility failures;
- native Widevine probe separates UUID support, MP4 support, constructor success, `UnsupportedSchemeException`, plugin properties and probe errors;
- API-25 WebView diagnostics record the real default UA and PackageManager provider candidates rather than pretending a spoofed Chrome version is the engine;
- WebView EME diagnostics record accepted/rejected configurations instead of one `WV=rejected` bit;
- media diagnosis is observe-only: no direct `video.play()`, `video.load()`, `src` or MediaKeys mutation;
- terminal failures write a sanitized per-session JSON report.

## Local validation

Passed in the local source package:

- `tests/test_tune_state_model.py` — 10 deterministic session/retry scenarios;
- `tests/verify_source.py` — bounded sessions, classified DRM/EME, observe-only media;
- `tests/test_java_typecheck.py` — Android API stub type-check;
- `node --check app/src/main/assets/orange_bridge.js`;
- `tests/run_dom_tests.py` — saved DOM/player regressions;
- `tools/test_local.sh` fast regression set.

The physical DIW377 remains the source of truth for OEM WebView/Widevine availability, Orange production DRM/license behavior and protected video rendering.