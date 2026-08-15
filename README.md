# Orange Simple TV v0.24

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377.

## v0.24 — fast switch + local logos + accessible diagnostics

- po pozytywnym zamknięciu starego `player-container` nowy player utworzony po target tap jest uznawany za bieżącą tune session bez czekania na zmianę blob/logo/label; usuwa to przypadek „słychać nowy kanał, ale Ładowanie… kończy timeoutem”,
- close polling i target transition polling są skrócone, rendered-frame stability 120 ms → 80 ms,
- live-edge correction ma bounded okno i nie może blokować gotowego obrazu do globalnego timeoutu,
- loading nie czeka już na heurystyczne `playerUiState().allHidden`; player chrome jest suppressowany synchronicznie przez CSS + MutationObserver,
- 155 lokalnych logo jest predekodowanych w tle podczas rozgrzewania aplikacji; usunięto kosztowny pixel-by-pixel matte stripping dla tych PNG,
- mapping logo ma fallback po canonical numerze kanału,
- Windows build po podpisaniu APK sprawdza obecność `catalog.json` i dokładnie 155 `logo_###.png`,
- diagnostyka jest nadal zapisywana do app-specific external files, ale dodatkowo eksportowana do `Download/OrangeSimpleTV-diagnostics/`,
- `ostv-startup-latest.json` powstaje od razu przy starcie, a guide diagnostic zawiera `logoDecoded`/`logosDecoded`.

Szczegóły: `V0.24_FAST_SWITCH_LOGO_DIAGNOSTICS.md` i `TEST_REPORT_v0.24.md`.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.24
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Wynik: `C:\OrangeSimpleTV-v0.24\out\OrangeSimpleTV.apk`.

Playback, DRM/Widevine, MSE/EME i źródło streamu pozostają własnością oficjalnego playera Orange. v0.24 nie podmienia `video.src`, MediaKeys ani nie implementuje własnego DRM.