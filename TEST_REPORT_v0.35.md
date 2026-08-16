# TEST REPORT v0.35

Base: `v0.29-channel-activation-diagnostics`.

Zakres zmiany: tylko wejście pierwszego logowania oraz zachowana warstwa auto-login/PIN. Bez zmian w discovery, EPG, playerze, DRM i switchu.

Lokalne testy:

- Java typecheck: PASS
- login race: PASS
- v0.17 tune state model: PASS (10 scenariuszy)
- v0.23 close-before-tune: PASS
- v0.24 local logos / diagnostics: PASS
- Windows nested assets 155/155: PASS
- v0.27 exact-X / identity: PASS
- v0.28 switch recovery: PASS
- v0.29 activation diagnostics: PASS
- real-snapshot DOM tests: PASS
- v0.35 v0.29-base login input contract + adult PIN: PASS

Fizyczny powód zmiany: na DIW377 systemowy TV IME zgubił końcowy `DPAD_CENTER` podczas zamykania klawiatury, więc przycisk logowania nie dostał akcji. v0.35 startuje fokus na przycisku `ZALOGUJ` i nie otwiera IME, dopóki użytkownik świadomie nie przejdzie do edycji pola.
