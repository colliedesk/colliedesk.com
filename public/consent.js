// Cookie consent on colliedesk.com. Accept loads Google Analytics, which sets the _ga cookies,
// and Apollo website visitors, and lets PostHog (analytics.js) set its ph_ cookie; nothing from
// Google or Apollo loads before that and PostHog stays cookieless. The choice is kept in
// localStorage under "colliedesk-consent" ("granted" or "denied"). Any element with
// data-consent-open (the footer "Cookie settings" button) reopens the banner, and declining after
// an earlier accept deletes the Google Analytics and PostHog cookies and the Apollo ID.
// scripts/check.mjs fails if Google Analytics or Apollo can load another way.
(function () {
  var KEY = 'colliedesk-consent';
  var GA_ID = 'G-7VBE3TER7E';
  var live = location.hostname === 'colliedesk.com';

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* private mode: ask again next visit */ }
  }

  function loadAnalytics() {
    if (!live || window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    loadApollo();
  }

  // Apollo website visitors: names the company behind a visit from its network, for sales
  // follow-up. Company level only (person level is off in Apollo, so its LiveIntent pixel never
  // loads); it keeps a random apolloAnonId in local storage.
  function loadApollo() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=' + Math.random().toString(36).substring(7);
    s.onload = function () { window.trackingFunctions.onLoad({ appId: '6ad46618125a0a0010e0d0dd' }); };
    document.head.appendChild(s);
  }

  // PostHog (analytics.js) uses its cookie only while the choice is "granted".
  function setPostHogConsent(value) {
    if (!window.posthog) return;
    if (value === 'granted') posthog.opt_in_capturing({ captureEventName: false });
    else posthog.opt_out_capturing();
  }

  function clearAnalyticsCookies() {
    var domain = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name.indexOf('ph_') === 0) {
        document.cookie = name + '=; Max-Age=0; path=/; domain=.' + domain;
        document.cookie = name + '=; Max-Age=0; path=/';
      }
    });
    try {
      localStorage.removeItem('apolloAnonId');
      Object.keys(localStorage).forEach(function (key) {
        if (key.indexOf('6ad46618125a0a0010e0d0dd_') === 0) localStorage.removeItem(key);
      });
    } catch (e) { /* storage blocked: nothing was stored */ }
  }

  var banner;
  function hide() { if (banner) banner.hidden = true; }
  function choose(value) {
    var before = read();
    store(value);
    hide();
    setPostHogConsent(value);
    if (value === 'granted') loadAnalytics();
    else if (before === 'granted') { clearAnalyticsCookies(); location.reload(); }
  }
  function show() {
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'consent-banner';
      banner.setAttribute('role', 'region');
      banner.setAttribute('aria-label', 'Cookie choice');
      banner.innerHTML =
        '<p>We would like to use analytics cookies (Google Analytics, PostHog and Apollo) to see which pages help people and which companies visit. ' +
        'Until you accept, we only count visits without cookies. <a href="/privacy#cookies">Privacy</a></p>' +
        '<div class="consent-actions">' +
        '<button type="button" class="btn btn-sm" data-consent="denied">Decline</button>' +
        '<button type="button" class="btn btn-sm btn-primary" data-consent="granted">Accept</button>' +
        '</div>';
      banner.addEventListener('click', function (event) {
        var button = event.target.closest('[data-consent]');
        if (button) choose(button.getAttribute('data-consent'));
      });
      document.body.appendChild(banner);
    }
    banner.hidden = false;
  }

  var choice = read();
  if (choice === 'granted') loadAnalytics();

  document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
      if (event.target.closest('[data-consent-open]')) show();
    });
    if (live && choice !== 'granted' && choice !== 'denied') show();
  });
})();
