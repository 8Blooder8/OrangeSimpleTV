# Orange Simple TV v0.27

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377.

## v0.27 — poprawka przełączania z realnego logu DIW377

- poprawione zamykanie starego playera: Orange ma dwa `ClosePlayerButtonWrapper`; aplikacja wybiera teraz wyłącznie właściwy przycisk X (`player_close_X`), a nie pierwszy przycisk Back,
- maks. 2 ponowienia oficjalnego handlera X i krótszy 1400 ms deadline,
- aktywacja kafelka zwraca jego realną nazwę/id; mismatch targetu blokuje tap zamiast uruchomić zły kanał,
- EPG/resource harvesting jest pauzowany na czas tune/switch,
- jeśli React ma komplet godzin, kosztowny resource replay nie jest wykonywany,
- sukces switchu zapisuje lekki snapshot diagnostyczny zamiast ciężkiego `uiDiagnostics()` na hot path,
- stare callbacki live-edge nie mogą dopisywać eventów do nowej sesji,
- lokalne logo, stabilna numeracja, EPG merge i Windows asset packaging z poprzednich wersji pozostają.

Szczegóły: `V0.27_SWITCH_CLOSE_IDENTITY_PRIORITY.md` i `TEST_REPORT_v0.27.md`.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.27
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Build powinien potwierdzić:

```text
assets OK: 155/155 logo
[verify] Local logos in APK: 155/155
```

Wynik: `C:\OrangeSimpleTV-v0.27\out\OrangeSimpleTV.apk`.

Playback, DRM/Widevine, MSE/EME i źródło streamu pozostają własnością oficjalnego playera Orange. Aplikacja nie podmienia `video.src` ani MediaKeys.