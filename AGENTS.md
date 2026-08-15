# OrangeSimpleTV agent workflow

## Graphify is query-first for this repository

When `graphify-out/graph.json` exists, consult the graph before broad grep/search or reading many source files. Use the smallest useful query:

- `graphify query "<question>"` for architecture, ownership, flows and cross-file relationships.
- `graphify path "A" "B"` to trace a dependency or call/data path.
- `graphify explain "<node>"` to inspect one concept and its neighbors.

Use raw source reads only after the graph has narrowed the relevant files/symbols, or when validating an exact implementation detail.

## Keep the graph fresh without slowing iteration

- Normal code edit cycle: `./tools/graphify-update.ps1` (incremental AST update, no LLM, no clustering by default).
- Before architecture/refactor work: `./tools/graphify-update.ps1 -Cluster`.
- First checkout / missing graph: `./tools/graphify-bootstrap.ps1`.
- Do not run a full rebuild on every edit.
- Preserve `graphify-out/manifest.json`; Graphify uses it for portable incremental updates.
- After installing/upgrading Graphify, refresh its Git hook with `graphify hook install`.

## Security / corpus rules

Never add saved Orange TV Go pages containing live cookies, auth tokens, credentials or private session data to the graph or repository. Use only sanitized fixtures under `tests/fixtures/`.

Do not index build artifacts, APKs, SDK caches, Gradle caches, keystores or generated output; `.graphifyignore` is authoritative for Graphify-specific exclusions.

## Project priorities

1. Preserve official Orange WebView/EME/Widevine playback; do not implement DRM circumvention.
2. Prefer deterministic selectors and state checks derived from sanitized real DOM fixtures.
3. Keep Android runtime code minimal and build iterations fast.
4. Tests should target the exact regression before expanding heuristics.
