# Orange Simple TV v0.17

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod Sagemcom Orange 4K Multi (DIW377).

## v0.17

Ta gałąź przebudowuje strojenie kanału wokół jednej sesji `tuneSessionId` i rozdziela aktywację kanału od uruchomienia mediów.

- stare callbacki JS/page lifecycle są ignorowane po zmianie sesji,
- błąd terminalny naprawdę zatrzymuje automat strojenia,
- po wykryciu playera Orange kanał nie jest ponownie klikany,
- brak ogólnego „recovery wszystkiego”: UA jest używany tylko przed aktywacją playera, gdy problem może dotyczyć zgodności strony,
- Widevine jest sprawdzany niezależnie po stronie Android `MediaDrm` i WebView EME,
- EME jest diagnozowane macierzą codec/robustness zamiast pojedynczego `WV=rejected`,
- podczas diagnozy aplikacja nie wywołuje bezpośrednio `video.play()`, `video.load()`, nie podmienia `src` ani MediaKeys,
- terminalna awaria zapisuje pełny, sanitizowany JSON diagnostyczny,
- szybki build bez Gradle pozostaje: AAPT2 → javac → D8 → zipalign → apksigner.

Pełna paczka źródłowa v0.17 jest budowana/testowana lokalnie; ta gałąź przechowuje dokumentację i kluczowe zmiany diagnostyczne. Nie commitujemy zapisanych HTML-i Orange, cookies, tokenów ani danych sesji.
