# Orange Simple TV v0.32

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod Orange DIW377.

## v0.32 — pierwsze logowanie ręczne, później tylko automatyczne

- po instalacji lub wyczyszczeniu danych formularz logowania pojawia się dokładnie raz,
- prywatne dane appliance build są wstępnie wpisane, ale pierwszy submit wymaga naciśnięcia `ZALOGUJ`,
- po pierwszym poprawnym logowaniu zapisywany jest prywatny marker enrollment,
- przy kolejnych uruchomieniach pola login/hasło są ukryte,
- ważna sesja Orange jest używana bez ponownego logowania,
- brakująca/wygasła/odrzucona sesja jest odnawiana wyłącznie automatycznie,
- recovery podczas wykrywania kanałów również nie wraca do ręcznego formularza,
- wyczyszczenie danych aplikacji lub uninstall celowo wymaga jednego ponownego ręcznego logowania.

Zachowane są poprawki v0.31: discovery recovery, normalizacja loginu, automatyczny PIN dorosłych, lekki hot path playera, lokalne loga i diagnostyka.

**Uwaga:** prywatny build zawiera lokalnie skonfigurowane dane logowania/PIN. Same wartości nie są publikowane w tym repozytorium.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.32
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Build powinien potwierdzić:

```text
assets OK: 155/155 logo
[verify] Local logos in APK: 155/155
```

APK: `C:\OrangeSimpleTV-v0.32\out\OrangeSimpleTV.apk`.
