# Test report — v0.24 Windows asset packaging fix

Przeszły lokalnie:

- pełny `tools/test_local.sh`,
- nowy kontrakt `tests/test_v024_windows_asset_packaging.py`,
- symulacja `jar uf <apk> assets` na pełnym katalogu źródłowym,
- symulacja potwierdziła `assets/channel_logos/catalog.json`, `155/155` plików `logo_###.png` oraz `assets/orange_bridge.js` pod kanonicznymi ścieżkami ZIP.

Poprawiony skrypt wykonuje tę samą kontrolę przed `zipalign` i po podpisaniu finalnego APK.

Realny AAPT2/apksigner Windows pozostaje do ponownego uruchomienia na komputerze użytkownika; log z Windows, w którym finalna walidacja nie znalazła katalogu logo, był podstawą tej poprawki.