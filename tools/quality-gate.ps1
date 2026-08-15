param(
    [switch]$SkipDom,
    [switch]$UpdateGraph
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Push-Location $Root
try {
    $python = Get-Command python -ErrorAction SilentlyContinue
    if (-not $python) { $python = Get-Command py -ErrorAction SilentlyContinue }
    if (-not $python) { throw 'Python is required for the local quality gate.' }

    Write-Host '[1/2] Mechanical invariants'
    & $python.Source tests/test_invariants.py
    if ($LASTEXITCODE -ne 0) { throw 'Invariant tests failed.' }

    if (-not $SkipDom) {
        Write-Host '[2/2] Real-snapshot DOM regression tests'
        & $python.Source -c "import playwright" 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host 'Installing Playwright Python package once...'
            & $python.Source -m pip install --disable-pip-version-check -q playwright
            if ($LASTEXITCODE -ne 0) { throw 'Could not install Playwright.' }
        }
        & $python.Source tests/run_dom_tests.py
        if ($LASTEXITCODE -ne 0) { throw 'DOM regression tests failed.' }
    }

    if ($UpdateGraph) {
        $graphUpdate = Join-Path $PSScriptRoot 'graphify-update.ps1'
        if (Test-Path $graphUpdate) {
            Write-Host 'Updating Graphify incrementally...'
            & $graphUpdate
            if ($LASTEXITCODE -ne 0) { throw 'Graphify incremental update failed.' }
        }
    }

    Write-Host 'PASS: OrangeSimpleTV fast quality gate'
}
finally {
    Pop-Location
}
