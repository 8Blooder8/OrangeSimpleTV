param(
    [switch]$Reinstall
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Push-Location $Root
try {
    if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
        throw 'Node.js/npm (with npx) is required for DeepSec.'
    }

    if (-not (Test-Path '.deepsec/package.json')) {
        Write-Host 'Scaffolding local DeepSec workspace (no AI, no login)...'
        npx -y deepsec init --scaffold-only
        if ($LASTEXITCODE -ne 0) { throw 'DeepSec scaffold failed.' }
    }

    if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
        if (Get-Command corepack -ErrorAction SilentlyContinue) {
            corepack enable
        }
        if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
            npm install -g pnpm
            if ($LASTEXITCODE -ne 0) { throw 'Could not install pnpm.' }
        }
    }

    Push-Location '.deepsec'
    try {
        if ($Reinstall -or -not (Test-Path 'node_modules')) {
            Write-Host 'Installing DeepSec workspace dependencies (first run only)...'
            pnpm install --prefer-offline
            if ($LASTEXITCODE -ne 0) { throw 'DeepSec dependency install failed.' }
        }

        Write-Host 'Running DeepSec local pattern scan (free; no AI model calls)...'
        pnpm deepsec scan
        if ($LASTEXITCODE -ne 0) { throw "DeepSec scan exited with code $LASTEXITCODE." }

        Write-Host 'PASS: DeepSec pattern scan completed.'
        Write-Host 'AI-backed process/revalidate is intentionally NOT run automatically.'
    }
    finally {
        Pop-Location
    }
}
finally {
    Pop-Location
}
