# OrangeSimpleTV agent workflow

This file is the short entry point. Detailed feedback-loop rules live in `docs/HARNESS.md`; the Open Interpreter QA contract lives in `.agents/skills/orange-tv-qa/SKILL.md`.

## 1. Graphify is query-first

When `graphify-out/graph.json` exists, consult the graph before broad grep/search or reading many source files:

- `graphify query "<question>"` for architecture, ownership, flows and cross-file relationships.
- `graphify path "A" "B"` to trace a dependency/call/data path.
- `graphify explain "<node>"` to inspect one concept and its neighbors.

Use raw source reads after the graph narrows the relevant files/symbols, or to verify an exact implementation detail.

Keep the graph cheap:

- normal edit cycle: `./tools/graphify-update.ps1` (incremental AST update, no LLM/clustering by default);
- architecture/refactor work: `./tools/graphify-update.ps1 -Cluster`;
- first checkout/missing graph: `./tools/graphify-bootstrap.ps1`;
- never rebuild the full graph after every small edit.

## 2. Mandatory fast feedback loop

For every code change:

1. establish the exact failing state/invariant;
2. make the smallest targeted change;
3. run `./tools/quality-gate.ps1`;
4. if the regression is based on a stable real Orange fact, encode it in a fixture/test/invariant;
5. only then broaden selectors/heuristics.

The fast quality gate must remain deterministic, local and free of LLM/model calls. It must not build an APK or contact Orange.

## 3. Open Interpreter QA

Use Open Interpreter only as a deeper verification layer, not as a substitute for deterministic tests.

- bootstrap once: `./tools/openinterpreter-bootstrap.ps1`;
- fixture QA: `./tools/openinterpreter-qa.ps1`;
- live QA is explicit only: `./tools/openinterpreter-qa.ps1 -Live`.

UI success requires snapshot/state before → one action → snapshot/state after. A tool reporting that a click succeeded is not proof that Orange opened the player.

Do not let agent QA edit source unless the user explicitly asked for an implementation pass.

## 4. DeepSec

Default security pass is the local/free pattern scan:

`./tools/deepsec-scan.ps1`

DeepSec AI `process`/`revalidate` is never automatic because it may incur model cost. GitHub CI runs only the pattern scan on pull requests/manual dispatch so ordinary push iterations remain fast.

## 5. Security / corpus rules

Never add saved Orange TV Go pages containing live cookies, auth tokens, credentials, Authorization headers, HAR session captures or private session data to the graph or repository. Use only sanitized fixtures under `tests/fixtures/`.

Never extract/bypass Widevine keys/licenses, PSSH, manifests or DRM. Preserve official Orange WebView/EME playback.

Do not index or commit APK/build output, SDK caches, Gradle caches, keystores, `.deepsec/` runtime state or `graphify-out/`; `.gitignore` and `.graphifyignore` are authoritative.

## 6. Project invariants/priorities

1. The real channel route is `/channels`; obsolete `/live/channels` must not return.
2. Channels are discovered from `[data-testid="Channel-ChannelWrapper"]`.
3. A player is open only when `[data-testid="player-container"]` is `mode="expanded"`; existence of `<video>` alone is insufficient.
4. Preserve official Orange WebView/EME/Widevine playback; no custom DRM/stream extraction.
5. Prefer deterministic selectors/state checks derived from sanitized real DOM fixtures.
6. Keep Android runtime code minimal and APK builds fast.
7. Tests target the exact regression before expanding heuristics.
