param(
    [switch]$Cluster,
    [string]$Question = ''
)

$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $Root

if (-not (Get-Command graphify -ErrorAction SilentlyContinue)) {
    throw 'Graphify nie jest zainstalowany. Uruchom najpierw .\tools\graphify-bootstrap.ps1'
}

$graph = Join-Path $Root 'graphify-out\graph.json'
if (-not (Test-Path $graph)) {
    Write-Host '[Graphify] brak graph.json — pierwszy build...'
    & graphify . --no-viz
} else {
    Write-Host '[Graphify] inkrementalny update zmienionych plików...'
    & graphify . --update --no-viz
}

if ($Cluster) {
    Write-Host '[Graphify] odświeżam klastry/architekturę...'
    & graphify . --cluster-only --no-viz
}

if ($Question.Trim()) {
    Write-Host ''
    & graphify query $Question
}
