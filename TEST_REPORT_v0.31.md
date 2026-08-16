# TEST REPORT v0.31

Lokalny zestaw testów przeszedł w całości.

Zakres obejmuje:

- Java type-check przeciwko stubom Android API;
- JavaScript syntax check;
- wszystkie historyczne testy state-machine, switch, EPG, logo i Windows asset packaging;
- v0.30 adult-PIN flow;
- regresję normalizacji `m#########` -> `M#########` przed przekazaniem wartości formularzowi Orange;
- kontrakt recovery discovery -> authentication;
- ograniczenie hot discovery polling i memoizację indeksu metadanych programu.

Brak pełnego Android SDK/AAPT2/D8/apksigner w środowisku testowym, więc APK nie był tutaj budowany. Fizyczny login i protected playback v0.31 wymagają testu na DIW377.
