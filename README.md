# Orange Simple TV v0.22

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377.

## v0.22 — stabilny handoff kanału + pełniejszy harvest EPG/logo

- stary background/minimized player nie jest już uznawany za nowy kanał po samym timeoutcie,
- nowy kanał musi dojść do `expanded` + prawdziwie renderowanej klatki przed sukcesem,
- przy nieudanym warm switch działa ograniczony rollback do ostatniego stabilnego kanału,
- cały top bar Orange (hamburger/Start/search/settings) jest stale ukrywany przez bridge + MutationObserver,
- transient hover sweep pobiera lazy `Channel-ProgramTime` i logo dla całej listy bez ręcznego przewijania,
- `OK` pokazuje aktualny zegar, a wpisywane cyfry kanału pojawiają się pomarańczowo w lewym dolnym rogu,
- DIW377 zapisuje osobne raporty guide/switch do `files/ostv-diagnostics`.

Szczegóły: `V0.22_STABLE_SWITCH_DIAGNOSTICS.md`.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.22
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Wynik: `C:\OrangeSimpleTV-v0.22\out\OrangeSimpleTV.apk`.

## Założenia

Playback, DRM/Widevine, MSE/EME i źródło streamu pozostają własnością oficjalnego playera Orange. v0.22 koncentruje się na stabilnym handoffie, guide i diagnostyce DIW377; nie implementuje własnego DRM ani dwóch równoległych sesji Widevine.