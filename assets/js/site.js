
(function () {
  'use strict';

  /* Progressive enhancement: без JavaScript весь основной контент виден. */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  function reveal(el) {
    el.classList.remove('reveal-pending');
    el.classList.add('is-in');
  }
  if (!reduceMotion && 'IntersectionObserver' in window) {
    try {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { reveal(entry.target); io.unobserve(entry.target); }
        });
      }, { threshold: 0.01 });
      revealEls.forEach(function (el, i) {
        if (!el.style.getPropertyValue('--rd')) el.style.setProperty('--rd', Math.min(i * 70, 350) + 'ms');
        el.classList.add('reveal-pending');
        io.observe(el);
      });
      /* При переходе клавиатурой не оставляем фокус в невидимом блоке. */
      document.addEventListener('focusin', function (e) {
        revealEls.forEach(function (el) { if (el.contains(e.target)) reveal(el); });
      });
    } catch (_) { revealEls.forEach(reveal); }
  } else { revealEls.forEach(reveal); }

  /* Нативные dialog: фокус и Escape поддерживает браузер. */
  var openers = new WeakMap();
  document.querySelectorAll('[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dlg = document.getElementById(btn.dataset.open);
      if (!dlg || dlg.open) return;
      openers.set(dlg, btn);
      dlg.showModal();
      document.body.classList.add('dialog-open');
    });
  });
  document.querySelectorAll('dialog.dlg').forEach(function (dlg) {
    var startedOutside = false;
    function outside(e) {
      var r = dlg.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    }
    dlg.addEventListener('pointerdown', function (e) {
      startedOutside = e.target === dlg && outside(e);
    });
    dlg.addEventListener('pointercancel', function () { startedOutside = false; });
    dlg.addEventListener('click', function (e) {
      /* Padding окна — часть окна, а не подложка. */
      if (startedOutside && e.target === dlg && outside(e)) dlg.close();
      startedOutside = false;
    });
    dlg.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = Array.from(dlg.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(function (el) { return el.getClientRects().length; });
      var first = items[0], last = items[items.length - 1];
      if (!first) { e.preventDefault(); return; }
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    dlg.addEventListener('close', function () {
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
      var opener = openers.get(dlg);
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      openers.delete(dlg);
    });
    dlg.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { dlg.close(); });
    });
  });
})();
