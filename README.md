# Orange Simple TV v0.38

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377.

## v0.38 — v0.29 + poprawiona obsługa kodu dorosłych

Baza funkcjonalna jest bezpośrednio z v0.29. Logowanie, discovery kanałów, EPG, przełączanie, player i DRM pozostają bez zmian względem v0.29.

Raport z DIW377 pokazał, że Orange tworzy modal kodu dorosłych asynchronicznie około 1.2–1.4 s po prawidłowym Play. v0.37 potrafiła go zobaczyć w diagnostyce, ale regularna pętla tune mogła ominąć krótkie okno React portal. v0.38 dodaje lekkie opóźnione próby wyłącznie obsługi oficjalnego modala PIN; dla zwykłych kanałów są no-op.

Prywatna wartość PIN nie jest publikowana w repozytorium.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.38
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Build powinien potwierdzić:

```text
assets OK: 155/155 logo
[verify] Local logos in APK: 155/155
```

Wynik: `C:\OrangeSimpleTV-v0.38\out\OrangeSimpleTV.apk`.
