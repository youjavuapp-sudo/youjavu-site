// YouJavu Studio home page: a short character animation before each game link opens.
// Calm motion setting, middle-click and Ctrl/Cmd-click go straight to the link.
(function () {
  'use strict';
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function box(el, stage) {
    var r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2, w: r.width, h: r.height, W: s.width, H: s.height };
  }
  function later(ms, fn) { return setTimeout(fn, ms); }
  function freeze(el) { el.style.animation = 'none'; }

  function open(href) {
    var external = /^https?:/.test(href);
    var desktop = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (external && desktop) {
      var w = window.open(href, '_blank');
      if (w) { try { w.opener = null; } catch (e) {} return true; }
    }
    window.location.href = href;
    return false;
  }

  // Put a stage back to its starting picture (after a new tab opened, or after Back).
  function reset(stage) {
    var hasCss = typeof CSSAnimation !== 'undefined';
    Array.prototype.forEach.call(stage.querySelectorAll('*'), function (el) {
      if (el.getAnimations) el.getAnimations().forEach(function (a) { if (!hasCss || !(a instanceof CSSAnimation)) a.cancel(); });
      el.style.animation = '';
    });
    Array.prototype.forEach.call(stage.querySelectorAll('.burst i, .shards img, i'), function (n) { n.remove(); });
    var mood = stage.querySelector('.mood'); if (mood) mood.src = '/img/home/ms_dash_free.webp';
    var jar = stage.querySelector('.j-top'); if (jar) jar.src = '/img/home/ms_jar_red_1_intact.webp';
    stage.classList.remove('go', 'talk');
  }

  function sparkle(stage, x, y, count, spread) {
    var layer = stage.querySelector('.burst') || stage;
    var colours = ['#ffd34d', '#ff6fb5', '#7ce0ff', '#9dff8a', '#ffffff'];
    for (var i = 0; i < count; i++) {
      var dot = document.createElement('i');
      dot.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:9px;height:9px;margin:-4px;border-radius:50%;z-index:14;background:' + colours[i % colours.length];
      layer.appendChild(dot);
      var a = (i / count) * Math.PI * 2, d = spread * (0.7 + (i % 3) * 0.15);
      dot.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: 'translate(' + Math.cos(a) * d + 'px,' + Math.sin(a) * d + 'px) scale(.3)', opacity: 0 }
      ], { duration: 650, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
    }
  }

  // ---- Ball Sort Moods: a Mood jumps out of its tube and says hello ----
  function playBallSort(stage) {
    var j = stage.querySelector('.jumper'); freeze(j);
    var b = box(j, stage);
    var tx = b.W * 0.5 - b.x, ty = b.H * 0.6 - b.y;
    j.animate([
      { transform: 'translate(0,0) scale(1,1)' },
      { transform: 'translate(0,' + b.h * 0.08 + 'px) scale(1.18,.78)', offset: 0.14 },
      { transform: 'translate(' + tx * 0.35 + 'px,' + (-b.H * 0.12 - b.y * 0.4) + 'px) rotate(-200deg) scale(1.15)', offset: 0.5 },
      { transform: 'translate(' + tx + 'px,' + ty + 'px) rotate(-360deg) scale(2.3,1.7)', offset: 0.84 },
      { transform: 'translate(' + tx + 'px,' + (ty - b.h * 0.15) + 'px) rotate(-360deg) scale(2)' }
    ], { duration: 950, easing: 'cubic-bezier(.35,.6,.4,1)', fill: 'forwards' });
    var others = stage.querySelectorAll('.tube img:not(.jumper)');
    Array.prototype.forEach.call(others, function (o, i) {
      freeze(o);
      o.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(' + (-b.h * 0.35) + 'px)' }, { transform: 'translateY(0)' }],
        { duration: 380, delay: 780 + (i % 4) * 70, easing: 'ease-out' });
    });
    later(800, function () { stage.classList.add('talk'); sparkle(stage, b.W * 0.5, b.H * 0.6, 16, b.W * 0.32); });
    return 1550;
  }

  // ---- Tile Café Trip: three tiles match, a dish pops, the chef says welcome ----
  function playTile(stage) {
    var tiles = [stage.querySelector('.t1'), stage.querySelector('.t2'), stage.querySelector('.t3')];
    var slots = [stage.querySelector('.s1'), stage.querySelector('.s2'), stage.querySelector('.s3')];
    var mid = box(slots[1], stage);
    tiles.forEach(function (t, i) {
      freeze(t);
      var a = box(t, stage), s = box(slots[i], stage);
      var dx = s.x - a.x, dy = s.y - a.y, mx = mid.x - a.x, my = mid.y - a.y;
      t.animate([
        { transform: 'translate(0,0) scale(1)' },
        { transform: 'translate(' + dx + 'px,' + (dy - a.h * 0.6) + 'px) scale(.95)', offset: 0.6 },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.7)' }
      ], { duration: 420, delay: i * 170, easing: 'ease-out', fill: 'forwards' })
        .finished.then(function () {
          return t.animate([
            { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.7)', opacity: 1 },
            { transform: 'translate(' + mx + 'px,' + my + 'px) scale(.3)', opacity: 0 }
          ], { duration: 230, delay: (2 - i) * 170 + 120, easing: 'ease-in', fill: 'forwards' }).finished;
        }).catch(function () {});
    });
    var dish = stage.querySelector('.dish');
    later(1050, function () {
      sparkle(stage, mid.x, mid.y, 14, mid.W * 0.22);
      dish.animate([
        { opacity: 0, transform: 'translateY(' + (mid.y - mid.H * 0.4) + 'px) scale(.2)' },
        { opacity: 1, transform: 'translateY(0) scale(1.25)', offset: 0.6 },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ], { duration: 520, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'forwards' });
    });
    later(1150, function () {
      stage.querySelector('.chef-peek').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
      stage.querySelector('.chef-cheer').animate([
        { transform: 'translateY(110%)' }, { transform: 'translateY(-6%)', offset: 0.7 }, { transform: 'translateY(0)' }
      ], { duration: 420, easing: 'ease-out', fill: 'forwards' });
    });
    later(1450, function () { stage.classList.add('talk'); });
    return 2250;
  }

  // ---- Moods Smash: the launcher fires a Mood and the jar shatters ----
  function playSmash(stage) {
    var mood = stage.querySelector('.mood'), jar = stage.querySelector('.j-top');
    var plunger = stage.querySelector('.plunger');
    freeze(mood);
    var m = box(mood, stage), j = box(jar, stage);
    var dx = j.x - m.x, dy = j.y - m.y;
    plunger.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(7%)', offset: 0.7 }, { transform: 'translateY(0)' }],
      { duration: 300, easing: 'ease-in-out' });
    later(230, function () {
      mood.src = '/img/home/ms_dash_flying.webp';
      mood.animate([{ transform: 'translate(0,0) rotate(0)' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(30deg)' }],
        { duration: 260, easing: 'cubic-bezier(.5,0,.9,.6)', fill: 'forwards' });
    });
    later(500, function () {
      jar.src = '/img/home/ms_jar_red_1_cracked.webp';
      jar.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-4%)' }, { transform: 'translateX(4%)' }, { transform: 'translateX(0)' }], { duration: 120 });
      mood.src = '/img/home/ms_dash_free.webp';
      mood.animate([
        { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(30deg) scale(1)' },
        { transform: 'translate(' + dx + 'px,' + (dy + m.H * 0.06) + 'px) rotate(380deg) scale(1.5)', offset: 0.5 },
        { transform: 'translate(' + dx + 'px,' + (dy + m.H * 0.03) + 'px) rotate(360deg) scale(1.4)' }
      ], { duration: 700, easing: 'ease-out', fill: 'forwards' });
    });
    later(640, function () {
      jar.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.2)' }], { duration: 120, fill: 'forwards' });
      var layer = stage.querySelector('.shards');
      var pics = ['ms_fx_glass_shard_1', 'ms_fx_glass_shard_2', 'ms_fx_glass_shard_3', 'ms_confetti_1', 'ms_confetti_2'];
      for (var i = 0; i < 14; i++) {
        var p = document.createElement('img');
        p.src = '/img/home/' + pics[i % pics.length] + '.webp'; p.alt = '';
        p.style.left = (j.x - j.W * 0.03) + 'px'; p.style.top = (j.y - j.W * 0.03) + 'px';
        layer.appendChild(p);
        var a = (i / 14) * Math.PI * 2, d = j.W * (0.18 + (i % 4) * 0.05);
        var ex = Math.cos(a) * d, ey = Math.sin(a) * d * 0.7;
        p.animate([
          { transform: 'translate(0,0) rotate(0)', opacity: 1 },
          { transform: 'translate(' + ex + 'px,' + (ey - j.H * 0.08) + 'px) rotate(' + (200 + i * 40) + 'deg)', opacity: 1, offset: 0.45 },
          { transform: 'translate(' + ex * 1.3 + 'px,' + (ey + j.H * 0.45) + 'px) rotate(' + (420 + i * 50) + 'deg)', opacity: 0 }
        ], { duration: 900, easing: 'cubic-bezier(.2,.6,.5,1)', fill: 'forwards' });
      }
      stage.querySelector('.smash-word').animate([
        { opacity: 0, transform: 'scale(.3) rotate(-8deg)' }, { opacity: 1, transform: 'scale(1.2) rotate(-4deg)', offset: 0.5 }, { opacity: 1, transform: 'scale(1) rotate(-4deg)' }
      ], { duration: 380, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'forwards' });
      Array.prototype.forEach.call(stage.querySelectorAll('.j-left,.j-right'), function (s, i) {
        s.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(' + (i ? 7 : -7) + 'deg)' }, { transform: 'rotate(' + (i ? -4 : 4) + 'deg)' }, { transform: 'rotate(0)' }],
          { duration: 500, easing: 'ease-out' });
      });
    });
    return 1750;
  }

  var players = { ballsort: playBallSort, tile: playTile, smash: playSmash };

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[data-play]');
    if (!link || calm) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var game = link.closest('.game');
    var stage = game && game.querySelector('.stage');
    if (!stage || !players[game.dataset.game]) return;
    e.preventDefault();
    var href = link.getAttribute('href');
    var done = function () { if (open(href)) later(500, function () { reset(stage); }); };
    if (stage.classList.contains('go')) { clearTimeout(stage._t); done(); return; } // second tap: don't wait
    stage.classList.add('go');
    var r = stage.getBoundingClientRect(), wait = 0;
    if (r.top < 0 || r.bottom > window.innerHeight) { stage.scrollIntoView({ behavior: 'smooth', block: 'center' }); wait = 420; }
    stage._t = later(wait, function () {
      var ms = players[game.dataset.game](stage);
      stage._t = later(ms, done);
    });
  });

  // Coming back with the Back button: show the stages fresh again.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) Array.prototype.forEach.call(document.querySelectorAll('.stage'), reset);
  });
})();
