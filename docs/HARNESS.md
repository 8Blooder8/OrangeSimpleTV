# OrangeSimpleTV Harness

This repository is optimized for fast, repeatable agent-assisted development.

## Required feedback loop

1. Use Graphify query-first to narrow the code path.
2. Make the smallest change that addresses the observed failure.
3. Run the fast quality gate / DOM tests.
4. Run DeepSec pattern scan for WebView/bridge/security-sensitive changes.
5. Build APK locally on the Windows development machine; do not make APK compilation a prerequisite for pure DOM/JS iteration.
6. Convert every real-device discovery into a mechanical regression test or invariant.

## Orange TV Go invariants

- The live-channel route is `/channels`; never restore `/live/channels`.
- Channels are discovered from `[data-testid="Channel-ChannelWrapper"]`.
- The first child of a channel card is its visual `TileWrapper`; channel details/text are outside that tile.
- **Channel activation is two-phase.** `TileWrapper` owns React `onMouseEnter`/`onMouseLeave`; hover causes React to mount a separate centered channel-control button asynchronously.
- Never send the tuning tap in the same step that reveals hover state. First reveal, wait for React/WebView commit, then re-query the card and resolve `[data-testid="IconPlayerPlay"]`.
- The actual tune tap must target the closest real `<button>` containing `IconPlayerPlay`, not the underlying logo/image or `Channel-ChannelWrapper` text area.
- A real captured tile was 196×140 and the Play button 40×40 with the same center; geometry may scale, so always compute `getBoundingClientRect()` at runtime rather than hard-coding pixels.
- A valid final player is Orange's official `[data-testid="player-container"]` in `mode="expanded"` with `#video-player`.
- `mode="background"` is a valid intermediate player state, never final success; when Orange exposes `IconPlayerScroll`, use its own control to reach `expanded`.
- Preserve the official WebView/EME/Widevine media path. No DRM circumvention, extracted keys, or replacement stream pipeline.

## Login invariants

- Orange's login submit can initially be disabled after values are inserted.
- Set React-controlled inputs through the native value setter and dispatch input/change events.
- Do not click a disabled submit.
- Once a submit has actually occurred, never automatically submit a second time merely because a callback/navigation event was missed.
- Treat disappearance of `login-screen-container` plus authenticated home/navigation/channel DOM as success.

## Security / corpus rules

Never commit authenticated Orange exports, cookies, tokens, credentials, keystores, APK build outputs, `.deepsec`, Graphify cache, or other private session state. Use sanitized fixtures only.

## Tooling policy

- Graphify: code understanding and path tracing; incremental updates for ordinary edits.
- Open Interpreter: local QA runner on demand, not automatic paid-model CI.
- DeepSec: free/pattern scan in PR CI; deeper AI review remains manual.
- Runtime APK must not depend on any of these development tools.
