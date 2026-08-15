# Orange Simple TV v0.19

## v0.19 — guide overlay + performance

- nowy interfejs TV: lista po lewej, duży placeholder/podgląd i karta programu po prawej, bez dolnej legendy,
- po BACK z działającego kanału lista otwiera się wyłącznie jako boczny overlay; video dalej działa pełnoekranowo i nie jest resizeowane,
- OK podczas oglądania pokazuje własną kartę kanału/programu,
- emulator automatycznie używa pełnoekranowego placeholdera video, więc cały UX można testować bez Widevine,
- loga nie mają ciemnego prostokątnego tła,
- metadane kanałów są cacheowane i pojawiają się natychmiast przy kolejnym wejściu, po czym są odświeżane w tle,
- loga mają cache RAM + dyskowy i 6 równoległych workerów,
- aktualny kanał i pierwsze 24 loga mają priorytet, reszta jest prefetchowana chwilę później,
- zachowany jest v0.18 warm switch bez przeładowania `/channels`,
- skrócony jest reveal Play i fallback rozpoznawania nowego playera,
- techniczne stany DRM/WebView pozostają poza normalnym UI.

Playback/DRM pozostaje własnością oficjalnego playera Orange.

Szybki build bez Gradle pozostaje: AAPT2 → javac → D8 → zipalign → apksigner.
