# Orange Simple TV v0.33

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod Orange DIW377.

## v0.33 — exact-case login + bezpieczny submit React

- login TV Go jest przekazywany dokładnie w skonfigurowanej postaci; aplikacja nie zmienia już wielkości liter identyfikatora,
- formularz Orange jest teraz obsługiwany dwufazowo: najpierw wpisanie wartości do controlled inputs, potem osobna runda na submit po potwierdzeniu, że wartości pozostały stabilne,
- nie klikamy przycisku logowania w tej samej rundzie JavaScript, w której dopiero ustawiliśmy pola,
- zachowany kontrakt v0.32: jedno ręczne zatwierdzenie po instalacji/wyczyszczeniu danych, potem wyłącznie automatyczne odnawianie sesji,
- aktualizacja z v0.32 nie powinna wymagać ponownego ręcznego wpisywania danych; zmiana markera konta wymusza automatyczne odtworzenie sesji,
- discovery, automatyczny PIN dorosłych, player, DRM/Widevine, EPG i lokalne loga pozostają bez zmian.

**Uwaga:** prywatny build zawiera lokalnie skonfigurowane dane logowania/PIN. Same wartości nie są publikowane w tym repozytorium.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.33
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Build powinien potwierdzić:

```text
assets OK: 155/155 logo
[verify] Local logos in APK: 155/155
```

APK: `C:\OrangeSimpleTV-v0.33\out\OrangeSimpleTV.apk`.
