# Test report v0.25

Lokalnie przeszły:

- `tests/verify_source.py`,
- `tests/test_java_typecheck.py`,
- `tests/test_bridge_playwright.py`,
- `tests/test_login_race_playwright.py`,
- `tests/test_tune_state_model.py` — 10 scenariuszy,
- `tests/test_v018_fast_switch_model.py`,
- `tests/test_v020_ui_contract.py`,
- `tests/test_v022_switch_ui_diagnostics.py`,
- `tests/test_v023_local_catalog_switch_contract.py`,
- `tests/test_v024_fast_switch_local_logo_diagnostics.py`,
- `tests/test_v024_windows_asset_packaging.py`,
- `tests/test_v025_identity_switch_epg.py`,
- `tests/test_v022_metadata_sweep_playwright.py`,
- `tests/run_dom_tests.py`,
- `tests/test_runtime_trace_contract.py`,
- `node --check app/src/main/assets/orange_bridge.js`,
- pełny `tools/test_local.sh`.

Nowe regresje v0.25 sprawdzają brak fallbacku logo po numerze, collision-free numbering, nowy cache v4, protected-media currentTime gate, post-commit live-edge oraz sekwencyjny hover EPG.

Chroniony playback i realny switch Widevine wymagają testu na fizycznym DIW377.