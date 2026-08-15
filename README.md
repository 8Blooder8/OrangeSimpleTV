# Orange Simple TV v0.18

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod Sagemcom Orange 4K Multi (DIW377).

## v0.18 — TV UI + szybkie przełączanie

- lista kanałów pokazuje numer, logo, nazwę i aktualny program,
- `CH+` wybiera następny kanał w dół listy, `CH-` poprzedni w górę,
- normalna zmiana kanału nie przeładowuje całej strony `/channels`, jeśli Orange nadal ma listę kanałów w DOM,
- istniejący player jest sprowadzany do trybu background i następny kanał jest aktywowany w tej samej, rozgrzanej instancji WebView,
- bridge JS jest instalowany raz na dokument zamiast przy każdym pollu strojenia,
- ciężka macierz EME/Widevine jest lazy i uruchamia się dopiero przy realnym zastoju mediów,
- potwierdzenie renderowania po pierwszej rzeczywistej klatce skrócono z 650 ms do 120 ms,
- na czystej instalacji pomijany jest zbędny session probe `/channels`, a formularz logowania jest preładowywany w tle,
- discovery kanałów nie ma sztucznego minimum 1,8 s,
- podczas strojenia użytkownik widzi tylko szare tło, spinner i `Ładowanie…`, bez technicznych etapów WebView/DRM,
- obraz nowego kanału jest odsłaniany dopiero po potwierdzonym renderze,
- diagnostyka v0.17 pozostaje dostępna poza hot-pathem.

Playback pozostaje po stronie oficjalnego playera Orange/WebView. Nie implementujemy własnego DRM ani nie podmieniamy `src`/MediaKeys.

Szybki build bez Gradle pozostaje: AAPT2 → javac → D8 → zipalign → apksigner.
