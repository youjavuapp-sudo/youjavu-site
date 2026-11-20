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

// ---- YouJavu Town (hero): coaster cart, gentle parallax, clickable buildings, peeking Moods ----
(function () {
  'use strict';
  var town = document.getElementById('town');
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phoneQ = window.matchMedia('(max-width: 700px)');
  var fineQ = window.matchMedia('(hover: hover) and (pointer: fine)');

  // Turkish visitors meet Chef Turkey in the café.
  if (/^tr\b/i.test(navigator.language || '')) {
    var tc = document.querySelector('.stage-tc');
    if (tc) {
      tc.querySelector('.chef-peek').src = '/img/town/chef_turkey_wave.webp';
      tc.querySelector('.chef-cheer').src = '/img/town/chef_turkey_cheer.webp';
      tc.querySelector('.bubble').textContent = 'Kafeme hoş geldin!';
    }
  }

  // Moods peek over the cards when they scroll into view.
  var peeks = document.querySelectorAll('.has-peek');
  if ('IntersectionObserver' in window && !calm) {
    var po = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('seen'); po.unobserve(e.target); } });
    }, { threshold: 0.35 });
    Array.prototype.forEach.call(peeks, function (p) { po.observe(p); });
  } else {
    Array.prototype.forEach.call(peeks, function (p) { p.classList.add('seen'); });
  }

  if (!town) return;

  // Clickable buildings: show the name, then glide down to that game.
  Array.prototype.forEach.call(town.querySelectorAll('.spot'), function (spot) {
    var layer = spot.closest('.layer');
    spot.addEventListener('mouseenter', function () { layer.classList.add('hot'); });
    spot.addEventListener('mouseleave', function () { layer.classList.remove('hot'); });
    spot.addEventListener('focus', function () { layer.classList.add('hot'); });
    spot.addEventListener('blur', function () { layer.classList.remove('hot'); });
    spot.addEventListener('click', function (e) {
      var card = document.getElementById(spot.dataset.game);
      if (!card) return;
      e.preventDefault();
      spot.classList.add('tapped'); layer.classList.add('hot');
      setTimeout(function () {
        card.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
        spot.classList.remove('tapped'); layer.classList.remove('hot');
        card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
      }, calm ? 0 : 450);
    });
  });

  // Coaster track centre lines from Astra (x, y on the 2400x1350 / 1080x1600 pictures).
  var DESK = [1,962,103,974,206,976,308,964,407,935,500,891,584,832,658,761,712,674,689,581,595,542,493,537,391,551,293,582,203,632,163,719,246,772,349,777,450,760,547,727,639,681,726,625,807,562,883,494,956,421,1025,344,1097,271,1181,212,1276,174,1378,163,1480,178,1575,217,1661,273,1742,335,1832,387,1929,418,2032,420,2130,392,2223,347,2310,294,2396,236];
  var PHONE = [0,760,48,765,96,765,145,761,192,753,239,740,283,721,322,693,349,653,348,606,314,573,267,560,219,558,171,564,125,579,87,608,78,653,118,678,166,675,212,662,256,643,298,619,338,591,374,560,408,525,440,489,473,453,506,418,542,386,584,361,631,352,677,363,719,388,762,409,810,417,858,412,903,397,947,376,989,352,1032,329,1075,308];
  function makePath(a, W, H) {
    var p = [], L = [0];
    for (var i = 0; i < a.length; i += 2) p.push({ x: a[i], y: a[i + 1] });
    for (var j = 1; j < p.length; j++) L.push(L[j - 1] + Math.hypot(p[j].x - p[j - 1].x, p[j].y - p[j - 1].y));
    return { p: p, L: L, total: L[L.length - 1], W: W, H: H };
  }
  var paths = { desk: makePath(DESK, 2400, 1350), phone: makePath(PHONE, 1080, 1600) };
  function at(path, s) {
    s = Math.max(0, Math.min(path.total, s));
    var i = 1; while (i < path.L.length - 1 && path.L[i] < s) i++;
    var a = path.p[i - 1], b = path.p[i], t = (s - path.L[i - 1]) / ((path.L[i] - path.L[i - 1]) || 1);
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  var cart = town.querySelector('.cart');
  var layers = Array.prototype.map.call(town.querySelectorAll('.layer'), function (el) { return { el: el, d: parseFloat(el.dataset.depth) || 0 }; });
  var path = phoneQ.matches ? paths.phone : paths.desk;
  var s = path.total * 0.45, pauseUntil = 0, running = true, looping = false, last = 0;
  var mouse = { x: 0, y: 0 }, cur = { x: 0, y: 0 };

  function placeCart() {
    var d = path.total * 0.012;
    var p = at(path, s), a = at(path, s - d), b = at(path, s + d);
    var dx = b.x - a.x, dy = b.y - a.y, flip = dx < 0;
    var ang = flip ? Math.atan2(-dy, -dx) : Math.atan2(dy, dx);
    cart.style.left = (p.x / path.W * 100) + '%';
    cart.style.top = (p.y / path.H * 100) + '%';
    cart.style.transform = 'translate(-50%, -95.5%) rotate(' + ang.toFixed(3) + 'rad) scaleX(' + (flip ? -1 : 1) + ')';
    return dy / (Math.hypot(dx, dy) || 1);
  }
  function onMedia() { path = phoneQ.matches ? paths.phone : paths.desk; s = path.total * (calm ? 0.72 : 0.45); placeCart(); }
  if (phoneQ.addEventListener) phoneQ.addEventListener('change', onMedia);

  if (calm) { s = path.total * 0.72; placeCart(); cart.classList.add('on'); return; }

  if (fineQ.matches) {
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX / window.innerWidth - 0.5; mouse.y = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { running = es[0].isIntersecting; start(); }).observe(town);
  }

  function start() { if (running && !looping) { looping = true; last = 0; requestAnimationFrame(tick); } }
  function tick(now) {
    if (!running) { looping = false; return; }
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
    // cart
    if (now >= pauseUntil) {
      if (!cart.classList.contains('on')) cart.classList.add('on');
      var slope = placeCart();
      var speed = path.total / 9 * Math.max(0.55, Math.min(1.9, 1 + 0.9 * slope));
      s += speed * dt;
      if (s >= path.total) { cart.classList.remove('on'); pauseUntil = now + 1500; s = 0; }
    }
    // parallax: layers drift with the mouse (computer) and the sky lags when scrolling
    cur.x += (mouse.x - cur.x) * 0.06; cur.y += (mouse.y - cur.y) * 0.06;
    var sy = window.scrollY || 0;
    for (var i = 0; i < layers.length; i++) {
      var L = layers[i];
      var tx = -cur.x * L.d * 2.2, ty = L.d < 0.5 ? sy * (0.5 - L.d) * 0.5 : 0;
      L.el.style.transform = 'translate(' + tx.toFixed(3) + '%,' + ty.toFixed(1) + 'px)';
    }
    requestAnimationFrame(tick);
  }
  placeCart();
  start();
})();
