/* Links to full images work even when JavaScript is unavailable. */
(() => {
  'use strict';
  const dialog = document.getElementById('m-lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('p');
  let opener;
  document.querySelectorAll('[data-image]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      image.src = link.href;
      image.alt = link.dataset.image;
      caption.textContent = link.dataset.image;
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('dialog-open');
    });
  });
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
    opener?.focus({preventScroll: true});
    image.removeAttribute('src');
  });
  let outside = false;
  const isOutside = event => {
    const r = dialog.getBoundingClientRect();
    return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
  };
  dialog.addEventListener('pointerdown', event => { outside = event.target === dialog && isOutside(event); });
  dialog.addEventListener('click', event => { if (outside && event.target === dialog && isOutside(event)) dialog.close(); outside = false; });
})();
