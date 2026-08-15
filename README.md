# Orange Simple TV v0.23

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377.

## v0.23 — local logos + stable close-before-switch

- 155/155 logotypów z przekazanego eksportu Orange jest wbudowanych w APK; normalny frontend nie pobiera ich z sieci,
- canonical katalog oddziela numer/identity kanału od chwilowej kolejności discovery; refresh scala metadata po identity zamiast po indeksie,
- wybranie w BACK guide aktualnie oglądanego kanału tylko zamyka guide — bez ponownego tune,
- przy zmianie kanału stary expanded player jest zamykany przez jego własny handler Orange; nie jest już minimalizowany/backgroundowany,
- target jest commitowany dopiero po identity + expanded + real frame + ukrytym player chrome,
- top bar oraz controls playera Orange są suppressowane od bootstrapu i po remountach Reacta, podczas gdy użytkownik widzi szary `Ładowanie…`,
- po starcie wykonywany jest bounded live-edge check przez `currentTime/seekable.end` i oficjalny przycisk Orange `Na żywo`,
- rozszerzone guide/switch JSON-y zapisują local-logo mapping, stabilne numery, EPG source, event trace i live-edge state.

Szczegóły: `V0.23_LOCAL_LOGOS_STABLE_SWITCH.md` i `TEST_REPORT_v0.23.md`.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.23
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Wynik: `C:\OrangeSimpleTV-v0.23\out\OrangeSimpleTV.apk`.

## Założenia

Playback, DRM/Widevine, MSE/EME i źródło streamu pozostają własnością oficjalnego playera Orange. v0.23 nie manipuluje `video.src`, MediaKeys ani nie implementuje własnego DRM. Zmiany koncentrują się na frontendzie, stabilnym identity kanałów, close-before-switch, suppression webowego UI i diagnostyce DIW377.