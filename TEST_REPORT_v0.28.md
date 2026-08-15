# Test report v0.28

`tools/test_local.sh` passes after the v0.28 changes.

Coverage includes Java type-check, bridge Playwright tests, login race, tune model, close-before-tune model, UI/EPG contracts, local asset packaging, v0.25 identity/protected-playback regressions, v0.26 DIW377 runtime regression, v0.27 exact-X close and target identity, and the new v0.28 warm-switch recovery/immutable diagnostic contract.

No physical DIW377 playback test was performed in the assistant environment. Physical verification remains the decoder run.
