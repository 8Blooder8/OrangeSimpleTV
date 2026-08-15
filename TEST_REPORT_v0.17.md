# Test report v0.17

Locally passed:

- Java source type-check against Android API stubs, including API-25-compatible DRM/provider calls,
- JavaScript syntax check,
- source invariants for tune-session ownership, terminal state and observe-only media behavior,
- deterministic tune-state model: 10 regression scenarios,
- two-phase channel activation / real Play target regression,
- background → expanded player regression,
- login disabled-submit race,
- rendered-frame gate,
- non-invasive clean-player behavior,
- sanitized successful runtime-trace contract,
- real-snapshot DOM fixtures.

The deterministic state model covers:

1. immediate playback,
2. terminal Widevine rejection without a loop,
3. no channel re-click after player activation,
4. stale callback from an older tune,
5. page/reload callback preserving one session,
6. DOM churn after activation not returning to site recovery,
7. hard deadline,
8. no UA retry for native-Widevine-false + EME reject,
9. distinct native-Widevine-true + WebView-EME-reject classification,
10. delayed playback before deadline.

Not reproducible locally without the physical DIW377: actual OEM WebView provider selection, OEM Widevine CDM/provisioning/security path, Orange production DRM/license session and protected decoder/HDCP/compositor path. v0.17 is designed to emit those device-only facts in one JSON rather than hiding them behind repeated recovery.
