# Test report v0.22

Lokalnie przeszły:

- `tests/verify_source.py`,
- `tests/test_java_typecheck.py`,
- `tests/test_v022_switch_ui_diagnostics.py`,
- `tests/test_v022_metadata_sweep_playwright.py`,
- `tests/test_v020_ui_contract.py`,
- `tests/test_tune_state_model.py` — 10 scenariuszy sesji,
- `tests/test_v018_fast_switch_model.py`,
- `tests/run_dom_tests.py`,
- `tests/test_runtime_trace_contract.py`,
- `node --check app/src/main/assets/orange_bridge.js`,
- pełny `tools/test_local.sh`.

Nowe regresje sprawdzają:

1. transient hover sweep zbiera `Channel-ProgramTime` i logo bez ręcznego scrollowania,
2. top chrome Orange jest ukryty razem z Search/Settings i reaguje na ponowne mounty Reacta,
3. stary minimized player nie może zostać przyjęty po samym timeoutcie jako nowy kanał,
4. `currentChannelIndex` jest commitowany dopiero po potwierdzonym PLAYING,
5. warm-switch failure uruchamia ograniczony rollback do poprzedniego kanału,
6. karta `OK` zawiera aktualny zegar,
7. numeric input ma pomarańczowy overlay,
8. tworzone są `ostv-guide-latest.json`, `ostv-switch-latest.json` i trwały `ostv-switch-last-failure.json`.

Chroniony playback i realny handoff Widevine wymagają testu na fizycznym DIW377.