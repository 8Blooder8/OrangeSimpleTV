# Orange Simple TV v0.26

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377.

## v0.26 — fix z realnych logów DIW377

Zmiany wynikają bezpośrednio z raportów `ostv-*` z fizycznego dekodera:

- naprawione dwa błędne expressions `evalBridge`; surowy łańcuch z `;` był wkładany do `JSON.stringify(...)`, co dawało `SyntaxError: missing ) after argument list`,
- pierwszy błąd powodował fałszywe `channelCards=0` i zbędny reload `/channels` przy tune/switchu,
- drugi powodował, że player był już realnie `PLAYING` (RVFC, readyState=4, 1024x576, rosnące frames), ale `finishTune()` nigdy nie następował i kończyło się `TUNE_TIMEOUT`,
- discovery kanałów jest scalane po identity; pełny 164-kanałowy snapshot nie może już wymazać programów/godzin z bogatszego chwilowego snapshotu,
- hover sweep odświeża referencje React DOM i zawsze kontynuuje przez `finally`,
- ciężki skan EPG przestał być kwadratowy: cursor zamiast `queue.shift()`, `WeakSet` zamiast liniowego `Array.indexOf`, plus krótki budżet globalnego React fallbacku,
- na cold start lista jest pokazywana natychmiast z lokalnymi logo/programami, a schedule/progress uzupełnia się w miejscu,
- zachowane: 155 lokalnych PNG, identity-only logo mapping, collision-free numbering, close-before-switch, grey loading cover, chrome suppression i post-commit live-edge check.

Szczegóły: `V0.26_DIW377_RUNTIME_FIX.md` i `TEST_REPORT_v0.26.md`.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.26
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Build musi potwierdzić:

```text
assets OK: 155/155 logo
[verify] Local logos in APK: 155/155
```

Wynik: `C:\OrangeSimpleTV-v0.26\out\OrangeSimpleTV.apk`.

Playback, DRM/Widevine, MSE/EME i źródło streamu nadal pozostają własnością oficjalnego playera Orange.