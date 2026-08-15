# Orange Simple TV v0.21

Lekki frontend Android TV dla oficjalnego `tvgo.orange.pl`, projektowany pod DIW377 i z pełnym trybem UI do testów na emulatorze/BlueStacks.

## v0.21 — kompletne EPG przed publikacją świeżej listy

v0.20 poprawnie pobierał nazwę aktualnego programu z `Channel-ProgramName`, ale start/koniec/opis próbował uzupełniać głównie z widocznego DOM i heurystycznego dopasowania kafelków programu. To powodowało, że godziny oraz progress mogły pojawić się dopiero po uruchomieniu konkretnego kanału, gdy Orange tworzył bogatszy DOM playera.

v0.21 rozdziela zwykłe wykrycie listy od jawnego etapu `EPG enrichment`:

1. lista kanałów i nazwy programów,
2. eager discovery logotypów,
3. skan danych React przypisanych do każdego kafelka,
4. jeden szerszy skan nadrzędnego store/state React,
5. bezpieczne wykorzystanie już zaobserwowanych same-origin zasobów wyglądających wyłącznie jak EPG/program/guide/schedule,
6. kilka krótkich retry tylko dla nierozwiązanych kanałów,
7. świeża lista staje się autorytatywna dopiero, gdy wszystkie kanały z aktualnym programem mają `start/end` albo kończy się twardy deadline.

Nie jest hardcodowany prywatny endpoint Orange i aplikacja nie zapisuje surowych odpowiedzi API. Do modelu trafiają tylko dane potrzebne do guide: nazwa programu, start, koniec, opis/progress oraz źródło enrichmentu.

### Co naprawiono

- `EPG done` i `EPG complete` są osobnymi stanami; zakończenie pierwszego skanera nie oznacza już kompletności danych,
- cold start nie pokazuje świeżej, niekompletnej listy jako gotowej,
- cache działa stale-while-revalidate: poprzednia kompletna lista pozostaje natychmiast interaktywna podczas odświeżania,
- timeout odświeżania nie kasuje poprawnych godzin z cache, jeśli bieżąca strona nie udostępni pełnych danych,
- usunięto shortcut „75% logotypów wystarczy” — świeży guide czeka na URL logo dla wszystkich wykrytych kart (z twardym timeoutem),
- stary `channel_cache_v1` został zastąpiony `channel_cache_v2`, aby nie dziedziczyć niepełnego cache z v0.20,
- dopasowanie programów toleruje suffixy typu `odc. 5`, ale krótkie/genericzne tytuły (`News`) są dopasowywane konserwatywnie,
- replay zasobów nie dotyka szerokich `/live/channel/...`, streamów, manifestów, DRM ani licencji,
- poprawiono wykrywanie BlueStacks: dodatkowe Build/system properties, x86/x86_64 i charakterystyczne markery guest/shared-folder.

### UI i playback

Interfejs referencyjny v0.20 pozostaje: lista z logo/programem/godzinami/progressem po lewej, podgląd i karta EPG po prawej, bez dolnej legendy. `BACK` podczas playbacku nadal tylko nakłada panel kanałów nad pełnoekranowym video. Warm switch nadal nie reloaduje `/channels`.

Działający pipeline Orange nie został przepisany: logowanie, prawdziwy Play, WebView, DRM/Widevine, MSE/EME i potwierdzenie pierwszej klatki pozostają po stronie istniejącej ścieżki.

## BlueStacks / emulator

W wykrytym emulatorze brak Widevine nie blokuje testów UI. Kanał przechodzi do pełnoekranowego placeholdera, a `BACK`, `OK`, CH+/CH− i numery kanałów działają jak w normalnym flow.

Klawiatura:

- `↑` / `↓` — focus kanału,
- `Enter` — OK,
- `Esc` / `Backspace` — BACK,
- `Page Down` — CH+ (następny kanał w dół),
- `Page Up` — CH− (poprzedni kanał w górę),
- `Space` — Play/Pause,
- `0–9` — numer kanału,
- `Home` / `End` — pierwszy / ostatni kanał.

## Windows build

```powershell
cd C:\OrangeSimpleTV-v0.21
Set-ExecutionPolicy -Scope Process Bypass
.\build_windows.ps1
```

Wynik:

`C:\OrangeSimpleTV-v0.21\out\OrangeSimpleTV.apk`

Build pozostaje bez Gradle: AAPT2 → javac → D8 → zipalign → apksigner.
