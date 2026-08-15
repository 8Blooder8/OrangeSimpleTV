# Orange Simple TV v0.20

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod Sagemcom Orange 4K Multi (DIW377), z pełnym trybem podglądu UI na emulatorze/BlueStacks.

## v0.20 — reference UI + eager EPG/logo prefetch

Ta wersja koncentruje się na interfejsie TV odwzorowanym według referencyjnego ekranu oraz usunięciu opóźnień widocznych przy otwieraniu listy kanałów.

### Interfejs

- ekran `Kanały`: lista po lewej, duży podgląd po prawej i karta bieżącego programu pod podglądem,
- bez dolnej legendy, kolorowych skrótów, Wi‑Fi i ustawień,
- każdy wiersz zawiera numer kanału, logo, nazwę, aktualny program, godziny i lokalnie aktualizowany pasek postępu,
- zaznaczenie kanału używa ciemnego gradientu i cienkiej pomarańczowej ramki,
- prawa karta pokazuje logo, numer/nazwę kanału, program, godziny, progress, opis (jeżeli Orange go udostępnia), aktualną godzinę i czas do końca,
- `BACK` podczas oglądania nakłada wyłącznie lewy panel kanałów nad pełnoekranowym playerem — bez zmiany geometrii, rozdzielczości lub stanu video,
- `OK` podczas oglądania pokazuje własną kartę programu zamiast interfejsu Orange.

### Eager logo/EPG i cache

- bridge zbiera `src`, `currentSrc`, `srcset`, `data-src`, `data-srcset`, `picture/source` i `background-image`,
- `MutationObserver` zapamiętuje URL logo, gdy React zamontuje obraz,
- brakujące kafelki są krótko aktywowane w ukrytym sweepie, po czym pozycja strony jest przywracana,
- loga mają cache RAM + dyskowy i są prefetchowane przez ograniczony pool 6 workerów,
- wiersze czekające na bitmapę są aktualizowane bez aktywnego pollingu,
- lista/EPG działa stale-while-revalidate: cache jest rysowany natychmiast, a świeże dane podmieniane w tle,
- progress i czas do końca są aktualizowane lokalnie co 30 sekund bez ponownego pobierania EPG.

### Performance

- bridge JavaScript jest instalowany raz na dokument,
- normalny `CH+`/`CH-` zachowuje rozgrzany WebView i nie wykonuje reloadu `/channels`,
- pełna diagnostyka EME/Widevine nie działa w normalnym hot-path,
- pobieranie/dekodowanie logo i operacje cache nie blokują UI thread,
- focus listy korzysta z danych już obecnych w pamięci.

### BlueStacks / emulator

Brak Widevine nie blokuje testów interfejsu. W wykrytym emulatorze kanał jest reprezentowany pełnoekranowym placeholderem, a cały flow UI działa jak na telewizorze.

Klawiatura:

- `↑` / `↓` — focus kanału,
- `Enter` — OK,
- `Esc` lub `Backspace` — BACK,
- `Page Down` — CH+ (następny kanał w dół),
- `Page Up` — CH− (poprzedni kanał w górę),
- `Space` — Play/Pause,
- `0–9` — numer kanału,
- `Home` / `End` — pierwszy / ostatni kanał.

Playback, DRM, MSE/EME i źródło streamu pozostają własnością oficjalnego playera Orange. v0.20 nie podmienia `src`, MediaKeys ani nie implementuje własnego Widevine.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.20
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Wynik: `C:\OrangeSimpleTV-v0.20\out\OrangeSimpleTV.apk`.

Build pozostaje bez Gradle: AAPT2 → javac → D8 → zipalign → apksigner.
