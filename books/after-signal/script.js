(() => {
  'use strict';
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
    mobileNav.hidden = true;
  };
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Закрыть меню' : 'Открыть меню');
    mobileNav.hidden = !opening;
  });
  mobileNav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => {
    if (!mobileNav.hidden && !event.target.closest('.header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); }
  });
  window.matchMedia('(min-width: 641px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  function activateTab(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
    });
  });

  const dialogTriggers = document.querySelectorAll('[data-dialog]');
  dialogTriggers.forEach(trigger => trigger.addEventListener('click', () => {
    const dialog = document.getElementById(trigger.dataset.dialog);
    closeMenu();
    dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.scrollTop = 0;
    dialog.querySelector('h2').focus({ preventScroll: true });
  }));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelectorAll('.close-dialog').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      const trigger = document.querySelector(`[data-dialog="${dialog.id}"]`);
      if (trigger) trigger.focus({ preventScroll: true });
    });
  });
  document.querySelector('.edition-excerpt').addEventListener('click', () => document.getElementById('edition-dialog').close());
  const descriptions = {
    paper: ['Бумажная книга', 'В реальном проекте здесь будет переход в книжный магазин или на сайт издательства. В демонстрации заказ не создаётся.'],
    ebook: ['Электронная книга', 'В реальном проекте здесь будет ссылка на электронное издание. Для концептуального романа подготовлен только отрывок на этой странице.'],
    audio: ['Аудиокнига', 'В реальном проекте здесь будет переход на аудиоплатформу. Демонстрационная аудиозапись для этого концепта не выпускалась.']
  };
  const formatForm = document.getElementById('format-form');
  const result = document.querySelector('.format-result');
  formatForm.addEventListener('submit', event => {
    event.preventDefault();
    const selected = new FormData(formatForm).get('format');
    const [title, description] = descriptions[selected];
    const heading = document.createElement('strong');
    heading.textContent = title;
    result.replaceChildren(heading, document.createTextNode(description));
    result.hidden = false;
    result.scrollIntoView({ behavior: motionQuery.matches ? 'instant' : 'smooth', block: 'nearest' });
  });
  formatForm.addEventListener('change', () => { result.hidden = true; });

  let scrollQueued = false;
  const progress = document.querySelector('.reading-progress');
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; window.requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!motionQuery.matches && entry.target.getBoundingClientRect().top > 24) {
          entry.target.animate([{ opacity: .35, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], {
            duration: 550, easing: 'cubic-bezier(.2,.65,.3,1)'
          });
        }
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .08 });
    document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));
  }
})();
