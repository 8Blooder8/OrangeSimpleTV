from pathlib import Path
from playwright.sync_api import sync_playwright
import shutil

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / 'app/src/main/assets/orange_bridge.js').read_text(encoding='utf-8')
FIX = ROOT / 'tests/fixtures'


def load(page, name):
    page.set_content((FIX / name).read_text(encoding='utf-8'))
    page.add_script_tag(content=JS)


def main():
    with sync_playwright() as p:
        exe = shutil.which('chromium') or shutil.which('google-chrome') or shutil.which('google-chrome-stable')
        if not exe:
            raise RuntimeError('No system Chromium/Chrome found')
        browser = p.chromium.launch(headless=True, executable_path=exe, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # Channel discovery and activation targeting.
        load(page, 'channels.html')
        discovered = page.evaluate('window.__OSTV.discoverChannels()')
        assert discovered['count'] == 12, discovered
        names = [x['name'] for x in discovered['channels']]
        assert names[:5] == ['TVP 1 HD', 'TVP 2 HD', 'TVN HD', 'TVN 7 HD', 'Polsat HD'], names[:5]

        info = page.evaluate("window.__OSTV.inspectChannel(['Polsat','Polsat HD'])")
        assert info['kind'] == 'FOUND' and info['name'] == 'Polsat HD', info

        native = page.evaluate("window.__OSTV.activateChannel(['Polsat','Polsat HD'],0)")
        assert native['kind'] == 'NATIVE_TAP' and native['x'] > 0 and native['y'] > 0, native

        page.evaluate("window.__clicked=0; [...document.querySelectorAll('[data-testid=\"Channel-ChannelWrapper\"]')].find(x=>x.innerText.includes('Polsat HD')).addEventListener('click',()=>window.__clicked++)")
        dom = page.evaluate("window.__OSTV.activateChannel(['Polsat','Polsat HD'],1)")
        assert dom['kind'] == 'DOM_EVENTS' and page.evaluate('window.__clicked') >= 1, dom

        page.evaluate("""() => {
          const card=[...document.querySelectorAll('[data-testid="Channel-ChannelWrapper"]')].find(x=>x.innerText.includes('Polsat HD'));
          card.firstElementChild['__reactProps$ostvtest']={onClick:()=>{window.__reactClicked=(window.__reactClicked||0)+1}};
        }""")
        react = page.evaluate("window.__OSTV.activateChannel(['Polsat','Polsat HD'],2)")
        assert react['kind'] == 'REACT_ONCLICK' and page.evaluate('window.__reactClicked') == 1, react

        # Real Orange state-machine regression: /channels may have a valid official
        # player in mode=background. It must not be classified as a failed tune.
        load(page, 'background-player.html')
        background = page.evaluate('window.__OSTV.pageState()')
        assert background['playerShell'] is False, background
        assert background['backgroundPlayer'] is True, background
        assert background['hasVideo'] is True, background
        assert background['expandAvailable'] is True, background

        expand = page.evaluate('window.__OSTV.playerAction()')
        assert expand['kind'] == 'TAP_EXPAND', expand
        assert expand['x'] > 0 and expand['y'] > 0, expand

        # Emulate the result of Android's native MotionEvent on Orange's own
        # BackgroundToExpanded button, then verify final success stays strict.
        page.evaluate("""() => {
          document.getElementById('expand-player').addEventListener('click', () => {
            document.querySelector('[data-testid="player-container"]').setAttribute('mode','expanded');
            document.querySelector('[data-testid="base-overlay-container"]').setAttribute('mode','expanded');
            const pause=document.createElement('div');
            pause.setAttribute('data-testid','IconPlayerPause');
            document.body.appendChild(pause);
          });
          document.getElementById('expand-player').click();
        }""")
        expanded = page.evaluate('window.__OSTV.pageState()')
        assert expanded['playerShell'] is True and expanded['mode'] == 'expanded', expanded
        assert page.evaluate('window.__OSTV.playerAction().kind') == 'PLAYING'

        # Existing expanded-player regression remains covered.
        load(page, 'player.html')
        state = page.evaluate('window.__OSTV.pageState()')
        assert state['playerShell'] is True and state['hasVideo'] is True, state
        action = page.evaluate('window.__OSTV.playerAction()')
        assert action['kind'] == 'PLAYING', action

        browser.close()
    print('PASS: channel activation + background -> expanded Orange player regression')


if __name__ == '__main__':
    main()
