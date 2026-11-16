// Docs search: a static Pagefind index of the docs pages (written by src/integrations/pagefind-index.ts),
// loaded the first time the reader opens search, so a page view costs nothing. The search buttons and
// Cmd/Ctrl+K open a modal <dialog>. Each result links to the heading the match is under. Pagefind runs on
// the main thread (noWorker): the index is small, and the worker file is not shipped.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var dialog = document.querySelector('[data-docs-search]');
    var openers = document.querySelectorAll('[data-docs-search-open]');
    if (!dialog) return;
    if (typeof dialog.showModal !== 'function') {
      Array.prototype.forEach.call(openers, function (b) { b.hidden = true; });
      return;
    }
    var input = dialog.querySelector('[data-docs-search-input]');
    var status = dialog.querySelector('[data-docs-search-status]');
    var list = dialog.querySelector('[data-docs-search-results]');
    var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
    Array.prototype.forEach.call(document.querySelectorAll('[data-docs-search-key]'), function (k) { k.textContent = mac ? '⌘K' : 'Ctrl K'; });
    var pagefind = null;
    var seq = 0;

    var load = function () {
      if (!pagefind) {
        pagefind = import('/pagefind/pagefind.js').then(function (pf) {
          return pf.options({ noWorker: true, excerptLength: 24 }).then(function () { return pf; });
        });
        pagefind.catch(function () { pagefind = null; });
      }
      return pagefind;
    };
    // Pagefind URLs name the built file (/docs/inbox.html#tags); the site links without .html.
    var clean = function (url) { return url.replace(/\.html(?=$|#)/, ''); };
    // An excerpt is Pagefind's escaped text with <mark> around the match. It is parsed inert in a
    // <template> and copied as text and <mark> only, so no other markup reaches the page.
    var excerpt = function (html) {
      var tpl = document.createElement('template');
      tpl.innerHTML = html;
      var out = document.createElement('span');
      out.className = 'docs-search-text';
      Array.prototype.forEach.call(tpl.content.childNodes, function (n) {
        var mark = n.nodeName === 'MARK';
        var node = mark ? document.createElement('mark') : document.createTextNode(n.textContent);
        if (mark) node.textContent = n.textContent;
        out.appendChild(node);
      });
      return out;
    };
    var render = function (query, pages) {
      list.textContent = '';
      var count = 0;
      pages.forEach(function (page) {
        var subs = page.sub_results && page.sub_results.length ? page.sub_results.slice(0, 3) : [page];
        subs.forEach(function (sub) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = clean(sub.url);
          var title = document.createElement('span');
          title.className = 'docs-search-title';
          title.textContent = sub.title && sub.title !== page.meta.title ? page.meta.title + ' › ' + sub.title : page.meta.title;
          a.appendChild(title);
          a.appendChild(excerpt(sub.excerpt || ''));
          li.appendChild(a);
          list.appendChild(li);
          count++;
        });
      });
      status.textContent = count ? count + (count === 1 ? ' result' : ' results') : 'No results for “' + query + '”.';
    };
    var run = function () {
      var query = input.value.trim();
      var mine = ++seq;
      if (!query) { list.textContent = ''; status.textContent = ''; return; }
      load().then(function (pf) { return pf.debouncedSearch(query, {}, 120); }).then(function (search) {
        if (!search || mine !== seq) return null;
        return Promise.all(search.results.slice(0, 8).map(function (r) { return r.data(); })).then(function (pages) {
          if (mine === seq) render(query, pages);
        });
      }).catch(function () {
        if (mine === seq) status.textContent = 'Search could not load. Check your connection and try again.';
      });
    };
    var open = function () {
      if (!dialog.open) dialog.showModal();
      input.focus();
      input.select();
      load().catch(function () { /* reported when the reader types */ });
    };

    Array.prototype.forEach.call(openers, function (b) { b.addEventListener('click', open); });
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); open(); }
    });
    input.addEventListener('input', run);
    input.addEventListener('keydown', function (e) {
      var first = list.querySelector('a');
      if (e.key === 'Enter' && first) { e.preventDefault(); first.click(); }
    });
    // A result may be a heading on this page: close so the page scrolls there in view.
    list.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) dialog.close(); });
    // A click on the backdrop lands on the <dialog> itself (the panel fills its inside).
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  });
})();
