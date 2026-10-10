'use strict';
(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  const nav = document.querySelector('.nav');
  const setMenu = (open, returnFocus = false) => {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('menu-is-open', open);
    if (open) menu.querySelector('a').focus();
    else if (returnFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') { setMenu(false, true); return; }
    if (event.key === 'Tab') {
      const targets = [menuButton, ...menu.querySelectorAll('a')];
      const first = targets[0], last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  const desktopQuery = window.matchMedia('(min-width:761px)');
  if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', event => { if (event.matches) setMenu(false); });

  const lenses = {
    choice: ['01 / Решения', 'Какие решения вы принимаете по привычке — и какой выбор становится возможным сейчас?'],
    experience: ['02 / Опыт', 'Как прошлый опыт влияет на сегодняшнюю реакцию? Что из него поддерживает вас, а что уже можно пересмотреть?'],
    family: ['03 / Отношения', 'Чего вы ждёте от близких и чего они ждут от вас? Где остаётся место для ваших собственных потребностей?'],
    work: ['04 / Работа', 'Как работа связана с вашей самооценкой, отношениями и ощущением безопасности? Что сейчас требует внимания?'],
    meaning: ['05 / Смысл', 'Что для вас важно на этом этапе жизни? Совпадает ли направление, в котором вы движетесь, с тем, чего вы хотите?'],
    state: ['06 / Состояние', 'Как усталость, напряжение или спокойствие влияют на ваш взгляд на ситуацию и решения, которые вы принимаете?']
  };
  document.querySelectorAll('[data-lens]').forEach(button => button.addEventListener('click', () => {
    const selected = lenses[button.dataset.lens];
    if (!selected) return;
    document.querySelectorAll('[data-lens]').forEach(node => node.setAttribute('aria-pressed', String(node === button)));
    document.querySelector('#lens-index').textContent = selected[0];
    document.querySelector('#lens-copy').textContent = selected[1];
  }));

  const copyButton = document.querySelector('.copy-message');
  copyButton.addEventListener('click', async () => {
    const message = document.querySelector('#registration-message');
    const status = document.querySelector('.copy-status');
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(message.value);
      status.textContent = 'Сообщение скопировано. Можно вставить его в Telegram.';
      copyButton.textContent = 'Скопировано ✓';
    } catch (_) {
      document.querySelector('.copy-fallback').hidden = false;
      message.focus(); message.select();
      status.textContent = 'Выделите и скопируйте текст сообщения ниже.';
    }
  });

  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const format = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: zone });
    const start = format.format(new Date('2026-10-18T12:00:00Z'));
    const end = format.format(new Date('2026-10-18T15:00:00Z'));
    document.querySelectorAll('[data-local-time]').forEach(node => { node.textContent = `В часовом поясе вашего устройства (${zone}): ${start}–${end}.`; });
  } catch (_) { /* The published London time remains available without Intl. */ }

  const sticky = document.querySelector('.mobile-join');
  let heroVisible = true, registrationVisible = false;
  const syncSticky = () => { sticky.hidden = heroVisible || registrationVisible; };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target.id === 'top') heroVisible = entry.isIntersecting;
        if (entry.target.id === 'register') registrationVisible = entry.isIntersecting;
      });
      syncSticky();
    }, { threshold: 0 });
    observer.observe(document.querySelector('#top'));
    observer.observe(document.querySelector('#register'));
  }
})();
