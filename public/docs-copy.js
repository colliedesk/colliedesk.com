// Docs pages: the "Copy for AI" button copies the page's Markdown twin (the same file as the
// "View as Markdown" link: title, Source URL, Updated date, body) to the clipboard. The twin is
// fetched when the pointer or focus reaches the button, so the click usually writes text that is
// already here; otherwise the fetch runs inside the click through ClipboardItem. Without
// scripting the button is never shown (CSS @media (scripting: enabled)); without a clipboard this
// script hides it. The link works either way.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('[data-docs-copy]');
    if (!button) return;
    if (!navigator.clipboard) { button.hidden = true; return; }
    var label = button.querySelector('[data-docs-copy-label]');
    var status = document.querySelector('[data-docs-copy-status]');
    var idle = label.textContent;
    var url = button.getAttribute('data-md');
    var text = null;
    var loading = null;
    var timer = 0;
    var loadFailed = false;
    // The twin request gives up after 8 s, so a request that never answers ends in the error state
    // instead of leaving the button on "Copying…"; the next click requests it again.
    var load = function () {
      if (!loading) {
        loading = new Promise(function (resolve, reject) {
          var abort = window.AbortController ? new AbortController() : null;
          var giveUp = setTimeout(function () {
            if (abort) abort.abort();
            reject(new Error('timeout'));
          }, 8000);
          fetch(url, { credentials: 'same-origin', signal: abort ? abort.signal : undefined }).then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.text();
          }).then(function (t) { clearTimeout(giveUp); resolve(t); }, function (err) { clearTimeout(giveUp); reject(err); });
        }).then(function (t) { text = t; return t; }, function (err) { loading = null; loadFailed = true; throw err; });
      }
      return loading;
    };
    var show = function (state, labelText, message) {
      clearTimeout(timer);
      button.dataset.state = state;
      label.textContent = labelText;
      status.classList.toggle('visually-hidden', state !== 'error');
      status.textContent = message;
      if (state === 'copied') timer = setTimeout(function () { show('idle', idle, ''); }, 2000);
    };
    var write = function () {
      if (text !== null) return navigator.clipboard.writeText(text);
      if (window.ClipboardItem) {
        var blob = load().then(function (t) { return new Blob([t], { type: 'text/plain' }); });
        return navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })]);
      }
      return load().then(function (t) { return navigator.clipboard.writeText(t); });
    };
    ['pointerenter', 'focus', 'touchstart'].forEach(function (type) {
      button.addEventListener(type, function () { load().catch(function () { /* retried on click */ }); }, { passive: true, once: true });
    });
    button.addEventListener('click', function () {
      if (button.dataset.state === 'busy') return;
      show('busy', 'Copying…', '');
      loadFailed = false;
      write().then(function () {
        show('copied', 'Copied', 'Page copied as Markdown. Paste it into ChatGPT, Claude or another AI chat.');
      }, function () {
        // The twin did not load (offline, timeout, server error): "View as Markdown" would fail too.
        show('error', idle, loadFailed
          ? 'Could not load the page. Check your connection and try again.'
          : 'Could not copy. Open "View as Markdown" and copy the page from there.');
      });
    });
    button.setAttribute('data-ready', '');
  });
})();
