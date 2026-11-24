/* ==========================================================================
   Slider – touch / mouse / keyboard swipeable slides, optional autoplay.
   Markup: <div class="slider"> <figure class="slide">…</figure> … </div>
   Slides are positioned by JS so dragging follows the finger and loops.
   ========================================================================== */
(function () {
  'use strict';
  var UA = (window.UA = window.UA || {});
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var noop = function () {};

  function Slider(root, opts) {
    opts = opts || {};
    this.root = root;
    this.slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));
    this.n = this.slides.length;
    this.loop = opts.loop !== false && this.n > 2;
    this.interval = opts.interval || 0;
    this.auto = !!this.interval && !reduce && this.n > 1;
    this.onChange = opts.onChange || noop;
    this.onPlay = opts.onPlay || noop;
    this.index = opts.start || 0;
    this.width = root.clientWidth;
    this.drag = null;
    this.prev = [];
    this.holds = 0;
    this.hover = false;
    this.timer = null;
    this.suppress = false;
    this._bind();
    this.render(true);
    if (this.auto) this.play();
  }

  /* Signed distance of slide i from the current slide (wraps when looping). */
  Slider.prototype._delta = function (i) {
    var d = i - this.index, n = this.n, h = Math.floor(n / 2);
    if (this.loop) d = ((d + n + h) % n) - h;
    return d;
  };

  Slider.prototype.render = function (instant) {
    var w = this.width, dx = this.drag ? this.drag.dx : 0;
    for (var i = 0; i < this.n; i++) {
      var s = this.slides[i], d = this._delta(i), old = this.prev[i];
      var jump = old === undefined || Math.abs(d - old) > 1; // wrapped around: don't animate
      s.style.transition = instant || jump || this.drag ? 'none' : '';
      s.style.transform = 'translate3d(' + (d * w + dx) + 'px,0,0)';
      s.style.visibility = Math.abs(d) <= 1 ? 'visible' : 'hidden';
      s.classList.toggle('is-active', d === 0);
      s.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
      if ('inert' in s) s.inert = d !== 0;
      this.prev[i] = d;
    }
  };

  Slider.prototype.go = function (i, user) {
    if (this.loop) i = (i + this.n) % this.n;
    else i = Math.max(0, Math.min(this.n - 1, i));
    var changed = i !== this.index;
    this.index = i;
    this.render();
    if (changed) this.onChange(i);
    if (user && this.auto && !this.hover && this.holds === 0) this.play();
  };
  Slider.prototype.next = function (user) { this.go(this.index + 1, user); };
  Slider.prototype.back = function (user) { this.go(this.index - 1, user); };

  Slider.prototype.play = function () {
    var self = this;
    clearInterval(this.timer);
    if (!this.auto || this.holds > 0) return;
    this.timer = setInterval(function () { if (!document.hidden) self.next(); }, this.interval);
    this.root.classList.remove('paused');
    this.onPlay();
  };
  Slider.prototype.pause = function () {
    clearInterval(this.timer);
    this.timer = null;
    this.root.classList.add('paused');
  };
  Slider.prototype.resume = function () { if (this.auto && this.holds === 0) this.play(); };
  Slider.prototype.hold = function () { this.holds++; this.pause(); };
  Slider.prototype.release = function () { this.holds = Math.max(0, this.holds - 1); if (!this.hover) this.resume(); };

  Slider.prototype._bind = function () {
    var self = this, root = this.root, start = null;

    root.addEventListener('pointerdown', function (e) {
      if (self.n < 2 || (e.pointerType === 'mouse' && e.button !== 0)) return;
      start = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
    });

    root.addEventListener('pointermove', function (e) {
      if (!start || e.pointerId !== start.id) return;
      var dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!self.drag) {
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
          self.drag = { dx: 0 };
          self.pause();
          try { root.setPointerCapture(e.pointerId); } catch (err) {}
          root.classList.add('dragging');
        } else return;
      }
      var atEdge = !self.loop && ((self.index === 0 && dx > 0) || (self.index === self.n - 1 && dx < 0));
      self.drag.dx = atEdge ? dx * 0.35 : dx; // rubber band at the ends
      self.render();
    });

    function end(e) {
      if (!start || e.pointerId !== start.id) return;
      var s = start; start = null;
      if (!self.drag) return;
      var dx = self.drag.dx, v = Math.abs(dx) / Math.max(1, performance.now() - s.t);
      self.drag = null;
      root.classList.remove('dragging');
      self.suppress = true;
      setTimeout(function () { self.suppress = false; }, 0);
      if (Math.abs(dx) > self.width * 0.18 || v > 0.5) self.go(self.index + (dx < 0 ? 1 : -1), true);
      else { self.render(); self.resume(); }
    }
    root.addEventListener('pointerup', end);
    root.addEventListener('pointercancel', end);

    /* A drag must not count as a click on a button inside the slide. */
    root.addEventListener('click', function (e) {
      if (self.suppress) { e.stopPropagation(); e.preventDefault(); }
    }, true);

    root.addEventListener('mouseenter', function () { self.hover = true; self.pause(); });
    root.addEventListener('mouseleave', function () { self.hover = false; self.resume(); });
    root.addEventListener('focusin', function () { self.pause(); });
    root.addEventListener('focusout', function () { if (!self.hover) self.resume(); });

    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        if (root.clientWidth && root.clientWidth !== self.width) { self.width = root.clientWidth; self.render(true); }
      }).observe(root);
    } else {
      window.addEventListener('resize', function () { self.width = root.clientWidth; self.render(true); });
    }
  };

  UA.Slider = Slider;
})();
