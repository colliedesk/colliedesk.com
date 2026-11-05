// Cookie consent on colliedesk.com. Accept loads Google Analytics, which sets the _ga cookies,
// Apollo website visitors and the Meta pixel (_fbp, _fbc), and lets PostHog (analytics.js) set its
// ph_ cookie. The choice is kept in localStorage under "colliedesk-consent" ("granted" or "denied").
// Any element with data-consent-open (the footer "Your privacy choices" button) reopens the banner,
// and declining after the cookies loaded deletes the Google Analytics, PostHog and Meta cookies and
// the Apollo ID.
// Where the law asks for opt-in (EU, EEA, UK, Switzerland, Quebec) nothing from Google, Apollo or
// Meta loads before Accept and PostHog stays cookieless. In the opt-out places we advertise in (the
// US, Canada outside the Quebec time zones, Australia) they load at once, unless the browser sends
// Global Privacy Control or the visitor declined. The place comes from the browser's time zone, with
// no network call; a zone that is not on the opt-out list counts as opt-in.
// scripts/check.mjs and scripts/consent.test.mjs fail if Google Analytics, Apollo or the Meta pixel
// can load another way.
(function () {
  var KEY = 'colliedesk-consent';
  var GA_ID = 'G-7VBE3TER7E';
  var META_PIXEL_ID = '2097540104486917';
  var live = location.hostname === 'colliedesk.com';
  var OPT_OUT_ZONES = new RegExp('^(?:US/.+|Australia/.+|Pacific/Honolulu|America/(?:' + [
    // United States
    'New_York', 'Detroit', 'Kentucky/.+', 'Indiana/.+', 'Indianapolis', 'Fort_Wayne', 'Louisville',
    'Chicago', 'Menominee', 'North_Dakota/.+', 'Knox_IN', 'Denver', 'Boise', 'Phoenix', 'Shiprock',
    'Los_Angeles', 'Anchorage', 'Juneau', 'Sitka', 'Metlakatla', 'Yakutat', 'Nome', 'Adak',
    // Canada, without America/Toronto, America/Montreal and the other zones Quebec shares
    'St_Johns', 'Halifax', 'Glace_Bay', 'Moncton', 'Goose_Bay', 'Winnipeg', 'Rainy_River', 'Regina',
    'Swift_Current', 'Edmonton', 'Cambridge_Bay', 'Yellowknife', 'Inuvik', 'Vancouver', 'Whitehorse',
    'Dawson', 'Dawson_Creek', 'Fort_Nelson', 'Creston', 'Resolute', 'Rankin_Inlet'
  ].join('|') + '))$');

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function optOutPlace() {
    var zone = '';
    try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* no Intl: opt-in */ }
    return OPT_OUT_ZONES.test(zone);
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
    loadMetaPixel();
  }

  // Meta pixel (dataset Colliedesk, the same one the app reports trials to from its server):
  // counts visits from our Facebook and Instagram ads and lets those ads reach past visitors.
  // It sets the _fbp cookie, and _fbc when the visit came from an ad click.
  function loadMetaPixel() {
    if (window.fbq) return;
    var fbq = window.fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
    trackFunnel(fbq);
    // fbevents.js is about 90 KB: fetch it only after the page has loaded, so it never slows the
    // first screen. Calls made before then wait in fbq.queue and are sent when it arrives.
    afterLoad(function () {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(s);
    });
  }

  // The switch funnel, for judging and optimizing ads on steps that happen far more often than a
  // trial (scripts/ad-events.test.mjs): the switch page seen (ViewContent), read to 75%
  // (SwitchScroll75), a trial link clicked (InitiateCheckout) and the switch call clicked (Contact).
  // It runs only where the pixel runs, and sends no personal data, only the event name.
  var SWITCH_PATH = '/migrate/freshdesk/switch';
  function trackFunnel(fbq) {
    var onSwitch = (location.pathname || '').replace(/\/$/, '') === SWITCH_PATH;
    if (onSwitch) {
      fbq('track', 'ViewContent', { content_name: 'switch' });
      var read = false;
      window.addEventListener('scroll', function () {
        var seen = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
        if (!read && seen >= 0.75) { read = true; fbq('trackCustom', 'SwitchScroll75'); }
      }, { passive: true });
    }
    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href]');
      if (!link) return;
      var url;
      try { url = new URL(link.href); } catch (e) { return; }
      if (url.origin === 'https://app.colliedesk.com' && url.pathname === '/sign-in' && url.searchParams.get('intent') === 'trial') {
        fbq('track', 'InitiateCheckout', { content_name: onSwitch ? 'switch' : location.pathname });
      } else if (url.origin === 'https://cal.com' && url.pathname.indexOf('/chinh/colliedesk-switch') === 0) {
        fbq('track', 'Contact', { content_name: 'switch call' });
      }
    }, true);
  }

  function afterLoad(fn) {
    if (document.readyState === 'complete') fn();
    else window.addEventListener('load', function () { window.setTimeout(fn, 0); });
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
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name.indexOf('ph_') === 0 || name === '_fbp' || name === '_fbc') {
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
    else if (before === 'granted' || byDefault) { clearAnalyticsCookies(); location.reload(); }
  }
  function show() {
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'consent-banner';
      banner.setAttribute('role', 'region');
      banner.setAttribute('aria-label', 'Cookie choice');
      banner.innerHTML =
        '<p>We would like to use analytics and advertising cookies from Google Analytics, PostHog, Apollo and Meta. ' +
        'If you decline, we count visits without cookies. <a href="/privacy#cookies">Privacy</a></p>' +
        '<div class="consent-actions">' +
        '<button type="button" class="btn btn-sm" data-consent="denied">Decline</button>' +
        '<button type="button" class="btn btn-sm" data-consent="granted">Accept</button>' +
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
  var optOut = optOutPlace();
  // In an opt-out place, no choice yet and no Global Privacy Control means the cookies load now.
  var byDefault = choice === null && optOut && navigator.globalPrivacyControl !== true;
  if (choice === 'granted' || byDefault) loadAnalytics();

  document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
      if (event.target.closest('[data-consent-open]')) show();
    });
    if (live && choice !== 'granted' && choice !== 'denied' && !optOut) show();
  });
})();
