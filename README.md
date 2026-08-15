# OrangeSimpleTV

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod Sagemcom Orange 4K Multi (DIW377).

- bez własnego DRM/streamingu — playback pozostaje po stronie oficjalnego WebView Orange,
- szybki build bez Gradle: AAPT2 → javac → D8 → zipalign → apksigner,
- testy DOM oparte na zanonimizowanych snapshotach rzeczywistego Orange TV Go,
- bieżąca linia rozwojowa: v0.10.

> Nie commitujemy HTML-i z aktywnymi cookies/sesją Orange.

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

### Dlaczego graph jest code-only

`.graphifyignore` celowo wyklucza Markdown/HTML/YAML oraz build output. Kod (Java/JavaScript/Python/PowerShell itd.) Graphify analizuje lokalnie i deterministycznie przez AST; dokumenty uruchamiają cięższy semantic pass, który nie daje wystarczającego zysku w codziennych krótkich iteracjach OrangeSimpleTV.

`AGENTS.md` wymusza zasadę **graph-query-first**: przy pytaniu o architekturę/flow najpierw zawężamy problem przez Graphify, a dopiero potem czytamy konkretne fragmenty źródeł.
