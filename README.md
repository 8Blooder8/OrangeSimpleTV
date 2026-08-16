# Orange Simple TV v0.36

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377.

## v0.36 — v0.29 + auto-login/PIN + twarde potwierdzenie sesji

Bazą runtime pozostaje działająca v0.29. Zmieniona jest tylko warstwa logowania dodana później.

- login nie jest uznawany za udany na podstawie samego shell/home/navigation Orange;
- `AUTH` wymaga co najmniej 3 realnych kart kanałów Orange;
- po udanym submit i lądowaniu na home aplikacja przechodzi raz na `/channels` i czeka na prawdziwe karty;
- dopiero wtedy uruchamia niezmienione discovery v0.29;
- istniejąca sesja także jest uznawana za ważną dopiero po pojawieniu się kart kanałów;
- startup nie fokusuje pola tekstowego, żeby nie budzić TV IME DIW377;
- zachowane: auto-login po pierwszym enrollment, automatyczny kod dorosłych, player/switch/EPG/DRM v0.29.

Szczegóły: `V0.36_STRICT_LOGIN_CHANNEL_PROOF.md` oraz `TEST_REPORT_v0.36.md`.

**Uwaga:** prywatny build zawiera lokalnie skonfigurowane dane logowania/PIN. Same wartości nie są publikowane w repozytorium.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.36
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Build powinien potwierdzić:

```text
assets OK: 155/155 logo
[verify] Local logos in APK: 155/155
```

APK: `C:\OrangeSimpleTV-v0.36\out\OrangeSimpleTV.apk`.
