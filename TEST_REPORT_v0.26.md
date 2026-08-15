# TEST REPORT — v0.26

Zmiany bazują na realnych raportach v0.25 z Orange PL DIW377 (Android 14 / WebView 150), nie na lokalnym protected playbacku.

Przeszły lokalnie m.in.:

- `verify_source.py`
- Java typecheck
- Playwright bridge/login
- 10 scenariuszy tune-state
- close-before-switch model
- UI/input contract
- local catalog/logo/numbering contracts
- Windows nested-assets packaging contract
- v0.25 identity/protected-playback/EPG contract
- nowy `test_v026_runtime_log_regressions.py`
- metadata hover sweep Playwright
- real Orange DOM snapshot tests
- runtime diagnostic contract
- v0.21 EPG/source contracts
- `node --check orange_bridge.js`

Nowa regresja v0.26 blokuje powrót dwóch raw-semicolon expressions w `evalBridge`, wymaga identity merge dla discovery, wymaga dalszego hover sweep po remouncie/błędzie kafelka oraz sprawdza liniowy model skanowania EPG (`WeakSet` + cursor).

Protected playback na fizycznym DIW377 nie został wykonany lokalnie i wymaga ponownego testu na dekoderze.