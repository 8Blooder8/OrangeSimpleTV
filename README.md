# OrangeSimpleTV

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod Sagemcom Orange 4K Multi (DIW377).

- bez własnego DRM/streamingu — playback pozostaje po stronie oficjalnego WebView Orange,
- szybki build bez Gradle: AAPT2 → javac → D8 → zipalign → apksigner,
- testy DOM oparte na zanonimizowanych snapshotach rzeczywistego Orange TV Go,
- bieżąca linia rozwojowa: v0.10.

> Nie commitujemy HTML-i z aktywnymi cookies/sesją Orange.
