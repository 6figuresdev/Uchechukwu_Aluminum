/* ==========================================================================
   Uchechukwu Aluminum – page behaviour
   ========================================================================== */
(function () {
  'use strict';
  var UA = window.UA, cfg = UA.config;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); };
  var byId = {};
  UA.products.forEach(function (p) { byId[p.id] = p; });

  /* ---------- contact links ---------- */
  $$('[data-tel]').forEach(function (a) { a.href = 'tel:+' + cfg.phoneIntl; });
  $$('[data-wa]').forEach(function (a) { a.href = 'https://wa.me/' + cfg.phoneIntl; });
  $$('[data-phone-text]').forEach(function (el) { el.textContent = cfg.phoneDisplay; });

  /* ---------- hero slider ---------- */
  var heroEl = $('#heroSlider'), hero = null;
  if (heroEl) {
    heroEl.insertAdjacentHTML('afterbegin', UA.hero.map(function (id) {
      var p = byId[id];
      return '<figure class="slide"><img src="' + esc(p.photos[0]) + '" alt="' + esc(p.name) + '" draggable="false"' +
        (p.pos ? ' style="object-position:' + p.pos + '"' : '') + '>' +
        '<figcaption><span>' + esc(p.name) + '</span><button type="button" class="pill" data-open="' + p.id + '">View photos</button></figcaption></figure>';
    }).join(''));

    var dots = $('#heroDots');
    dots.innerHTML = UA.hero.map(function (id, i) {
      return '<button type="button" class="dot" data-i="' + i + '" aria-label="Show ' + esc(byId[id].name) + '"></button>';
    }).join('');

    var setDots = function (i) {
      $$('.dot', dots).forEach(function (d, n) {
        d.classList.toggle('on', n === i);
        d.setAttribute('aria-current', n === i ? 'true' : 'false');
      });
    };
    var restartDot = function () {                // restart the progress fill
      var d = $('.dot.on', dots);
      if (!d) return;
      d.classList.remove('on'); void d.offsetWidth; d.classList.add('on');
    };

    heroEl.style.setProperty('--iv', '5600ms');
    hero = new UA.Slider(heroEl, { interval: 5600, onChange: setDots, onPlay: restartDot });
    setDots(0);

    dots.addEventListener('click', function (e) {
      var b = e.target.closest('.dot'); if (b) hero.go(+b.dataset.i, true);
    });
    $('#heroPrev').addEventListener('click', function () { hero.back(true); });
    $('#heroNext').addEventListener('click', function () { hero.next(true); });
    heroEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') hero.back(true);
      if (e.key === 'ArrowRight') hero.next(true);
    });

    /* don't spin while off-screen or while the lightbox is open */
    if ('IntersectionObserver' in window) {
      var held = false;
      new IntersectionObserver(function (es) {
        var vis = es[0].isIntersecting;
        if (!vis && !held) { hero.hold(); held = true; }
        if (vis && held) { hero.release(); held = false; }
      }, { threshold: 0.2 }).observe(heroEl);
    }
    UA.Lightbox.onOpen = function () { hero.hold(); };
    UA.Lightbox.onClose = function () { hero.release(); };
  }

  /* ---------- product rail ---------- */
  var rail = $('#rail'), railBar = $('#railBar span'), filter = 'all';

  function cardHTML(p, i) {
    var n = p.photos.length;
    return '<article class="card" style="--i:' + i + '">' +
      '<button type="button" class="card-img" data-open="' + p.id + '" aria-label="View ' + esc(p.name) + ' photos">' +
      '<img src="' + esc(p.photos[0]) + '" alt="' + esc(p.name) + '" loading="lazy" draggable="false"' + (p.pos ? ' style="object-position:' + p.pos + '"' : '') + '>' +
      (n > 1 ? '<span class="badge">' + n + ' photos</span>' : '') + '</button>' +
      '<div class="card-body"><h3>' + esc(p.name) + '</h3><p>' + esc(p.text) + '</p></div></article>';
  }

  function renderRail() {
    var list = UA.products.filter(function (p) { return filter === 'all' || p.cat === filter; });
    rail.innerHTML = list.map(cardHTML).join('');
    rail.scrollLeft = 0;
    updateRail();
  }

  function updateRail() {
    var sw = rail.scrollWidth, cw = rail.clientWidth, sl = rail.scrollLeft;
    var scrollable = sw > cw + 4;
    railBar.parentNode.hidden = !scrollable;
    railBar.style.width = (cw / sw * 100) + '%';
    railBar.style.left = (sl / sw * 100) + '%';
    $('#railPrev').disabled = sl < 4;
    $('#railNext').disabled = sl > sw - cw - 4;
  }

  $('#filters').innerHTML = UA.categories.map(function (c) {
    return '<button type="button" class="chip" data-f="' + c.id + '" aria-pressed="' + (c.id === 'all') + '">' + esc(c.label) + '</button>';
  }).join('');

  function setFilter(f) {
    filter = f;
    $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.f === f); });
    renderRail();
  }
  $('#filters').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (b) setFilter(b.dataset.f);
  });
  $$('[data-filter]').forEach(function (a) {
    a.addEventListener('click', function () { setFilter(a.dataset.filter); });
  });

  var step = function (dir) {
    var card = $('.card', rail), w = card ? card.offsetWidth + 20 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * w * 2, behavior: reduce ? 'auto' : 'smooth' });
  };
  $('#railPrev').addEventListener('click', function () { step(-1); });
  $('#railNext').addEventListener('click', function () { step(1); });
  rail.addEventListener('scroll', function () { window.requestAnimationFrame(updateRail); }, { passive: true });
  window.addEventListener('resize', updateRail);

  /* mouse drag-to-scroll (touch already swipes natively) */
  var down = null, ignoreClick = false;
  rail.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = { x: e.clientX, left: rail.scrollLeft, moved: false };
  });
  window.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - down.x;
    if (!down.moved && Math.abs(dx) > 5) { down.moved = true; rail.classList.add('grabbing'); }
    if (down.moved) rail.scrollLeft = down.left - dx;
  });
  window.addEventListener('pointerup', function () {
    if (!down) return;
    if (down.moved) { ignoreClick = true; setTimeout(function () { ignoreClick = false; }, 0); }
    down = null; rail.classList.remove('grabbing');
  });
  rail.addEventListener('click', function (e) {
    if (ignoreClick) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  renderRail();

  /* ---------- open the lightbox from anywhere ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open]');
    if (b) UA.Lightbox.open(b.dataset.open, 0);
  });

  /* ---------- quote form -> WhatsApp ---------- */
  var sel = $('select[name=product]');
  sel.insertAdjacentHTML('beforeend', UA.products.map(function (p) {
    return '<option>' + esc(p.name) + '</option>';
  }).join('') + '<option>Something else</option>');

  $('#quoteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target.elements, err = $('#formErr');
    var name = f.name.value.trim(), prod = f.product.value;
    if (!name || !prod) { err.hidden = false; return; }
    err.hidden = true;
    var m = 'Hello ' + cfg.name + ', my name is ' + name + '. I need: ' + prod + '.';
    if (f.size.value.trim()) m += ' Approximate size: ' + f.size.value.trim() + '.';
    if (f.loc.value.trim()) m += ' Location: ' + f.loc.value.trim() + '.';
    window.open('https://wa.me/' + cfg.phoneIntl + '?text=' + encodeURIComponent(m), '_blank', 'noopener');
  });

  /* ---------- mobile menu ---------- */
  var nav = $('#nav'), menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- scroll: header, reveal, parallax ---------- */
  var header = $('.site-header');
  var par = $$('[data-parallax]');
  var ticking = false;

  function onScroll() {
    ticking = false;
    header.classList.toggle('stuck', window.scrollY > 8);
    if (reduce) return;
    var vh = window.innerHeight;
    par.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax);
      el.style.setProperty('--py', off.toFixed(1) + 'px');
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  var rev = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    rev.forEach(function (el) { io.observe(el); });
  } else {
    rev.forEach(function (el) { el.classList.add('in'); });
  }

  $('#yr').textContent = new Date().getFullYear();
})();
