# OrangeSimpleTV

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod Sagemcom Orange 4K Multi (DIW377).

- bez własnego DRM/streamingu — playback pozostaje po stronie oficjalnego WebView Orange,
- szybki build bez Gradle: AAPT2 → javac → D8 → zipalign → apksigner,
- testy DOM oparte na zanonimizowanych snapshotach rzeczywistego Orange TV Go,
- bieżąca linia rozwojowa: v0.10.

> Nie commitujemy HTML-i z aktywnymi cookies/sesją Orange.

## Najszybsza codzienna iteracja

Po zmianie kodu uruchom:

```powershell
.\tools\quality-gate.ps1
```

Quality gate jest celowo lekki: mechaniczne inwarianty + testy DOM na rzeczywistych, zanonimizowanych snapshotach; bez LLM, bez APK i bez kontaktu z Orange.

## Graphify — stały workflow developerski

Graphify służy wyłącznie do analizy kodu podczas developmentu; **nie trafia do APK i nie działa na dekoderze**.

Pierwsza konfiguracja na Windows:

```powershell
.\tools\graphify-bootstrap.ps1
```

Skrypt instaluje `uv` tylko jeśli go brakuje, instaluje oficjalny pakiet `graphifyy` w izolowanym środowisku, rejestruje project-scoped Agent Skill, buduje pierwszy graph i instaluje post-commit hook.

Codzienna szybka iteracja:

```powershell
.\tools\graphify-update.ps1
```

To wykonuje **inkrementalny** `--update`, a nie pełne mapowanie projektu od zera.

Zapytanie do graphu:

```powershell
graphify query "jak działa aktywacja kafelka kanału?"
graphify path "activateChannel" "playerAction"
graphify explain "activateChannel"
```

Dla pracy architektonicznej/refaktoru można dodatkowo odświeżyć clustering:

```powershell
.\tools\graphify-update.ps1 -Cluster
```

`.graphifyignore` celowo ogranicza codzienny graph do kodu i wyklucza ciężkie/sekretne dane. `AGENTS.md` wymusza zasadę graph-query-first.

## Open Interpreter — lokalny agent QA

Open Interpreter jest opcjonalnym, głębszym verifierem i nie wchodzi do APK.

Jednorazowo:

```powershell
.\tools\openinterpreter-bootstrap.ps1
```

Skrypt instaluje Open Interpreter z oficjalnego instalatora oraz `agent-browser` dla realnego browser QA.

Typowa weryfikacja po przejściu zwykłych testów:

```powershell
.\tools\openinterpreter-qa.ps1
```

Tryb live jest jawnie opt-in:

```powershell
.\tools\openinterpreter-qa.ps1 -Live
```

Projektowy skill `.agents/skills/orange-tv-qa/SKILL.md` wymaga zasady **snapshot → akcja → snapshot**. Samo powodzenie komendy `click` nie jest uznawane za sukces, dopóki stan DOM/playera faktycznie się nie zmieni.

## Harness Engineering — mechaniczny feedback loop

Zasady są opisane w `docs/HARNESS.md` i egzekwowane przez `tests/test_invariants.py` + GitHub Actions.

Najważniejsze inwarianty:

- `/channels`, nigdy stare `/live/channels`;
- `[data-testid="Channel-ChannelWrapper"]` jako realny kafelek kanału;
- `[data-testid="player-container"]` + `mode="expanded"` jako warunek otwartego playera;
- `#video-player` jako video Orange;
- brak prywatnych cookies/tokenów w fixtures;
- brak własnego bypassu/ekstrakcji DRM.

Każdy nowy stabilny fakt odkryty na DIW377 powinien stać się testem lub inwariantem, żeby kolejna iteracja nie mogła go przypadkiem cofnąć.

## DeepSec — bezpieczeństwo bez spowalniania pushy

Lokalny darmowy/pattern-only scan:

```powershell
.\tools\deepsec-scan.ps1
```

Pierwsze uruchomienie tworzy lokalne `.deepsec/` i instaluje workspace; kolejne wykorzystują cache. Domyślny skrypt **nie uruchamia AI**.

GitHub Actions wykonuje DeepSec pattern scan tylko dla pull requestów oraz ręcznego `workflow_dispatch`, dzięki czemu zwykłe commity/pushe pozostają szybkie.

AI-owe `deepsec process`/`revalidate` pozostaje ręczne, ponieważ może generować koszt modelu.

## Kolejność narzędzi

Dla zwykłego buga:

```text
Graphify query
  → mała poprawka
  → quality-gate
  → Graphify --update
```

Dla trudnego regresu UI:

```text
powyższe
  → Open Interpreter QA
  → snapshot/action/snapshot
```

Dla PR/release lub zmian w WebView/JS bridge/security:

```text
powyższe
  → DeepSec pattern scan
```

Żadne z tych narzędzi developerskich nie trafia do APK ani nie obciąża dekodera.
