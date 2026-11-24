/* ==========================================================================
   Lightbox – full-screen photo viewer with swipe, arrows and thumbnails.
   ========================================================================== */
(function () {
  'use strict';
  var UA = (window.UA = window.UA || {});
  var dlg, main, stage, thumbs, title, count, text, ask, prevB, nextB, slider, product;

  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); };

  function init() {
    if (dlg) return;
    dlg = document.getElementById('lb');
    main = document.getElementById('lbMain');
    stage = document.getElementById('lbStage');
    thumbs = document.getElementById('lbThumbs');
    title = document.getElementById('lbTitle');
    count = document.getElementById('lbCount');
    text = document.getElementById('lbText');
    ask = document.getElementById('lbAsk');
    prevB = document.getElementById('lbPrev');
    nextB = document.getElementById('lbNext');

    document.getElementById('lbClose').addEventListener('click', function () { dlg.close(); });
    prevB.addEventListener('click', function () { slider.back(true); });
    nextB.addEventListener('click', function () { slider.next(true); });
    thumbs.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]');
      if (b) slider.go(+b.dataset.i, true);
    });
    dlg.addEventListener('keydown', function (e) {
      if (!slider) return;
      if (e.key === 'ArrowLeft') slider.back(true);
      if (e.key === 'ArrowRight') slider.next(true);
    });
    dlg.addEventListener('close', function () {
      document.documentElement.classList.remove('lb-open');
      slider = null;
      stage.innerHTML = '';
      if (UA.Lightbox.onClose) UA.Lightbox.onClose();
    });
  }

  function setCurrent(i) {
    count.textContent = product.photos.length > 1 ? (i + 1) + ' of ' + product.photos.length : '';
    Array.prototype.forEach.call(thumbs.children, function (t, n) {
      var on = n === i;
      t.classList.toggle('on', on);
      t.setAttribute('aria-current', on ? 'true' : 'false');
      if (on && t.scrollIntoView) t.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
  }

  function open(id, start) {
    init();
    product = UA.products.filter(function (p) { return p.id === id; })[0];
    if (!product) return;
    var n = product.photos.length;

    title.textContent = product.name;
    text.textContent = product.text;
    ask.href = 'https://wa.me/' + UA.config.phoneIntl + '?text=' +
      encodeURIComponent('Hello ' + UA.config.name + ', I am interested in ' + product.name + '.');

    /* A fresh stage each time, so old drag listeners never pile up. */
    var st = document.createElement('div');
    st.className = 'slider lb-stage';
    st.id = 'lbStage';
    st.innerHTML = product.photos.map(function (src, i) {
      return '<figure class="slide"><img src="' + esc(src) + '" alt="' + esc(product.name) + ' photo ' + (i + 1) + '" draggable="false"></figure>';
    }).join('');
    main.replaceChild(st, stage);
    stage = st;

    thumbs.innerHTML = product.photos.map(function (src, i) {
      return '<button type="button" data-i="' + i + '" aria-label="Show photo ' + (i + 1) + '"><img src="' + esc(src) + '" alt="" draggable="false"></button>';
    }).join('');
    thumbs.hidden = n < 2;
    prevB.hidden = nextB.hidden = n < 2;

    document.documentElement.classList.add('lb-open');
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    if (UA.Lightbox.onOpen) UA.Lightbox.onOpen();

    slider = new UA.Slider(stage, { start: start || 0, loop: n > 2, onChange: setCurrent });
    setCurrent(slider.index);
  }

  UA.Lightbox = { open: open, onOpen: null, onClose: null };
})();
