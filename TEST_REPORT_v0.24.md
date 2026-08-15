# Test report v0.24

Lokalnie przeszły: `tools/test_local.sh`, Java typecheck against Android stubs, v0.24 fast-switch/local-logo diagnostics contract, v0.17 tune state model (10 scenariuszy), v0.23 close-before-tune model, v0.20 UI contract, v0.22 metadata sweep, real DOM snapshots, runtime trace contract oraz `node --check` dla `orange_bridge.js`.

Nowe regresje sprawdzają: 155 lokalnych PNG + 155 rekordów katalogu, preload lokalnych assetów, brak matte-normalization w local-logo hot path, akceptację nowego playera po potwierdzonym `OLD_PLAYER_CLOSED`, krótsze bounded pollingi, brak blokowania przez `playerUiState().allHidden`, bounded live correction, eksport diagnostyki do Download oraz obowiązkową kontrolę 155 logo we finalnym APK.

Protected playback i realny A → B nadal wymagają testu na fizycznym DIW377.