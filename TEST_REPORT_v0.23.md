# Test report v0.23

## Lokalna walidacja

Pełny `tools/test_local.sh` zakończył się sukcesem.

Przeszły:

- `tests/verify_source.py`,
- `tests/test_java_typecheck.py`,
- source-safe channel activation / first-frame gate,
- login race regression,
- v0.17 tune state model — 10 scenariuszy,
- v0.23 close-before-tune deterministic switch model,
- v0.20 reference UI/input contract,
- v0.22 chrome/diagnostics contract,
- `tests/test_v023_local_catalog_switch_contract.py`,
- transient hover EPG/logo sweep na snapshotach DOM,
- real-snapshot DOM tests,
- sanitized runtime trace contract,
- składnia `orange_bridge.js` w pełnym lokalnym runnerze.

## Nowe regresje v0.23

1. Normalny logo path korzysta z `asset:channel_logos/...` i nie wywołuje network logo downloadera.
2. Katalog zawiera 155 lokalnych logotypów i canonical mapping.
3. Numery kanałów są oddzielone od discovery array index.
4. Metadata refresh scala rekordy po identity, a nie pozycyjnie.
5. Wybór aktualnie oglądanego kanału w BACK guide tylko ukrywa guide.
6. Switch A -> B używa close starego playera, nigdy expanded-to-mini/background.
7. State machine czeka na fizyczne odmontowanie starego player-container przed aktywacją B.
8. Stary/background player nie może zostać zaakceptowany jako target po samym timeoutcie.
9. Target wymaga identity + expanded + real rendered frame.
10. Failure ma ograniczony rollback do ostatniego stabilnego kanału.
11. Top chrome i player chrome Orange są suppressowane od bootstrapu bridge oraz po remountach Reacta.
12. Loading cover nie jest zdejmowany przed ukryciem player chrome.
13. Live edge korzysta z `seekable.end/currentTime` i oficjalnego `IconPlayerLive`, bez bezpośredniego seekowania video.
14. Switch diagnostics zawiera event trace; guide diagnostics zawiera stabilne numery i local logo mapping.
15. `OK` clock oraz pomarańczowy numeric entry z v0.22 pozostają aktywne.

## Ograniczenie walidacji

Nie wykonano lokalnego testu chronionego playbacku ani rzeczywistego handoffu Widevine na DIW377. Te elementy wymagają testu właściciela na fizycznym dekoderze. Po teście należy zachować i odesłać pliki z `ostv-diagnostics`, szczególnie `ostv-switch-last-failure.json`, jeśli wystąpi problem.