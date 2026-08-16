# Orange Simple TV v0.31

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod Orange DIW377.

## v0.31 — pewne auto-logowanie + samonaprawa wykrywania kanałów

Ta wersja naprawia regresję v0.30, w której automatyczne logowanie mogło zakończyć się bez realnych kart kanałów.

Najważniejsze zmiany:

- skonfigurowane konto jest teraz autorytatywne: po aktualizacji z wersji bez markera sesji aplikacja czyści stary cookie jar Orange jeden raz i wykonuje świeże auto-logowanie;
- kolejne uruchomienia mogą użyć istniejącej sesji tylko wtedy, gdy została wcześniej utworzona przez ten appliance build dla tego samego skonfigurowanego konta;
- identyfikator TV jest normalizowany do formatu z wielkim `M` przed wypełnieniem formularza Orange;
- po udanym submit aplikacja daje SPA 120 ms na zapisanie stanu/cookies przed wymuszeniem `/channels`;
- discovery, które dwa razy z rzędu widzi <3 kanały, sprawdza `loginState()` i potrafi automatycznie wrócić do logowania zamiast kończyć pustą/fallbackową listą;
- po znalezieniu realnej listy kanałów polling DOM jest ograniczony, a indeks metadanych programu ma krótki cache;
- zachowana automatyczna obsługa kodu dorosłych oraz wszystkie reguły playera/switch/DRM z v0.30.

**Uwaga:** prywatny build zawiera lokalnie skonfigurowane dane logowania/PIN. Same wartości nie są publikowane w tym repozytorium.

Szczegóły: `V0.31_LOGIN_DISCOVERY_RECOVERY_PERFORMANCE.md` i `TEST_REPORT_v0.31.md`.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.31
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Build powinien potwierdzić:

```text
assets OK: 155/155 logo
[verify] Local logos in APK: 155/155
```

Wynik: `C:\OrangeSimpleTV-v0.31\out\OrangeSimpleTV.apk`.
