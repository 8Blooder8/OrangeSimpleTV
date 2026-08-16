# TEST REPORT — Orange Simple TV v0.29

## Zakres

Zmiana v0.29 powstała z realnego logu DIW377, w którym `Kino Polska HD` nie tworzył playera mimo poprawnego Play i reloadu.

## Weryfikacja lokalna

- `MainActivity.java` type-check przeciw Android API stubs: PASS
- `node --check app/src/main/assets/orange_bridge.js`: PASS
- Playwright: `before-hover` DOM snapshot: PASS
- Playwright: prawdziwy `IconPlayerPlay` w `post-hover-play-mounted`: PASS
- Playwright: widoczny alert trafia do `visibleMessages`: PASS
- kontrakt: `activationDiagnostics`, `activationNetwork`, `sanitizedWebDiagnostics`: PASS
- kontrakt: jeden reload + jedna finalna próba Play: PASS
- kontrakt: terminalny `CHANNEL_PLAYER_NOT_CREATED`: PASS
- kontrakt: po fallbacku brak starej UA/cache recovery ladder dla `cards=0`: PASS
- historyczne testy tune/switch/EPG/logo/Windows asset packaging: PASS

## Ograniczenia

Środowisko asystenta nie ma fizycznego DIW377 ani produkcyjnej sesji Orange/Widevine, więc nie ma deklaracji fizycznego playbacku v0.29. Pełny AAPT2/D8/apksigner build nadal wykonuje użytkownik na Windows przez `build_windows.ps1`.

`PerformanceResourceTiming.responseStatus` może być `0`, jeśli engine/polityka strony nie udostępnia statusu danego zasobu. HTTP >= 400 z WebView jest równolegle zapisywane w `activationNetwork` jako `HTTP_ERROR`.
