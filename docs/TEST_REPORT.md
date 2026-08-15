# Test report v0.10

Źródło DOM: rzeczywiste snapshoty Orange TV Go dostarczone przez użytkownika, następnie zanonimizowane do fixtures bez cookies.

## Zweryfikowane fakty DOM
- lista: `https://tvgo.orange.pl/channels`;
- kafelki: `[data-testid="Channel-ChannelWrapper"]`;
- nazwy kanałów: `title` oraz `img[alt]`;
- player: `[data-testid="player-container"][mode="expanded"]`;
- video: `#video-player`;
- stan playing w snapshotcie: `[data-testid="IconPlayerPause"]`.

## Testy lokalne
- `python tests/verify_source.py` — PASS.
- `python tests/run_dom_tests.py` — PASS na systemowym Chromium.
- testowane: wykrywanie kanałów, Polsat HD, współrzędne natywnego tapnięcia, bubbling DOM click, fallback React `onClick`, wykrycie expanded playera.

## Czego nie da się zweryfikować poza DIW377
- czy konkretny build Android WebView na DIW377 reaguje na syntetyczny Android MotionEvent identycznie jak normalny dotyk;
- faktyczny EME/Widevine playback z prywatną sesją Orange.
