(function () {
  'use strict';
  var viewer = document.getElementById('image-viewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  var viewerImage = document.getElementById('viewer-image');
  var viewerTitle = document.getElementById('viewer-title');
  var opener = null;
  document.querySelectorAll('a[data-image]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      var thumbnail = link.querySelector('img');
      opener = link;
      viewerImage.src = link.href;
      viewerImage.alt = thumbnail.alt;
      viewerTitle.textContent = link.dataset.image;
      viewer.showModal();
      document.body.classList.add('dialog-open');
    });
  });
  viewer.querySelector('[data-viewer-close]').addEventListener('click', function () { viewer.close(); });
  var startedOutside = false;
  viewer.addEventListener('pointerdown', function (event) {
    startedOutside = event.target === viewer;
  });
  viewer.addEventListener('click', function (event) {
    if (startedOutside && event.target === viewer) viewer.close();
    startedOutside = false;
  });
  viewer.addEventListener('close', function () {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
    viewerImage.removeAttribute('src');
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  });
})();

/* Совпадение верхнего края прописных букв в браузерах без text-box. */
(function () {
  'use strict';
  if (window.CSS && CSS.supports('text-box', 'trim-start cap alphabetic')) return;
  var elements = Array.from(document.querySelectorAll('.cap-top'));
  if (!elements.length) return;
  var context = document.createElement('canvas').getContext('2d');
  if (!context) return;

  function alignCaps() {
    var measured = new Map();
    var probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;left:-10000px;top:0;width:max-content;' +
      'height:auto;margin:0;padding:0;border:0;visibility:hidden;white-space:nowrap;';
    var marker = document.createElement('span');
    marker.style.cssText = 'display:inline-block;width:1px;height:0;margin:0;' +
      'padding:0;border:0;vertical-align:baseline;';
    probe.appendChild(document.createTextNode('Н'));
    probe.appendChild(marker);
    document.body.appendChild(probe);

    elements.forEach(function (element) {
      var style = getComputedStyle(element);
      var font = style.fontStyle + ' ' + style.fontWeight + ' ' +
        style.fontSize + ' ' + style.fontFamily;
      var key = font + '/' + style.lineHeight;
      if (!measured.has(key)) {
        probe.style.font = font;
        probe.style.lineHeight = style.lineHeight;
        context.font = font;
        var cap = context.measureText('Н').actualBoundingBoxAscent;
        if (!Number.isFinite(cap)) return;
        var baseline = marker.getBoundingClientRect().top - probe.getBoundingClientRect().top;
        measured.set(key, Math.max(0, baseline - cap));
      }
      element.style.setProperty('--cap-inset', measured.get(key) + 'px');
    });
    probe.remove();
  }

  alignCaps();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignCaps);
  var resizeFrame = 0;
  window.addEventListener('resize', function () {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(alignCaps);
  });
})();
