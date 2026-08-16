# TEST REPORT — v0.30

## Wynik lokalny

`tools/test_local.sh`: PASS.

Przeszły m.in.:

- Java typecheck na stubach Android API,
- login race: controlled inputs → enabled submit → authenticated SPA,
- 10 scenariuszy tune state machine,
- close-before-tune i exact-X close,
- identity-only logo mapping / unique numbering,
- protected playback rendered-frame gate,
- Windows nested assets contract 155/155,
- v0.26 runtime regressions,
- v0.27 switch close/identity/priority,
- v0.28 reload fallback + immutable diagnostics,
- v0.29 bounded failure diagnostics,
- v0.30 auto-login + adult PIN + lightweight tuning hot path,
- adult PIN: pojedyncze pole + przycisk potwierdzenia,
- adult PIN: ekranowa klawiatura 0–9,
- `node --check app/src/main/assets/orange_bridge.js`.

## Czego test lokalny nie dowodzi

Nie wykonano fizycznego odtworzenia chronionego kanału na DIW377 w środowisku autora patcha. Test końcowy powinien potwierdzić na dekoderze:

1. start bez ręcznego wpisywania loginu,
2. automatyczny PIN na programie wymagającym kodu,
3. Kino Polska HD → odblokowanie → player,
4. kilka kolejnych CH+/CH- bez regresji switchu,
5. brak wartości login/secret/PIN w JSON diagnostycznych.