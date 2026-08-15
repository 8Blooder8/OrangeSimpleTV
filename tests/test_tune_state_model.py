"""Deterministic state-model regression tests for v0.17 tune semantics."""
from dataclasses import dataclass

@dataclass
class Tune:
    session: int = 0
    active: bool = False
    terminal: bool = False
    channel_activated: bool = False
    clicks: int = 0
    site_compat_retries: int = 0
    result: str = "IDLE"

    def start(self):
        self.session += 1
        self.active = True
        self.terminal = False
        self.channel_activated = False
        self.clicks = 0
        self.site_compat_retries = 0
        self.result = "CHANNEL_ACTIVATING"
        return self.session

    def valid(self, sid):
        return self.active and not self.terminal and sid == self.session

    def callback(self, sid, event, *, native=False, eme_done=False, eme_accepted=0):
        if not self.valid(sid):
            return "STALE"
        if event == "CLICK":
            if self.channel_activated:
                return "NO_RECLICK"
            self.clicks += 1
            self.result = "CHANNEL_CLICKED"
        elif event == "PLAYER_SHELL":
            self.channel_activated = True
            self.result = "MEDIA_INIT"
        elif event == "PLAYING":
            self.channel_activated = True
            self.result = "PLAYING"
            self.terminal = True
            self.active = False
        elif event == "WV_REJECTED" and eme_done and eme_accepted == 0:
            self.result = "WEBVIEW_EME_REJECTED" if native else "DRM_WIDEVINE_UNAVAILABLE"
            self.terminal = True
            self.active = False
        elif event == "CHANNELS_EMPTY":
            if self.channel_activated:
                return "NO_SITE_RETRY"
            self.site_compat_retries += 1
            self.result = "SITE_COMPAT_RETRY"
        elif event == "DEADLINE":
            self.result = "TUNE_TIMEOUT"
            self.terminal = True
            self.active = False
        return self.result

# 1 immediate playback
t=Tune(); s=t.start(); t.callback(s,"CLICK"); t.callback(s,"PLAYER_SHELL"); assert t.callback(s,"PLAYING")=="PLAYING"
# 2 Widevine rejection is terminal
t=Tune(); s=t.start(); t.callback(s,"CLICK"); t.callback(s,"PLAYER_SHELL"); assert t.callback(s,"WV_REJECTED",native=False,eme_done=True)=="DRM_WIDEVINE_UNAVAILABLE"; assert t.callback(s,"CLICK")=="STALE"
# 3 no channel re-click after player activation
t=Tune(); s=t.start(); t.callback(s,"CLICK"); t.callback(s,"PLAYER_SHELL"); assert t.callback(s,"CLICK")=="NO_RECLICK"; assert t.clicks==1
# 4 stale old callback ignored
t=Tune(); old=t.start(); new=t.start(); assert old != new; assert t.callback(old,"PLAYER_SHELL")=="STALE"; assert not t.channel_activated
# 5 reload/page callback preserves one session
t=Tune(); s=t.start(); assert t.callback(s,"CHANNELS_EMPTY")=="SITE_COMPAT_RETRY"; assert t.session==s
# 6 DOM churn after activation does not return to site retry
t=Tune(); s=t.start(); t.callback(s,"PLAYER_SHELL"); assert t.callback(s,"CHANNELS_EMPTY")=="NO_SITE_RETRY"; assert t.site_compat_retries==0
# 7 deadline is terminal
t=Tune(); s=t.start(); assert t.callback(s,"DEADLINE")=="TUNE_TIMEOUT"; assert t.callback(s,"PLAYER_SHELL")=="STALE"
# 8 native-Widevine-false + EME reject does not rotate UA
t=Tune(); s=t.start(); t.callback(s,"PLAYER_SHELL"); t.callback(s,"WV_REJECTED",native=False,eme_done=True); assert t.site_compat_retries==0
# 9 native Widevine true + EME reject has separate class
t=Tune(); s=t.start(); t.callback(s,"PLAYER_SHELL"); assert t.callback(s,"WV_REJECTED",native=True,eme_done=True)=="WEBVIEW_EME_REJECTED"
# 10 delayed playback remains possible before deadline
t=Tune(); s=t.start(); t.callback(s,"CLICK"); t.callback(s,"PLAYER_SHELL"); assert not t.terminal; assert t.callback(s,"PLAYING")=="PLAYING"

print('PASS: v0.17 tune state model (10 regression scenarios)')
