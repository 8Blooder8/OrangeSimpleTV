# Orange Simple TV v0.24

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377.

## v0.24 — Windows assets packaging fix

Fizyczny build na Windows Build-Tools 36 wykazał, że poleganie na `AAPT2 link -A` dla zagnieżdżonego `assets/channel_logos` nie dawało finalnego APK z katalogiem pod ścieżką oczekiwaną przez aplikację. Build zatrzymywał się na `APK nie zawiera lokalnego katalogu logo.`

Poprawiona paczka źródłowa:

- `AAPT2 link` zajmuje się wyłącznie zasobami `res/` i manifestem,
- cały katalog `app/src/main/assets` jest dodawany do roboczego APK później przez JDK `jar`,
- przed `zipalign` sprawdzane są `assets/orange_bridge.js`, `assets/channel_logos/catalog.json` i dokładnie 155 `logo_###.png`,
- identyczna kontrola jest wykonywana po podpisaniu finalnego APK,
- zmiany samych assets nie invalidują kosztownego AAPT2 link cache,
- logika aplikacji v0.24, playback, DRM i switch pozostają bez zmian w tym build-fixie.

## Główne zmiany aplikacji v0.24

- szybszy post-close switch bez czekania na zmianę blob/logo/label po potwierdzonym zamknięciu starego playera,
- rendered-frame stability skrócone do 80 ms,
- bounded live-edge correction,
- player chrome Orange suppressowany przez CSS + MutationObserver,
- 155 lokalnych logo predekodowanych w tle,
- diagnostyka eksportowana także do `Download/OrangeSimpleTV-diagnostics/`.

Szczegóły: `V0.24_FAST_SWITCH_LOGO_DIAGNOSTICS.md`, `V0.24_WINDOWS_ASSET_PACKAGING_FIX.md` i raporty testów.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.24-fixed
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Podczas kroku 5 powinno pojawić się:

```text
assets OK: 155/155 logo
```

Po podpisaniu:

```text
[verify] Local logos in APK: 155/155
```

Wynik: `C:\OrangeSimpleTV-v0.24-fixed\out\OrangeSimpleTV.apk`.

Playback, DRM/Widevine, MSE/EME i źródło streamu pozostają własnością oficjalnego playera Orange. v0.24 nie podmienia `video.src`, MediaKeys ani nie implementuje własnego DRM.