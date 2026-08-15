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

        load(page, 'player.html')
        state = page.evaluate('window.__OSTV.pageState()')
        assert state['playerShell'] is True and state['hasVideo'] is True, state
        action = page.evaluate('window.__OSTV.playerAction()')
        assert action['kind'] == 'PLAYING', action

        browser.close()
    print('PASS: real-snapshot DOM tests')


if __name__ == '__main__':
    main()
