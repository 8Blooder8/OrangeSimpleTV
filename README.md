# Orange Simple TV v0.30

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod Orange DIW377.

## v0.30 — prywatny appliance build

- automatyczne logowanie do skonfigurowanego konta Orange TV Go bez wpisywania danych pilotem,
- automatyczna obsługa oficjalnego modala kodu dorosłych: pojedyncze pole PIN, cztery osobne pola albo keypad 0–9,
- po odblokowaniu program jest kontynuowany automatycznie; jeżeli Orange wymaga ponownego Play, target jest klikany tylko raz,
- ciężka diagnostyka v0.29 została zdjęta z normalnego hot path i pozostaje na failure path,
- tune polling używa `pageStateLite()` zamiast pełnego snapshotu EME/DOM,
- pełna `emeMatrix` nie jest serializowana w każdym `VIDEO_WAIT`,
- request tracing nie buduje już JSON dla każdego zasobu,
- zachowane: exact-X close, close-before-tune, channel identity check, rendered-frame gate, EPG, lokalne logo i publiczne diagnostics.

**Uwaga:** prywatny build zawiera lokalnie skonfigurowane dane logowania/PIN, dlatego APK/source ZIP nie powinny być udostępniane osobom trzecim. Same wartości nie są publikowane w tym repozytorium.

Szczegóły: `V0.30_AUTO_LOGIN_ADULT_PIN_PERFORMANCE.md` i `TEST_REPORT_v0.30.md`.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.30
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Build powinien potwierdzić:

```text
assets OK: 155/155 logo
[verify] Local logos in APK: 155/155
```

Wynik: `C:\OrangeSimpleTV-v0.30\out\OrangeSimpleTV.apk`.

Playback, DRM/Widevine, MSE/EME i źródło streamu pozostają własnością oficjalnego playera Orange. Aplikacja nie podmienia `video.src` ani MediaKeys.