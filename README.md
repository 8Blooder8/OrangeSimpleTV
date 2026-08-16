# Orange Simple TV v0.34

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377.

## v0.34 — v0.29 base + auto-login + adult PIN

Ta gałąź została utworzona **bezpośrednio z v0.29**. Nie przenosi zmian discovery/player/switch/performance z v0.30–v0.33.

Rdzeń pozostaje v0.29: exact-X close, close-before-tune, identity check, jeden reload fallback, pełna diagnostyka aktywacji, EPG, lokalne logo, DRM/MSE/EME i rendered-frame gate.

Dodane są tylko:

- jednorazowe pierwsze logowanie przez istniejący mechanizm v0.29; po poprawnym zalogowaniu aplikacja zapamiętuje enrollment,
- przy kolejnych wygasłych/brakujących sesjach logowanie odbywa się automatycznie skonfigurowanym kontem,
- automatyczna obsługa oficjalnego modala Orange z kodem dorosłych,
- brak podmiany `video.src`, MediaKeys, MSE, EME lub Widevine.

Dane konta i PIN znajdują się wyłącznie w prywatnym source/APK i nie są publikowane w tym repozytorium.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.34
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Build powinien potwierdzić:

```text
assets OK: 155/155 logo
[verify] Local logos in APK: 155/155
```

Wynik: `out\OrangeSimpleTV.apk`.
