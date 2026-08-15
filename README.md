# Orange Simple TV v0.25

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377.

## v0.25 — identity-safe logos + protected playback gate + deterministic EPG sweep

Ta wersja naprawia trzy regresje wykryte na fizycznym dekoderze:

- lokalne logo jest mapowane wyłącznie po identity/nazwie kanału; usunięto fallback po numerze, który potrafił przypisać np. logo HGTV do `FILMBOX+ Emotion`,
- numeracja kanałów nie pochodzi już z pozycji w katalogu logo. Bieżący porządek Orange jest zapisywany per channelId/nazwa do nowej mapy `channel_no_v4_*`, z kontrolą kolizji; cache guide ma nowy klucz `channel_cache_v4`,
- protected playback może zostać potwierdzony przez `expanded + readyState>=2 + media source + rzeczywisty postęp currentTime`, nawet gdy OEM WebView nie zwraca `videoWidth/videoHeight` dla chronionej powierzchni,
- pełnoekranowa geometria playera ma pierwszeństwo nad chwilowo nieaktualnym atrybutem `mode=background`,
- jeżeli player jest background i kontrolka expand nie została jeszcze zamontowana, bridge niewidocznie wzbudza controls przez `mousemove` i ponawia próbę,
- live-edge check nie blokuje już zdjęcia ekranu `Ładowanie…`; wykonywany jest po potwierdzonym tune,
- harvest `Channel-ProgramTime` jest wykonywany sekwencyjnie, dokładnie jeden hovered tile naraz. Poprzednie cztery równoległe hovery dawały niepełne/losowe godziny,
- każde świeże discovery wymusza nową generację EPG/sweep zamiast używać stale zakończonego stanu poprzedniej sesji,
- Windows asset packaging fix z v0.24 pozostaje: finalny APK jest weryfikowany na obecność 155 lokalnych PNG.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.25
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Build powinien potwierdzić:

```text
assets OK: 155/155 logo
[verify] Local logos in APK: 155/155
```

Wynik: `C:\OrangeSimpleTV-v0.25\out\OrangeSimpleTV.apk`.

Playback, DRM/Widevine, MSE/EME i źródło streamu nadal pozostają własnością oficjalnego playera Orange. v0.25 nie podmienia `video.src`, MediaKeys ani nie implementuje własnego DRM.