# Test report — v0.27

Local test suite passed:

- Java typecheck against Android API stubs,
- login race Playwright,
- v0.17 tune state model (10 scenarios),
- close-before-tune model,
- v0.20 UI/input contract,
- v0.22/v0.23/v0.24/v0.25/v0.26 regression contracts,
- new v0.27 Playwright regression with two Orange-style `ClosePlayerButtonWrapper` buttons: verifies back handler is never called and `player_close_X` handler removes the player,
- new target identity contract: Cartoon Network action reports Cartoon Network, never Music Box Dance,
- tune-priority / lightweight-success-diagnostics source contract,
- real/sanitized Orange DOM snapshot tests,
- `node --check app/src/main/assets/orange_bridge.js`.

Protected playback and switching still require physical DIW377 validation.