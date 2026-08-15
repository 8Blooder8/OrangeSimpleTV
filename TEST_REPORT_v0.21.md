# Test report v0.21

Końcowy zestaw lokalny obejmuje:

- `tests/test_java_typecheck.py` — MainActivity z Android API stubs,
- `tests/test_v021_epg_enrichment.py` — EPG przed kliknięciem kanału,
- `tests/test_v021_source_contract.py` — readiness/cache/BlueStacks/resource safety,
- `tests/test_v020_ui_contract.py` — referencyjny layout i klawiatura,
- `tests/test_tune_state_model.py` — 10 scenariuszy tuneSessionId,
- `tests/test_v018_fast_switch_model.py` — warm switch,
- `tests/test_runtime_trace_contract.py`,
- `tests/run_dom_tests.py`,
- `tests/verify_source.py`,
- `node --check app/src/main/assets/orange_bridge.js`,
- pełny `tools/test_local.sh`.

## Nowe regresje v0.21

1. Kafelek CNN ma tylko nazwę programu, natomiast `start/end/description` są w React props. Guide musi dostać je bez kliknięcia kanału.
2. EPG znajduje się w nadrzędnym React store, a nie na hoście kafelka. Globalny store scan musi je odnaleźć.
3. `Szansa na sukces. Opole 2026 2` ma zostać poprawnie dopasowana do wariantu z suffixem `odc. 5`.
4. `beginEpgDiscovery()` uruchomione przed zamontowaniem kart nie może ogłosić pustego discovery jako zakończonego.
5. Fresh guide wymaga `epgDone && epgComplete`; samo zakończenie skanera nie wystarcza.
6. Pełny harvest logo wymaga URL dla wszystkich kart przed normalnym sukcesem discovery; nadal działa twardy timeout.
7. Resource fallback nie replayuje ogólnych `/live/channel`/stream/DRM endpoints.
8. Cache ma nowy klucz `channel_cache_v2` i timeout refreshu nie powinien usuwać poprawnych danych z istniejącego cache.
9. BlueStacks detection uwzględnia x86/x86_64, dodatkowe system properties oraz guest/shared-folder markers.

## Wynik

Wszystkie wymienione testy lokalne przechodzą. Java zgłasza jedynie istniejącą informację o użyciu deprecated Android API; nie jest to błąd kompilacji testowej.

Nie wykonano lokalnego testu chronionego playbacku na fizycznym DIW377. Widevine OEM, rzeczywisty provider WebView, licencja Orange i protected video surface pozostają do sprawdzenia na urządzeniu.
