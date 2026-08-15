param(
    [switch]$SkipBrowser
)

$ErrorActionPreference = 'Stop'

function Refresh-Path {
    $user = [Environment]::GetEnvironmentVariable('Path', 'User')
    $machine = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $env:Path = "$user;$machine;$env:APPDATA\npm"
}

if (-not (Get-Command interpreter -ErrorAction SilentlyContinue)) {
    Write-Host 'Installing Open Interpreter from the official Windows installer...'
    $installer = Join-Path $env:TEMP 'openinterpreter-install.ps1'
    Invoke-WebRequest -UseBasicParsing 'https://www.openinterpreter.com/install.ps1' -OutFile $installer
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $installer
    Remove-Item $installer -Force -ErrorAction SilentlyContinue
    Refresh-Path
}

$interpreter = Get-Command interpreter -ErrorAction SilentlyContinue
if (-not $interpreter) {
    throw 'Open Interpreter installation finished but interpreter.exe is not on PATH. Open a new PowerShell and rerun this script.'
}

Write-Host "Open Interpreter: $($interpreter.Source)"

if (-not $SkipBrowser) {
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        throw 'Node.js/npm is required only for agent-browser. Install Node.js 20+ or rerun with -SkipBrowser.'
    }

    if (-not (Get-Command agent-browser -ErrorAction SilentlyContinue)) {
        Write-Host 'Installing agent-browser...'
        npm install -g agent-browser
        if ($LASTEXITCODE -ne 0) { throw 'agent-browser npm install failed.' }
        Refresh-Path
    }

    Write-Host 'Preparing agent-browser browser/runtime...'
    agent-browser install
    if ($LASTEXITCODE -ne 0) { throw 'agent-browser install failed.' }
    agent-browser skills get core
    if ($LASTEXITCODE -ne 0) { throw 'Could not install agent-browser core skill.' }
}

Write-Host 'PASS: Open Interpreter QA tooling is ready.'
Write-Host 'Run: .\tools\openinterpreter-qa.ps1'
