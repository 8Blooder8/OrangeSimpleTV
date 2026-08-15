# Test report v0.20

Lokalnie przeszły:

- `tests/verify_source.py` — invariants v0.20: reference guide, eager logo/EPG, BlueStacks keyboard, warm switch,
- `tests/test_java_typecheck.py` — `MainActivity.java` type-check z Android API stubs,
- JavaScript syntax check (`node --check app/src/main/assets/orange_bridge.js`),
- regresja prawdziwego przycisku Play / source-safe media / non-invasive player,
- login disabled → enabled → authenticated SPA race,
- deterministyczny model `tuneSessionId` — 10 scenariuszy,
- model v0.18 warm channel switch,
- `tests/test_v020_ui_contract.py` — layout/EPG/logo prefetch/keyboard/overlay contract,
- saved Orange DOM snapshot regressions + rendered-frame gate,
- sanitized runtime diagnostic contract.

v0.20 UI contract sprawdza m.in.:

1. godziny/opis/remaining/progress w modelu guide,
2. brak dolnej legendy (`Program TV`, `Ulubione`, `Szukaj`),
3. eager logo discovery przez MutationObserver + prime sweep,
4. natywny cache/waiters zamiast scroll-triggered ImageView load,
5. PageDown=CH+, PageUp=CH−, Esc/Backspace, Space,
6. overlay BACK bez zatrzymania, resize lub ukrycia WebView/playera,
7. lokalną matematykę postępu programu.

Dodatkowa inspekcja zapisanego HTML Orange potwierdziła strukturę uzasadniającą eager sweep: pełna lista kart i nazw programów jest dostępna, natomiast elementy obrazów są montowane głównie dla aktualnego viewportu.

Nie wykonano testu chronionego playbacku na fizycznym DIW377 w środowisku lokalnym. Rzeczywisty Widevine, OEM WebView, licencja Orange i protected video surface pozostają do weryfikacji na urządzeniu.
