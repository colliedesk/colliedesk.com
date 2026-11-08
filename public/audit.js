// Sends the /audit form as JSON to the Colliedesk web form channel (a conversation in HC Labs' own
// workspace) and reports the result in the form's status line. Only after the endpoint answers 202
// does it tell the Meta pixel (Lead) and PostHog (audit_requested, team size only) about it, and only
// when public/consent.js has loaded them. It never loads a tracker and never passes the email or the
// help center address to one. scripts/audit-form.test.mjs covers it.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('[data-audit-form]');
    if (!form) return;
    var status = form.querySelector('.audit-status');
    var button = form.querySelector('button');
    var say = function (text, state) { status.textContent = text; status.dataset.state = state; };

    var isWebAddress = function (value) {
      try {
        var protocol = new URL(value).protocol;
        return protocol === 'http:' || protocol === 'https:';
      } catch (e) { return false; }
    };

    var utmLine = function () {
      var params = new URLSearchParams(location.search);
      var parts = ['utm_source', 'utm_campaign', 'utm_content']
        .filter(function (key) { return params.get(key); })
        .map(function (key) { return key + '=' + params.get(key); });
      return parts.length ? '\nUTM: ' + parts.join(' ') : '';
    };

    var track = function (band) {
      try {
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'audit' });
        if (window.posthog && typeof window.posthog.capture === 'function') window.posthog.capture('audit_requested', { team_size: band });
      } catch (e) { /* a blocked tracker must not turn a sent request into an error */ }
    };

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var helpCenter = form.helpcenter.value.trim();
      var band = form.team.value;
      if (!isWebAddress(helpCenter)) {
        say('Enter your help center address, starting with https://', 'error');
        return;
      }
      button.disabled = true;
      say('Sending…', 'busy');
      var message = 'Help center audit request\nHelp center: ' + helpCenter + '\nAgents: ' + band +
        '\nPage: ' + location.origin + location.pathname + utmLine();
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.value.trim(), message: message, source: 'site:audit', website: form.website.value }),
      }).then(function (res) {
        if (res.status === 202) {
          form.reset();
          say('Got it. You will get the list by email within 24 hours.', 'ok');
          track(band);
        }
        else if (res.status === 422) say('That email address or help center address does not look right.', 'error');
        else if (res.status === 429) say('Too many tries. Wait a minute and try again.', 'error');
        else say('Could not send your request right now. Please try again later.', 'error');
      }).catch(function () {
        say('Could not reach the server. Check your connection and try again.', 'error');
      }).then(function () { button.disabled = false; });
    });
  });
})();
