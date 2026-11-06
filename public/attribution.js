// Carries the ad keys of the link a visitor landed on (utm_* and the click IDs TikTok and Meta add
// to ad links, ttclid and fbclid) to the app's sign-up links: trial, sign-in and Founding. The app
// keeps them with the sign-up, so a trial can be traced to the post or ad that brought it, and on
// Colliedesk Cloud a Meta ad click is reported to Meta (see /privacy, "Sign-ups from our ads").
// Only listed keys with plain values pass, the same filter the app applies. The keys are kept in
// sessionStorage for the rest of the visit, at most a day, so a visitor who reads another page
// first still signs up with them. No cookie is set and nothing is sent anywhere by this script.
// A partner link, /?via=<slug>, counts as utm_source=<slug> (lower-cased) with utm_medium=partner,
// so the app needs no change; an explicit utm_source or utm_medium on the same link wins.
(function (root) {
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ttclid', 'fbclid'];
  var PLAIN = /^[A-Za-z0-9._-]{1,300}$/;
  var APP = 'https://app.colliedesk.com';
  var PATHS = ['/sign-in', '/settings/billing'];
  var STORE = 'colliedesk.site-attribution';
  var MAX_AGE_MS = 24 * 60 * 60 * 1000;

  function fromSearch(search) {
    var params = new URLSearchParams(search || '');
    var out = {};
    KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value !== null && PLAIN.test(value)) out[key] = value;
    });
    var via = params.get('via');
    if (via !== null && PLAIN.test(via)) {
      if (!out.utm_source) out.utm_source = via.toLowerCase();
      if (!out.utm_medium) out.utm_medium = 'partner';
    }
    return out;
  }

  // decorate returns href with the keys it does not have yet, for the app's sign-up links only.
  function decorate(href, keys) {
    var url;
    try { url = new URL(href); } catch (e) { return href; }
    if (url.origin !== APP || PATHS.indexOf(url.pathname) === -1) return href;
    var added = false;
    KEYS.forEach(function (key) {
      if (keys[key] && !url.searchParams.has(key)) { url.searchParams.append(key, keys[key]); added = true; }
    });
    return added ? url.toString() : href;
  }

  // remember returns the keys for this page: the landing link's, else those kept earlier in the visit.
  function remember(search, storage, now) {
    var keys = fromSearch(search);
    try {
      if (Object.keys(keys).length) {
        storage.setItem(STORE, JSON.stringify({ keys: keys, at: now }));
        return keys;
      }
      var stored = JSON.parse(storage.getItem(STORE) || 'null');
      if (!stored || typeof stored.at !== 'number' || now - stored.at > MAX_AGE_MS) return {};
      // Re-read through the filter: storage may hold something this script did not write.
      return fromSearch(new URLSearchParams(stored.keys || {}).toString());
    } catch (e) {
      return keys;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fromSearch: fromSearch, decorate: decorate, remember: remember };
    return;
  }

  var storage;
  try { storage = root.sessionStorage; } catch (e) { storage = null; }
  var keys = storage ? remember(root.location.search, storage, Date.now()) : fromSearch(root.location.search);
  if (!Object.keys(keys).length) return;
  function apply(link) {
    var href = link.getAttribute('href');
    if (href) {
      var next = decorate(href, keys);
      if (next !== href) link.setAttribute('href', next);
    }
  }
  Array.prototype.forEach.call(root.document.querySelectorAll('a[href^="' + APP + '/"]'), apply);
  // Links a page adds later (the price check) are decorated when they are followed.
  root.document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest && event.target.closest('a[href^="' + APP + '/"]');
    if (link) apply(link);
  }, true);
})(typeof window !== 'undefined' ? window : this);
