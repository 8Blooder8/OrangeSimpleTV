from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
java=(root/'app/src/main/java/pl/blazej/orangesimpletv/MainActivity.java').read_text(encoding='utf-8')
js=(root/'app/src/main/assets/orange_bridge.js').read_text(encoding='utf-8')
cat=json.loads((root/'app/src/main/assets/channel_logos/catalog.json').read_text(encoding='utf-8'))
assert cat['count']==155 and len(cat['channels'])==155
assert all((root/'app/src/main/assets/channel_logos'/c['file']).is_file() for c in cat['channels'])
polsat=[c for c in cat['channels'] if c['name']=='Polsat Rodzina'][0]
assert polsat['number']==83
assert [c['number'] for c in cat['channels']]==list(range(1,156))
assert 'stableChannelNumber' in java and 'localAssetForName' in java and 'Collections.sort(result' in java
assert 'channel_cache_v3' in java and 'asset:channel_logos/' in java
queue=java[java.index('private void queueLogoLoad'):java.index('private Bitmap decodeDataImage')]
assert 'downloadLogo(url' not in queue
assert 'normalizeChannelIdentity(channels.get(index).displayName).equals' in java
assert 'TAP_MINIMIZE' not in js and 'CLOSE_REQUESTED' in js
assert 'suppressPlayerChrome' in js and 'ostv-hide-player-chrome' in js
assert 'ensureLiveEdge' in js and 'IconPlayerLive' in js and 'liveOffsetSeconds' in js
for event in ['SWITCH_REQUEST','OLD_PLAYER_CLOSE_REQUEST','OLD_PLAYER_CLOSED','TARGET_TILE_ACTIVATE','TARGET_PLAYER_CREATED','TARGET_IDENTITY_CONFIRMED','TARGET_EXPANDED','TARGET_FRAME_RENDERED','LIVE_EDGE_CHECK','PLAYER_CHROME_HIDDEN','SWITCH_COMMIT','ROLLBACK_REQUEST','ROLLBACK_SUCCESS']:
    assert event in java,event
assert 'logoAssetFilename' in java and 'unmappedLogos' in java and 'unresolvedChannels' in java
print('PASS: v0.23 local catalog / stable numbering / close switch / live-edge diagnostics')