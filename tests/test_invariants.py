from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
BRIDGE = ROOT / 'app/src/main/assets/orange_bridge.js'
FIXTURES = ROOT / 'tests/fixtures'


def require(text: str, needle: str, label: str) -> None:
    if needle not in text:
        raise AssertionError(f'missing invariant: {label}: {needle!r}')


def main() -> None:
    js = BRIDGE.read_text(encoding='utf-8')

    require(js, '[data-testid="Channel-ChannelWrapper"]', 'real Orange channel-card selector')
    require(js, '[data-testid="player-container"]', 'real Orange player container selector')
    require(js, '#video-player', 'real Orange video selector')
    require(js, "p.mode === 'expanded'", 'expanded mode remains final player success')
    require(js, "p.mode === 'background'", 'background mode is modeled as an intermediate player state')
    require(js, 'backgroundPlayer', 'background player state is exposed to Android')
    require(js, 'IconPlayerScroll', 'Orange background-to-expanded control is detected')
    require(js, 'TAP_EXPAND', 'Android receives a native expand-tap action')
    require(js, 'reactClickHandler', 'React activation fallback stays available')
    require(js, 'NATIVE_TAP', 'native WebView tap remains first-class channel activation strategy')
    require(js, '/\\/channels(?:[/?#]|$)/i', 'channel-route check targets /channels')

    if '/live/channels' in js:
        raise AssertionError('obsolete Orange route /live/channels must never return')

    # Playback remains inside the official Orange page/WebView. Do not grow a
    # separate manifest/license extraction path.
    forbidden_runtime_terms = [
        'licenseRequest', 'widevineKey', 'psshExtractor', 'mpdManifestUrl',
        'm3u8ManifestUrl', 'drmKey', 'contentKey'
    ]
    for term in forbidden_runtime_terms:
        if term in js:
            raise AssertionError(f'forbidden custom DRM/manifest path detected: {term}')

    # Sanitized fixtures may contain normal page copy mentioning cookies, but not
    # credential/header material or token assignments.
    secret_patterns = [
        re.compile(r'(?im)^\s*Cookie\s*:'),
        re.compile(r'(?im)^\s*Set-Cookie\s*:'),
        re.compile(r'(?i)Authorization\s*:\s*Bearer\s+[A-Za-z0-9._~-]{12,}'),
        re.compile(r'(?i)(access[_-]?token|refresh[_-]?token)\s*[=:]\s*["\'][A-Za-z0-9._~-]{12,}'),
    ]
    for path in FIXTURES.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in {'.html', '.htm', '.json', '.txt'}:
            continue
        text = path.read_text(encoding='utf-8', errors='ignore')
        for pattern in secret_patterns:
            if pattern.search(text):
                raise AssertionError(f'possible private session material in fixture: {path}')

    print('PASS: mechanical project invariants')


if __name__ == '__main__':
    main()
