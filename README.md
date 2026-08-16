# Orange Simple TV v0.29

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377.

## v0.29 — diagnostyka kanałów, które nie tworzą playera

Zmiana wynika z realnego raportu `Warner TV -> Kino Polska HD` na DIW377. Stary player zamykał się prawidłowo i Play trafiał w właściwy kafelek, ale Orange nie tworzył nowego `player-container` nawet po reloadzie.

v0.29:

- wykonuje maksymalnie 1 normalny Play + 1 świeży reload `/channels` + 1 finalny Play,
- nie klika już tego samego niedziałającego kanału co ~8 s aż do globalnego timeoutu,
- po nieudanym reloadzie nie uruchamia starej drabiny UA/cache/WebView-recreate,
- kończy ten przypadek jako `CHANNEL_PLAYER_NOT_CREATED`,
- zapisuje `activationDiagnostics`: DOM kafelka, prawdziwy Play, React handler, widoczne alerty/dialogi/toasty, stan playera i Resource Timing,
- zapisuje `activationNetwork`: istotne requesty, błędy transportu i HTTP >= 400,
- do switch reportu dodaje `sanitizedWebDiagnostics`,
- nie przechwytuje fetch/XHR i nie ingeruje w `video.src`, MSE, EME ani MediaKeys.

Szczegóły: `V0.29_CHANNEL_ACTIVATION_DIAGNOSTICS.md` i `TEST_REPORT_v0.29.md`.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.29
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Build powinien potwierdzić:

```text
assets OK: 155/155 logo
[verify] Local logos in APK: 155/155
```

Wynik: `C:\OrangeSimpleTV-v0.29\out\OrangeSimpleTV.apk`.
