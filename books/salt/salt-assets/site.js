(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = $('#main-nav');
  const menuButton = $('.menu-toggle');
  const setMenu = open => {
    if (!menu || !menuButton) return;
    menu.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Закрыть' : 'Меню';
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('#main-nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', e => {
    if (menu?.classList.contains('is-open') && !e.target.closest('.topbar')) setMenu(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu?.classList.contains('is-open')) { setMenu(false); menuButton.focus(); }
  });

  let returnFocus = null;
  function openDialog(id, trigger) {
    const target = document.getElementById(id);
    if (!target) return;
    $$('dialog[open]').forEach(d => d.close());
    const candidate = trigger || document.activeElement;
    if (!candidate?.closest('dialog')) returnFocus = candidate;
    setMenu(false);
    target.showModal();
    document.body.classList.add('has-dialog');
    target.scrollTop = 0;
  }
  function closeDialog(dialog) { dialog?.close(); }
  $$('dialog').forEach(dialog => {
    $('[data-close]', dialog)?.addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) closeDialog(dialog);
    });
    dialog.addEventListener('close', () => {
      if (!document.querySelector('dialog[open]')) {
        document.body.classList.remove('has-dialog');
        if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
      }
      if (dialog.id === 'teaser-dialog') pauseTeaser();
    });
  });
  $$('[data-read]').forEach(button => button.addEventListener('click', () => openDialog('reader-dialog', button)));
  $$('[data-go-edition]').forEach(button => button.addEventListener('click', () => {
    const first = $('#edition [data-edition]');
    returnFocus = first;
    $$('dialog[open]').forEach(d => d.close());
    $('#edition')?.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});
    first?.focus({preventScroll:true});
  }));
  $$('[data-edition]').forEach(button => button.addEventListener('click', () => {
    const type = button.dataset.edition;
    const title = $('#edition-dialog-title');
    const copy = $('#edition-dialog-copy');
    if (title) title.textContent = type === 'ebook' ? 'Электронное издание' : 'Предзаказ печатной книги';
    if (copy) copy.textContent = type === 'ebook'
      ? 'Так читатель переходит от знакомства с книгой к выбору электронного издания. В настоящем запуске здесь будет ссылка на страницу продавца.'
      : 'Так читатель переходит к предзаказу печатной версии. В настоящем запуске здесь появятся подтверждённые сроки, условия и ссылка на оформление.';
    openDialog('edition-dialog', button);
  }));
  $$('[data-author-contact]').forEach(button => button.addEventListener('click', () => openDialog('contact-dialog', button)));
  const email = 'wolfart.creative@gmail.com';
  const contactLink = $('#author-email-link');
  const contactTopic = $('#contact-topic');
  function updateEmail() {
    if (!contactLink) return;
    const topic = contactTopic?.value || 'Издание и представительство';
    const subject = `${topic}: «Соль мёртвых богов»`;
    const body = 'Здравствуйте, команда WOLFART!\n\nМеня заинтересовал концепт запуска «Соль мёртвых богов».\n\nТема предложения: ' + topic + '\n\n';
    contactLink.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  contactTopic?.addEventListener('change', updateEmail);
  updateEmail();
  $$('[data-copy-email]').forEach(button => button.addEventListener('click', async () => {
    const status = button.parentElement.querySelector('[role=status]') || $('#copy-status');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(email);
      if (status) status.textContent = 'Адрес скопирован';
    } catch {
      if (status) status.textContent = 'Скопируйте адрес: ' + email;
    }
  }));

  const locations = [
    {title:'Острова костей',label:'Локация 01',src:'salt-assets/archipelago-1920.webp',small:'salt-assets/archipelago-900.webp',width:1920,smallWidth:900,alt:'Архипелаг из останков древних богов, соединённый руинами мостов',text:'Архипелаг, выросший на останках мёртвых богов. Здесь скалы сохраняют форму рёбер, а дороги обрываются там, где начинается прилив. Между островами ещё стоят мосты — и ещё помнят обещания.',portrait:false},
    {title:'Погребальный маяк',label:'Локация 02',src:'salt-assets/funerary-lighthouse-1920.webp',small:'salt-assets/funerary-lighthouse-900.webp',width:1920,smallWidth:900,alt:'Погребальный маяк над штормовым морем, гигантский древний череп и костяные арки на закате',text:'Последний огонь на краю архипелага. Его зажигают не для кораблей. Смотрительница знает каждую ступень этой башни, но не знает, кто первым велел держать свет и что случится, если он погаснет.',portrait:false,wide:true},
    {title:'Глубинный разлом',label:'Локация 03',src:'salt-assets/underwater-1600.webp',small:'salt-assets/underwater-900.webp',width:1600,smallWidth:900,alt:'Гигантские древние кости над затонувшим подводным каньоном',text:'Под водой лежит другая половина мира. Течения проходят сквозь древние кости, а свет с поверхности гаснет задолго до дна. Здесь остаётся всё, что море пока не готово вернуть.',portrait:false}
  ];
  const tabs = $$('.atlas-tab');
  function selectLocation(index, focus=false) {
    const data = locations[index];
    if (!data || !$('#atlas-image')) return;
    tabs.forEach((tab,i) => { tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1; });
    const image=$('#atlas-image');
    image.src=data.src; image.srcset=data.small+' '+data.smallWidth+'w, '+data.src+' '+data.width+'w';image.alt=data.alt;
    $('#atlas-art').classList.toggle('portrait',data.portrait);
    $('#atlas-art').classList.toggle('wide',Boolean(data.wide));
    $('#atlas-art').style.setProperty('--atlas-backdrop',`url("${data.small}")`);
    $('#atlas-title').textContent=data.title;$('#atlas-description').textContent=data.text;$('#atlas-count').textContent=data.label;
    $('#atlas-panel').setAttribute('aria-labelledby',tabs[index].id);
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab,i) => {
    tab.addEventListener('click',()=>selectLocation(i));
    tab.addEventListener('keydown',e=>{
      let target;
      if(e.key==='ArrowRight') target=(i+1)%tabs.length;
      if(e.key==='ArrowLeft') target=(i-1+tabs.length)%tabs.length;
      if(e.key==='Home') target=0;
      if(e.key==='End') target=tabs.length-1;
      if(target!==undefined){e.preventDefault();selectLocation(target,true);}
    });
  });

  $$('[data-art]').forEach(button=>button.addEventListener('click',()=>{
    const image=$('#art-image');if(!image)return;
    image.src=button.dataset.art; image.alt=button.dataset.alt||'';
    $('#art-title').textContent=button.dataset.title||'Иллюстрация';
    openDialog('art-dialog',button);
  }));

  const shots = [
    {start:0,end:5,img:'salt-assets/archipelago-1920.webp',text:'Боги умерли.',position:'50% 50%'},
    {start:5,end:10,img:'salt-assets/keeper-action-1200.webp',text:'Но море помнит.',position:'50% 23%'},
    {start:10,end:15,img:'salt-assets/dragon-1000.webp',text:'Он вернул того, кого не должно быть.',position:'50% 25%'},
    {start:15,end:21,img:'salt-assets/story-1600.webp',text:'Она нарушит обещание.',position:'50% 50%'},
    {start:21,end:26,img:'salt-assets/underwater-1600.webp',text:'Чтобы узнать, кого удерживает свет.',position:'50% 50%'},
    {start:26,end:32,img:'salt-assets/cover-1024.webp',text:'Соль мёртвых богов',position:'50% 50%'}
  ];
  const teaser = {time:0,playing:false,raf:0,last:0,index:-1};
  const teaserDialog=$('#teaser-dialog');
  const teaserShot=$('#teaser-shot');
  const teaserScreen=$('#teaser-screen');
  const teaserToggle=$('#teaser-toggle');
  const seek=$('#teaser-seek');
  const formatTime=n=>'0:'+String(Math.floor(n)).padStart(2,'0');
  function drawTeaser() {
    if(!teaserShot)return;
    const index=shots.findIndex(s=>teaser.time>=s.start&&teaser.time<s.end);
    const next=index<0?shots.length-1:index;
    const shot=shots[next];
    if(teaser.index!==next){
      teaserShot.src=shot.img;teaserShot.style.objectPosition=shot.position;
      $('#teaser-caption').textContent=shot.text;
      teaserScreen.classList.toggle('is-last',next===shots.length-1);
      teaserScreen.classList.remove('is-transitioning');void teaserScreen.offsetWidth;
      teaserScreen.classList.add('is-transitioning');teaser.index=next;
    }
    teaserScreen.style.setProperty('--shot-progress',String(Math.min(1,(teaser.time-shot.start)/(shot.end-shot.start))));
    seek.value=String(teaser.time);seek.setAttribute('aria-valuetext',formatTime(teaser.time)+' из 0:32');
    $('#teaser-time').textContent=formatTime(teaser.time)+' / 0:32';
  }
  function pauseTeaser(){teaser.playing=false;cancelAnimationFrame(teaser.raf);if(teaserToggle){teaserToggle.textContent='Продолжить';teaserToggle.setAttribute('aria-label','Продолжить тизер');}}
  function tick(now){
    if(!teaser.playing)return;
    teaser.time=Math.min(32,teaser.time+(now-teaser.last)/1000);teaser.last=now;drawTeaser();
    if(teaser.time>=32){pauseTeaser();teaserToggle.textContent='Сначала';teaserToggle.setAttribute('aria-label','Посмотреть тизер сначала');return;}
    teaser.raf=requestAnimationFrame(tick);
  }
  function playTeaser(){
    if(teaser.time>=32){teaser.time=0;teaser.index=-1;}
    teaser.playing=true;teaser.last=performance.now();
    teaserToggle.textContent='Пауза';teaserToggle.setAttribute('aria-label','Приостановить тизер');
    cancelAnimationFrame(teaser.raf);teaser.raf=requestAnimationFrame(tick);
  }
  $$('[data-teaser]').forEach(button=>button.addEventListener('click',()=>{
    openDialog('teaser-dialog',button);teaser.time=0;teaser.index=-1;drawTeaser();playTeaser();
    shots.forEach(shot=>{const preload=new Image();preload.src=shot.img;});
  }));
  teaserToggle?.addEventListener('click',()=>teaser.playing?pauseTeaser():playTeaser());
  seek?.addEventListener('input',()=>{teaser.time=Number(seek.value);teaser.last=performance.now();drawTeaser();if(teaser.time>=32){pauseTeaser();teaserToggle.textContent='Сначала';teaserToggle.setAttribute('aria-label','Посмотреть тизер сначала');}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&teaserDialog?.open)pauseTeaser();});

  if('IntersectionObserver' in window&&!reduced.matches){
    document.body.classList.add('motion-ready');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.06});
    $$('.reveal').forEach(el=>observer.observe(el));
  }
})();
