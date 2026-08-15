# Orange Simple TV v0.28

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod Orange DIW377.

## v0.28 — DIW377 switch recovery

Zmiany są oparte na realnych raportach v0.27 z dekodera:

- v0.27 naprawił zamykanie starego playera (prawdziwy `player_close_X`), ale po poprawnym zamknięciu warm-switch nadal mógł utknąć na aktywacji kolejnego kafelka,
- warm switch dostaje 140 ms na ustabilizowanie React DOM po fizycznym unmount starego playera,
- pierwsza aktywacja targetu w warm-switch ma osobny bounded deadline 4 s,
- jeśli po tym czasie Orange nie utworzy nowego playera, aplikacja wykonuje dokładnie jeden czysty reload oficjalnego `/channels` i ponawia TEN SAM target od próby 0 zamiast czekać na wielokrotne 8-sekundowe retry starego DOM,
- automatyczny rollback nie może nadpisać nowszego żądania użytkownika,
- diagnostyka switchu jest teraz snapshotem per sesja: eventy i stateTransitions są kopiowane przed rollbackiem, zapisywane także jako `ostv-switch-session-<id>.json`, a failure ma `failureCode` i `failureReason`,
- zachowane: exact-X close, identity check target tile, 155 lokalnych logo, EPG cache, protected playback gate i clean player.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.28
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Build musi potwierdzić:

```text
assets OK: 155/155 logo
[verify] Local logos in APK: 155/155
```

Wynik: `C:\OrangeSimpleTV-v0.28\out\OrangeSimpleTV.apk`.
