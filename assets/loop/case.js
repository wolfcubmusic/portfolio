(() => {
  'use strict';
  const stage = document.querySelector('.l-animation');
  const frame = stage?.querySelector('iframe');
  const toggle = document.querySelector('.l-animation-toggle');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (stage && frame && toggle) {
    const fit = () => stage.style.setProperty('--l-cover-scale', String(stage.getBoundingClientRect().width / 1440));
    const play = enabled => {
      fit();
      stage.classList.toggle('is-playing', enabled);
      toggle.setAttribute('aria-pressed', String(enabled));
      toggle.textContent = enabled ? 'Остановить анимацию' : 'Включить анимацию';
      if (enabled) frame.src = frame.dataset.src;
      else frame.removeAttribute('src');
    };
    toggle.hidden = false;
    toggle.addEventListener('click', () => play(toggle.getAttribute('aria-pressed') !== 'true'));
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(stage);
    else window.addEventListener('resize', fit);
    motion.addEventListener('change', event => { if (event.matches) play(false); });
    play(!motion.matches);
  }
  const dialog = document.getElementById('loop-lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  let opener;
  document.querySelectorAll('[data-loop-image]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    dialog.querySelector('img').src = link.href;
    dialog.querySelector('img').alt = link.dataset.loopImage;
    dialog.querySelector('p').textContent = link.dataset.loopImage;
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.scrollLeft = 0;
    document.body.classList.add('dialog-open');
  }));
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
    opener?.focus({preventScroll:true});
  });
})();
