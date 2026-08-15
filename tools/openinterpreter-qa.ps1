param(
    [switch]$Live,
    [int]$TimeoutSeconds = 600
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Push-Location $Root
try {
    $interpreter = Get-Command interpreter -ErrorAction SilentlyContinue
    if (-not $interpreter) {
        throw 'Open Interpreter is not installed. Run .\tools\openinterpreter-bootstrap.ps1 first.'
    }

    Write-Host 'Running deterministic quality gate before agent QA...'
    & (Join-Path $PSScriptRoot 'quality-gate.ps1')
    if ($LASTEXITCODE -ne 0) { throw 'Fast quality gate failed; agent QA was not started.' }

    $mode = if ($Live) { 'LIVE' } else { 'FIXTURE-ONLY' }
    $liveRules = if ($Live) {
@'
Live Orange inspection is allowed only through an already-authenticated local session. Do not ask for credentials. Do not read, print, export, store or commit cookies, tokens, Authorization headers, passwords, localStorage auth material or Widevine/DRM secrets. Do not change account/subscription settings. Treat screenshots and live diagnostics as temporary.
'@
    } else {
@'
Do not contact or log into Orange. Work only from repository source and sanitized fixtures/tests.
'@
    }

    $prompt = @"
You are the QA verifier for OrangeSimpleTV. Mode: $mode.

Read AGENTS.md, docs/HARNESS.md and .agents/skills/orange-tv-qa/SKILL.md before acting. This is verification only: do not edit source files unless I explicitly ask in a later command.

The deterministic quality gate has just passed. Independently verify the channel discovery -> channel activation -> expanded player state machine. Use Graphify first if graphify-out/graph.json exists. For UI/browser actions use snapshot -> one action -> snapshot and never treat a successful click command as proof without a visible/DOM state change.

$liveRules

Return a compact matrix with: discovery result, selected card, activation strategy, player mode before/after, video state, and exact failing step. If fixture evidence cannot prove a live behavior, say so instead of guessing.
"@

    $prompt | & $interpreter.Source exec --verify --ephemeral --timeout $TimeoutSeconds -
    if ($LASTEXITCODE -ne 0) { throw "Open Interpreter QA exited with code $LASTEXITCODE." }
}
finally {
    Pop-Location
}
