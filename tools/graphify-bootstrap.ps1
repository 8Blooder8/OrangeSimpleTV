$ErrorActionPreference = 'Stop'

$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $Root

function Refresh-Path {
    $machine = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $user = [Environment]::GetEnvironmentVariable('Path', 'User')
    $env:Path = "$machine;$user"
}

Write-Host '[Graphify] bootstrap OrangeSimpleTV'

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        throw 'Brak uv i winget. Zainstaluj uv: https://docs.astral.sh/uv/'
    }
    Write-Host '[Graphify] instaluję uv (jednorazowo)...'
    winget install astral-sh.uv --accept-source-agreements --accept-package-agreements
    Refresh-Path
}

if (-not (Get-Command graphify -ErrorAction SilentlyContinue)) {
    Write-Host '[Graphify] instaluję graphifyy w izolowanym środowisku uv (jednorazowo)...'
    uv tool install graphifyy
    Refresh-Path
}

if (-not (Get-Command graphify -ErrorAction SilentlyContinue)) {
    # uv może wymagać odświeżenia PATH po pierwszej instalacji.
    uv tool update-shell | Out-Null
    Refresh-Path
}

if (-not (Get-Command graphify -ErrorAction SilentlyContinue)) {
    throw 'Graphify został zainstalowany, ale bieżąca powłoka nie widzi polecenia. Otwórz nowy PowerShell i uruchom skrypt ponownie.'
}

Write-Host ('[Graphify] wersja: ' + (& graphify --version 2>$null))

# Instalacja project-scoped generic Agent Skill. Nie dodajemy ciężkich extras,
# bo ten projekt potrzebuje głównie lokalnego AST dla Java/JS/PS1/Python/docs.
Write-Host '[Graphify] rejestruję project-scoped skill...'
& graphify install --project --platform agents

# Pierwszy graph. Następne iteracje korzystają z --update.
if (Test-Path (Join-Path $Root 'graphify-out\graph.json')) {
    Write-Host '[Graphify] graph już istnieje — wykonuję tylko update...'
    & graphify . --update --no-viz
} else {
    Write-Host '[Graphify] pierwszy build graphu...'
    & graphify . --no-viz
}

# Hook zapisuje interpreter Graphify w samym hooku; dzięki temu działa także
# w GUI Git/CI bez polegania na PATH. Po upgrade Graphify bootstrap można odpalić ponownie.
Write-Host '[Graphify] instaluję szybki post-commit hook...'
& graphify hook install

Write-Host ''
Write-Host '[Graphify] gotowe.'
Write-Host 'Szybka codzienna aktualizacja: .\tools\graphify-update.ps1'
Write-Host 'Zapytanie: graphify query "jak działa wybór kanału?"'
