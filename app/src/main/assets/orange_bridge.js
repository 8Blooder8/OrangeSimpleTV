(function () {
  'use strict';
  if (window.__OSTV && window.__OSTV.version >= 11) return;

  var CHANNEL_CARD = '[data-testid="Channel-ChannelWrapper"]';
  var PLAYER_CONTAINER = '[data-testid="player-container"]';
  var PLAYER_VIDEO = '#video-player';
  var EXPAND_ICON = '[data-testid="IconPlayerScroll"]';

  function norm(s) {
    var x = String(s || '').toLowerCase();
    try { if (x.normalize) x = x.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (_) {}
    return x.replace(/\s+/g, ' ').trim();
  }

  function canonicalChannel(s) {
    return norm(s).replace(/\bhd\b/g, '').replace(/[^a-z0-9]+/g, '').trim();
  }

  function rectOf(e) {
    try { return e && e.getBoundingClientRect ? e.getBoundingClientRect() : null; } catch (_) { return null; }
  }

  function styleOf(e) {
    try { return e ? getComputedStyle(e) : null; } catch (_) { return null; }
  }

  function visible(e) {
    var r = rectOf(e), s = styleOf(e);
    if (!r || !s) return false;
    return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0' &&
      r.width > 3 && r.height > 3 && r.bottom > 0 && r.right > 0 &&
      r.top < innerHeight && r.left < innerWidth;
  }

  function channelName(card) {
    if (!card) return '';
    try {
      var titled = card.querySelector('[title]');
      if (titled) {
        var title = String(titled.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
        if (title) return title;
      }
      var img = card.querySelector('img[alt]');
      if (img) {
        var alt = String(img.getAttribute('alt') || '').replace(/\s+/g, ' ').trim();
        if (alt) return alt;
      }
      return String(card.innerText || card.textContent || '').split(/\n+/)[0].replace(/\s+/g, ' ').trim();
    } catch (_) { return ''; }
  }

  function channelLogo(card) {
    try {
      var img = card && card.querySelector('img');
      return img ? String(img.currentSrc || img.src || img.getAttribute('src') || '') : '';
    } catch (_) { return ''; }
  }

  function collectChannels() {
    var cards = [];
    try { cards = [].slice.call(document.querySelectorAll(CHANNEL_CARD)); } catch (_) {}
    var out = [], seen = Object.create(null);
    for (var i = 0; i < cards.length; i++) {
      var name = channelName(cards[i]), key = canonicalChannel(name);
      if (!name || !key || seen[key]) continue;
      seen[key] = true;
      out.push({ name: name, number: out.length + 1, key: key, logo: channelLogo(cards[i]) });
    }
    return out;
  }

  function discoverChannels() {
    var channels = collectChannels();
    return {
      channels: channels,
      count: channels.length,
      href: location.href,
      routeOk: /\/channels(?:[/?#]|$)/i.test(location.href) || !!document.querySelector('[data-testid="channels-screen-container"]')
    };
  }

  function scoreChannel(candidate, wanted) {
    var c = canonicalChannel(candidate), w = canonicalChannel(wanted);
    if (!c || !w) return -1;
    if (c === w) return 100000;
    if (c.indexOf(w) === 0 || w.indexOf(c) === 0) return 90000 - Math.abs(c.length - w.length);
    if (c.indexOf(w) >= 0) return 70000 - (c.length - w.length);
    return -1;
  }

  function findChannelCard(names) {
    var cards = [].slice.call(document.querySelectorAll(CHANNEL_CARD));
    var best = null, bestScore = -1, bestName = '';
    for (var i = 0; i < cards.length; i++) {
      var name = channelName(cards[i]);
      if (!name) continue;
      for (var j = 0; j < names.length; j++) {
        var score = scoreChannel(name, names[j]);
        if (score > bestScore) {
          bestScore = score;
          best = cards[i];
          bestName = name;
        }
      }
    }
    return (!best || bestScore < 0) ? null : { card: best, name: bestName, score: bestScore };
  }

  function channelTarget(card) {
    if (!card) return null;
    var img = card.querySelector('img[alt]');
    if (img && visible(img)) return img;
    var first = card.firstElementChild;
    if (first && visible(first)) return first;
    return card;
  }

  function nodeDebug(node) {
    if (!node) return 'null';
    var tag = String(node.tagName || '').toLowerCase(), cls = '', alt = '';
    try { cls = String(node.className || '').split(/\s+/).filter(Boolean).slice(0, 2).join('.'); } catch (_) {}
    try { alt = String(node.getAttribute && (node.getAttribute('alt') || node.getAttribute('title')) || ''); } catch (_) {}
    return tag + (cls ? '.' + cls : '') + (alt ? '[' + alt + ']' : '');
  }

  function makeMouseEvent(type, x, y) {
    var opts = {
      bubbles: true, cancelable: true, composed: true, view: window,
      clientX: x, clientY: y, screenX: x, screenY: y,
      button: 0, buttons: type.indexOf('down') >= 0 ? 1 : 0
    };
    try {
      if (typeof PointerEvent === 'function' && type.indexOf('pointer') === 0) {
        opts.pointerId = 1;
        opts.pointerType = 'mouse';
        opts.isPrimary = true;
        return new PointerEvent(type, opts);
      }
    } catch (_) {}
    try { return new MouseEvent(type, opts); }
    catch (_) {
      var ev = document.createEvent('MouseEvents');
      ev.initMouseEvent(type, true, true, window, 1, x, y, x, y, false, false, false, false, 0, null);
      return ev;
    }
  }

  function dispatchDomActivation(target) {
    if (!target) return { ok: false, debug: 'no-target' };
    var r = rectOf(target);
    if (!r) return { ok: false, debug: 'no-rect' };
    var x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2;
    var events = ['pointerover','pointerenter','mouseover','mouseenter','pointerdown','mousedown','pointerup','mouseup','click'];
    var fired = [];
    for (var i = 0; i < events.length; i++) {
      try { target.dispatchEvent(makeMouseEvent(events[i], x, y)); fired.push(events[i]); } catch (_) {}
    }
    return { ok: fired.indexOf('click') >= 0, debug: nodeDebug(target) + '; events=' + fired.join(',') };
  }

  function fakeReactEvent(node, originalTarget) {
    return {
      type: 'click', target: originalTarget || node, currentTarget: node,
      button: 0, buttons: 0, defaultPrevented: false,
      nativeEvent: { type: 'click', target: originalTarget || node, isTrusted: false },
      preventDefault: function () { this.defaultPrevented = true; },
      stopPropagation: function () {}, persist: function () {},
      isPropagationStopped: function () { return false; },
      isDefaultPrevented: function () { return !!this.defaultPrevented; }
    };
  }

  function reactClickHandler(target, card) {
    var nodes = [], cur = target;
    while (cur) {
      nodes.push(cur);
      if (cur === card) break;
      cur = cur.parentElement;
    }
    if (card && card.firstElementChild && nodes.indexOf(card.firstElementChild) < 0) nodes.unshift(card.firstElementChild);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i], keys = [];
      try { keys = Object.getOwnPropertyNames(n); } catch (_) {}
      for (var j = 0; j < keys.length; j++) {
        var k = keys[j], props = null;
        try {
          if (k.indexOf('__reactProps$') === 0) props = n[k];
          else if (k.indexOf('__reactFiber$') === 0 && n[k] && n[k].memoizedProps) props = n[k].memoizedProps;
        } catch (_) {}
        if (props && typeof props.onClick === 'function') {
          return { node: n, fn: props.onClick, source: k.indexOf('__reactProps$') === 0 ? 'props' : 'fiber' };
        }
      }
    }
    return null;
  }

  function invokeReactActivation(target, card) {
    var h = reactClickHandler(target, card);
    if (!h) return { ok: false, debug: 'no-react-onClick;' + nodeDebug(target) };
    try {
      h.fn.call(undefined, fakeReactEvent(h.node, target));
      return { ok: true, debug: 'react-' + h.source + '@' + nodeDebug(h.node) + '; target=' + nodeDebug(target) };
    } catch (e) {
      return { ok: false, debug: 'react-error:' + String(e) + '@' + nodeDebug(h.node) };
    }
  }

  function inspectChannel(names) {
    names = Array.isArray(names) ? names : [names];
    var found = findChannelCard(names);
    if (!found) return { kind: 'NOT_FOUND', debug: 'cards=' + document.querySelectorAll(CHANNEL_CARD).length + '; wanted=' + names.join('|') };
    var card = found.card, target = channelTarget(card), r = rectOf(target), cr = rectOf(card), h = reactClickHandler(target, card);
    return {
      kind: 'FOUND', name: found.name, score: found.score,
      target: nodeDebug(target), card: nodeDebug(card),
      targetRect: r ? { left: r.left, top: r.top, width: r.width, height: r.height } : null,
      cardRect: cr ? { left: cr.left, top: cr.top, width: cr.width, height: cr.height } : null,
      reactOnClick: !!h, reactSource: h ? h.source : ''
    };
  }

  function activateChannel(names, attempt) {
    names = Array.isArray(names) ? names : [names];
    attempt = Number(attempt || 0);
    var found = findChannelCard(names);
    if (!found) return { kind: 'NOT_FOUND', debug: 'cards=' + document.querySelectorAll(CHANNEL_CARD).length + '; wanted=' + names.join('|') };
    var card = found.card;
    if (!visible(card)) {
      try { card.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' }); }
      catch (_) { try { card.scrollIntoView(); } catch (_) {} }
      return { kind: 'SCROLLED', debug: found.name };
    }
    var target = channelTarget(card);
    if (!target) return { kind: 'NOT_FOUND', debug: 'no-target:' + found.name };
    var r = rectOf(target);
    if (!r) return { kind: 'NOT_FOUND', debug: 'no-target-rect:' + found.name };
    if (attempt === 0) {
      return { kind: 'NATIVE_TAP', x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2, vw: innerWidth, vh: innerHeight, debug: found.name + '; target=' + nodeDebug(target) };
    }
    if (attempt === 1) {
      var dom = dispatchDomActivation(target);
      return { kind: dom.ok ? 'DOM_EVENTS' : 'ACTIVATION_FAILED', debug: found.name + '; ' + dom.debug };
    }
    if (attempt === 2) {
      var react = invokeReactActivation(target, card);
      return { kind: react.ok ? 'REACT_ONCLICK' : 'ACTIVATION_FAILED', debug: found.name + '; ' + react.debug };
    }
    try {
      var clickNode = card.firstElementChild || target;
      if (clickNode && typeof clickNode.click === 'function') {
        clickNode.click();
        return { kind: 'ELEMENT_CLICK', debug: found.name + '; target=' + nodeDebug(clickNode) };
      }
    } catch (e) { return { kind: 'ACTIVATION_FAILED', debug: 'click-error:' + String(e) }; }
    return { kind: 'ACTIVATION_FAILED', debug: 'no-strategy:' + attempt + '; ' + found.name };
  }

  function bestChannel(names) {
    names = Array.isArray(names) ? names : [names];
    var found = findChannelCard(names);
    if (!found) return { kind: 'NOT_FOUND', debug: 'cards=' + document.querySelectorAll(CHANNEL_CARD).length + '; wanted=' + names.join('|') };
    var card = found.card, target = channelTarget(card);
    if (!visible(card)) {
      try { card.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' }); } catch (_) { try { card.scrollIntoView(); } catch (_) {} }
      return { kind: 'SCROLLED', debug: found.name };
    }
    var r = rectOf(target);
    return r ? { kind: 'TAP', x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2, vw: innerWidth, vh: innerHeight, debug: found.name + '; target=' + nodeDebug(target) }
             : { kind: 'NOT_FOUND', debug: 'no-target-rect:' + found.name };
  }

  function playerElements() {
    var container = document.querySelector(PLAYER_CONTAINER);
    var video = document.querySelector(PLAYER_VIDEO);
    var mode = container ? String(container.getAttribute('mode') || '') : '';
    var pauseIcon = document.querySelector('[data-testid="IconPlayerPause"]');
    var playIcon = document.querySelector('[data-testid="IconPlayerPlay"], [data-testid="IconPlayerResume"]');
    var expandIcon = document.querySelector(EXPAND_ICON);
    return { container: container, video: video, mode: mode, pauseIcon: pauseIcon, playIcon: playIcon, expandIcon: expandIcon };
  }

  function buttonAncestor(e) {
    var cur = e;
    for (var i = 0; cur && i < 6; i++, cur = cur.parentElement) {
      if (cur.matches && cur.matches('button,[role="button"],a,[tabindex]:not([tabindex="-1"])')) return cur;
    }
    return e;
  }

  function pageState() {
    var p = playerElements();
    var expanded = !!(p.container && p.mode === 'expanded');
    var background = !!(p.container && p.mode === 'background');
    var hasBlob = !!(p.video && /^blob:https:\/\/tvgo\.orange\.pl\//i.test(String(p.video.getAttribute('src') || p.video.src || '')));
    var playing = false;
    if (p.video) {
      try { playing = !p.video.paused && !p.video.ended && (p.video.readyState >= 2 || p.video.currentTime > 0); } catch (_) {}
    }
    if (expanded && p.pauseIcon) playing = true;
    return {
      href: location.href,
      playerShell: expanded,
      hasPlayerContainer: !!p.container,
      backgroundPlayer: background,
      mode: p.mode,
      hasVideo: !!p.video,
      hasBlob: hasBlob,
      playing: playing,
      hasPauseIcon: !!p.pauseIcon,
      hasPlayIcon: !!p.playIcon,
      expandAvailable: !!(background && p.expandIcon),
      channelCards: document.querySelectorAll(CHANNEL_CARD).length
    };
  }

  function playerAction() {
    var state = pageState(), p = playerElements();

    // Orange TV Go /channels can legitimately keep the official player in
    // mode=background. This is an intermediate state, not a failed channel click.
    // Reach the normal full player through Orange's own BackgroundToExpanded control.
    if (state.backgroundPlayer) {
      if (!p.expandIcon) return { kind: 'WAIT', debug: 'background; no IconPlayerScroll' };
      var expandTarget = buttonAncestor(p.expandIcon);
      if (!expandTarget || !visible(expandTarget)) return { kind: 'WAIT', debug: 'background; IconPlayerScroll not visible' };
      var er = rectOf(expandTarget);
      return {
        kind: 'TAP_EXPAND',
        x: (er.left + er.right) / 2,
        y: (er.top + er.bottom) / 2,
        vw: innerWidth,
        vh: innerHeight,
        debug: 'background->expanded via IconPlayerScroll'
      };
    }

    if (!state.playerShell) return { kind: 'NOT_PLAYER', debug: 'mode=' + state.mode + '; cards=' + state.channelCards };
    if (state.playing) return { kind: 'PLAYING', debug: 'expanded; pause=' + state.hasPauseIcon + '; blob=' + state.hasBlob };

    if (p.playIcon) {
      var target = buttonAncestor(p.playIcon);
      if (target && visible(target)) {
        var r = rectOf(target);
        return { kind: 'TAP_PLAY', x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2, vw: innerWidth, vh: innerHeight, debug: 'IconPlayerPlay' };
      }
    }
    if (p.video) {
      try {
        var promise = p.video.play();
        if (promise && promise.catch) promise.catch(function () {});
        return { kind: 'PLAY_REQUESTED', debug: 'video.play()' };
      } catch (e) { return { kind: 'WAIT', debug: 'play-error:' + String(e) }; }
    }
    return { kind: 'WAIT', debug: 'expanded-without-video' };
  }

  function saveStyle(e, key) {
    if (!e || !e.dataset) return;
    if (typeof e.dataset[key] === 'undefined') e.dataset[key] = e.getAttribute('style') || '__NONE__';
  }

  function restoreStyle(e, key) {
    if (!e || !e.dataset || typeof e.dataset[key] === 'undefined') return;
    var old = e.dataset[key];
    delete e.dataset[key];
    if (old === '__NONE__') e.removeAttribute('style'); else e.setAttribute('style', old);
  }

  function markHidden(e) {
    if (!e) return;
    saveStyle(e, 'ostvHiddenStyle');
    e.setAttribute('data-ostv-hidden', '1');
    e.style.setProperty('display', 'none', 'important');
  }

  function enterCleanPlayer() {
    var p = playerElements();
    if (!p.container || p.mode !== 'expanded' || !p.video) return false;
    var wrapper = document.getElementById('player-wrapper') || p.container.parentElement;
    if (!wrapper) return false;

    saveStyle(wrapper, 'ostvWrapperStyle');
    saveStyle(p.container, 'ostvContainerStyle');
    saveStyle(p.video, 'ostvVideoStyle');

    if (wrapper.parentElement) {
      [].slice.call(wrapper.parentElement.children).forEach(function (sib) { if (sib !== wrapper) markHidden(sib); });
    }
    [].slice.call(wrapper.children).forEach(function (sib) { if (sib !== p.container) markHidden(sib); });
    [].slice.call(p.container.children).forEach(function (sib) { if (sib !== p.video) markHidden(sib); });

    wrapper.setAttribute('data-ostv-wrapper', '1');
    p.container.setAttribute('data-ostv-player-container', '1');
    p.video.setAttribute('data-ostv-player-video', '1');

    [wrapper, p.container].forEach(function (e) {
      e.style.setProperty('position', 'fixed', 'important');
      e.style.setProperty('left', '0', 'important');
      e.style.setProperty('top', '0', 'important');
      e.style.setProperty('right', '0', 'important');
      e.style.setProperty('bottom', '0', 'important');
      e.style.setProperty('width', '100vw', 'important');
      e.style.setProperty('height', '100vh', 'important');
      e.style.setProperty('margin', '0', 'important');
      e.style.setProperty('padding', '0', 'important');
      e.style.setProperty('overflow', 'hidden', 'important');
      e.style.setProperty('background', '#000', 'important');
      e.style.setProperty('transform', 'none', 'important');
    });
    wrapper.style.setProperty('z-index', '2147483646', 'important');
    p.container.style.setProperty('z-index', '2147483647', 'important');
    p.video.controls = false;
    p.video.style.setProperty('position', 'absolute', 'important');
    p.video.style.setProperty('inset', '0', 'important');
    p.video.style.setProperty('width', '100%', 'important');
    p.video.style.setProperty('height', '100%', 'important');
    p.video.style.setProperty('max-width', 'none', 'important');
    p.video.style.setProperty('max-height', 'none', 'important');
    p.video.style.setProperty('object-fit', 'contain', 'important');
    p.video.style.setProperty('background', '#000', 'important');
    p.video.style.setProperty('visibility', 'visible', 'important');
    p.video.style.setProperty('pointer-events', 'none', 'important');
    document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    if (document.body) document.body.style.setProperty('overflow', 'hidden', 'important');
    return true;
  }

  function restoreCleanPlayer() {
    var v = document.querySelector('[data-ostv-player-video="1"]');
    if (v) { v.removeAttribute('data-ostv-player-video'); restoreStyle(v, 'ostvVideoStyle'); }
    var c = document.querySelector('[data-ostv-player-container="1"]');
    if (c) { c.removeAttribute('data-ostv-player-container'); restoreStyle(c, 'ostvContainerStyle'); }
    var w = document.querySelector('[data-ostv-wrapper="1"]');
    if (w) { w.removeAttribute('data-ostv-wrapper'); restoreStyle(w, 'ostvWrapperStyle'); }
    [].slice.call(document.querySelectorAll('[data-ostv-hidden="1"]')).forEach(function (e) {
      e.removeAttribute('data-ostv-hidden');
      restoreStyle(e, 'ostvHiddenStyle');
    });
    document.documentElement.style.removeProperty('overflow');
    if (document.body) document.body.style.removeProperty('overflow');
    return true;
  }

  function controlPlayback(mode) {
    var p = playerElements(), v = p.video;
    if (!v || p.mode !== 'expanded') return { ok: false, state: 'NO_ACTIVE_VIDEO' };
    mode = String(mode || 'toggle').toLowerCase();
    try {
      if (mode === 'pause' || (mode === 'toggle' && !v.paused)) {
        v.pause();
        return { ok: true, state: 'PAUSED' };
      }
      var promise = v.play();
      if (promise && promise.catch) promise.catch(function () {});
      return { ok: true, state: 'PLAY_REQUESTED' };
    } catch (e) { return { ok: false, state: 'ERROR', debug: String(e) }; }
  }

  window.__OSTV = {
    version: 11,
    normalize: norm,
    canonicalChannel: canonicalChannel,
    discoverChannels: discoverChannels,
    bestChannel: bestChannel,
    inspectChannel: inspectChannel,
    activateChannel: activateChannel,
    pageState: pageState,
    playerAction: playerAction,
    enterCleanPlayer: enterCleanPlayer,
    restoreCleanPlayer: restoreCleanPlayer,
    controlPlayback: controlPlayback
  };
})();
