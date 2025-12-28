(() => {
  const container = document.getElementById('telegram-comments');
  if (!container) return;

  const tId = container.dataset.telegramId;
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const s = document.createElement('script');

  s.src = 'https://telegram.org/js/telegram-widget.js?22';
  s.setAttribute('data-telegram-discussion', `shoggothstaring/${tId}`);
  s.setAttribute('data-comments-limit', '20');
  s.setAttribute('data-color', 'EB99A1');
  s.setAttribute('data-dark', isDark ? '1' : '0');
  s.async = true;

  container.appendChild(s);
})();
