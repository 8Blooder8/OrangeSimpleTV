# Test report v0.18

Passed locally:

- Java source type-check against Android API stubs,
- JavaScript syntax check,
- two-phase channel activation / real Play target regression,
- login disabled-submit race regression,
- real saved DOM/player snapshot regression,
- rendered-frame success gate,
- sanitized runtime diagnostic contract,
- v0.17 bounded tune-session model (10 scenarios),
- v0.18 warm switch model: no `/channels` reload when cards remain, old background player is not accepted as the new channel, bounded fallback when channel DOM is absent,
- source invariants for EPG/logo list, lazy EME diagnostics, one bridge injection per document, CH direction and simple loading UI.

The exact speed-up still requires physical DIW377 validation because Orange CDN/DRM/license latency and OEM WebView scheduling cannot be reproduced locally.
