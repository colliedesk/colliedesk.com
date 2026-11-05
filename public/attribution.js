// Carries the ad keys of the link a visitor landed on (utm_* and the click IDs TikTok and Meta add
// to ad links, ttclid and fbclid) to the app's sign-up links: trial, sign-in and Founding. The app
// keeps them with the sign-up, so a trial can be traced to the post or ad that brought it, and on
// Colliedesk Cloud a Meta ad click is reported to Meta (see /privacy, "Sign-ups from our ads").
// It also carries landing_path, the first page of the visit (or the page an ad link opened), so a
// trial can be traced to the page that brought it; it is read from the page path, never the query.
// Only listed keys with plain values pass, the same filter the app applies. The keys are kept in
// sessionStorage for the rest of the visit, at most a day, so a visitor who reads another page
// first still signs up with them. No cookie is set and nothing is sent anywhere by this script.
(function (root) {
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ttclid', 'fbclid'];
  var PLAIN = /^[A-Za-z0-9._-]{1,300}$/;
  var LANDING = 'landing_path';
  var PATH = /^\/[a-z0-9\/._-]{0,200}$/;
  var FORWARD = KEYS.concat([LANDING]);
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
    return out;
  }

  // valid returns the forwarded keys of an object that pass their filter: ad keys and landing_path.
  function valid(keys) {
    var out = fromSearch(new URLSearchParams(keys || {}).toString());
    if (keys && typeof keys[LANDING] === 'string' && PATH.test(keys[LANDING])) out[LANDING] = keys[LANDING];
    return out;
  }

  // decorate returns href with the keys it does not have yet, for the app's sign-up links only.
  function decorate(href, keys) {
    var url;
    try { url = new URL(href); } catch (e) { return href; }
    if (url.origin !== APP || PATHS.indexOf(url.pathname) === -1) return href;
    var added = false;
    FORWARD.forEach(function (key) {
      if (keys[key] && !url.searchParams.has(key)) { url.searchParams.append(key, keys[key]); added = true; }
    });
    return added ? url.toString() : href;
  }

  // remember returns the keys for this page: the landing link's ad keys with this page as landing_path,
  // else those kept earlier in the visit, else this page alone as the start of a new visit.
  function remember(search, storage, now, pathname) {
    var keys = fromSearch(search);
    var page = typeof pathname === 'string' && PATH.test(pathname) ? pathname : null;
    var save = function (k) { storage.setItem(STORE, JSON.stringify({ keys: k, at: now })); return k; };
    try {
      if (Object.keys(keys).length) {
        if (page) keys[LANDING] = page;
        return save(keys);
      }
      var stored = JSON.parse(storage.getItem(STORE) || 'null');
      if (stored && typeof stored.at === 'number' && now - stored.at <= MAX_AGE_MS) {
        // Re-read through the filter: storage may hold something this script did not write.
        return valid(stored.keys);
      }
      return page ? save({ landing_path: page }) : {};
    } catch (e) {
      if (page) keys[LANDING] = page;
      return keys;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fromSearch: fromSearch, decorate: decorate, remember: remember };
    return;
  }

  var storage;
  try { storage = root.sessionStorage; } catch (e) { storage = null; }
  var keys = storage ? remember(root.location.search, storage, Date.now(), root.location.pathname) : fromSearch(root.location.search);
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
