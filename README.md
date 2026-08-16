# Orange Simple TV v0.35

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377.

## v0.35 — v0.29 + poprawka pierwszego logowania + PIN dorosłych

Bazą runtime pozostaje bezpośrednio v0.29. Nie zmieniono discovery kanałów, EPG, playera, DRM ani switchu.

Logcat z DIW377 pokazał, że pola pierwszego logowania były już wypełnione, ale końcowy `DPAD_CENTER` był gubiony podczas zamykania systemowej klawiatury TV. W efekcie akcja `ZALOGUJ` nie była wywoływana.

v0.35:

- pierwszy ekran ma od razu fokus na `ZALOGUJ`, więc nie otwiera TV IME bez potrzeby,
- prefill danych pozostaje bez zmian,
- pierwszy udany login zapisuje enrollment; późniejsze odnowienia sesji są automatyczne,
- zachowana jest automatyczna obsługa oficjalnego kodu dorosłych,
- wszystkie ścieżki kanałów/playera pozostają z v0.29.

Prywatne wartości loginu, kodu poufnego i PIN-u nie są publikowane w repozytorium.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.35
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Wynik: `C:\OrangeSimpleTV-v0.35\out\OrangeSimpleTV.apk`.
