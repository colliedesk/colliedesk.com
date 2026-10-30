// The /price-check quiz: one question per screen, then a result built from the visitor's own
// answers, then an optional email that sends the answers to Colliedesk's own inbox (the web form
// channel, like updates.js). The maths is compute(); scripts/price-check.test.mjs checks it.
// Without JavaScript the page shows a short note and the pricing link instead.
(function (root) {
  // compute turns the answers into yearly numbers. perSeat null means "not sure": the popular
  // per-seat plan from the page facts is used and the result says it is an estimate.
  function compute(answers, facts) {
    var agents = answers.agents;
    var estimated = answers.perSeat === null || answers.perSeat === undefined;
    var perSeat = estimated ? facts.typicalPerSeat : answers.perSeat;
    var todayYear = agents * perSeat * 12;
    var founding = agents <= facts.foundingAgents;
    var oursYear = founding ? facts.foundingYear : facts.team25Year;
    var keepYear = todayYear - oursYear;
    var missing = (answers.needs || []).filter(function (n) { return n === 'sso' || n === 'phone' || n === 'psa'; });
    var verdict = missing.length ? 'not-yet' : agents > facts.team25Agents ? 'too-big' : keepYear < 300 ? 'small' : 'save';
    return {
      todayYear: todayYear, oursYear: oursYear, keepYear: keepYear, nextHireYear: perSeat * 12,
      plan: founding ? facts.foundingName : 'Team 25', estimated: estimated, missing: missing, verdict: verdict,
    };
  }

  // attribution keeps the ad source of the landing URL: utm_* and TikTok's ttclid (added to paid
  // ad clicks). Values outside [A-Za-z0-9._-] or over 300 characters are dropped, so nothing
  // a visitor types into the URL reaches the message or the sign-up link.
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ttclid'];
  function attribution(search) {
    var out = {};
    String(search || '').replace(/^\?/, '').split('&').forEach(function (pair) {
      var i = pair.indexOf('=');
      if (i < 1) return;
      var key = decodeURIComponent(pair.slice(0, i));
      var value;
      try { value = decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' ')); } catch (e) { return; }
      if (KEYS.indexOf(key) !== -1 && /^[A-Za-z0-9._-]{1,300}$/.test(value)) out[key] = value;
    });
    return out;
  }
  // withAttribution appends the kept values to a link (sign-up, Founding checkout).
  function withAttribution(href, attr) {
    var parts = KEYS.filter(function (k) { return attr[k]; }).map(function (k) { return k + '=' + encodeURIComponent(attr[k]); });
    if (!parts.length) return href;
    return href + (href.indexOf('?') === -1 ? '?' : '&') + parts.join('&');
  }

  if (typeof module !== 'undefined' && module.exports) { module.exports = { compute: compute, attribution: attribution, withAttribution: withAttribution }; return; }

  var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var attr = attribution(root.location.search);
  var track = function (event, props) {
    if (!root.posthog || !root.posthog.capture) return;
    var all = {};
    Object.keys(attr).forEach(function (k) { all[k] = attr[k]; });
    Object.keys(props || {}).forEach(function (k) { all[k] = props[k]; });
    root.posthog.capture(event, all);
  };

  root.document.addEventListener('DOMContentLoaded', function () {
    var box = root.document.querySelector('[data-price-check]');
    if (!box) return;
    box.classList.add('pc-on');
    var facts = JSON.parse(box.dataset.facts);
    var steps = [].slice.call(box.querySelectorAll('.pc-step'));
    var bar = box.querySelector('[data-pc-bar]');
    var back = box.querySelector('[data-pc-back]');
    var answers = { needs: [], pain: [] };
    var history = [];
    var current = 0;

    function show(index, remember) {
      if (remember) history.push(current);
      steps[current].classList.remove('is-current');
      current = index;
      steps[current].classList.add('is-current');
      bar.style.width = Math.round((current / (steps.length - 1)) * 100) + '%';
      back.hidden = history.length === 0;
      var focus = steps[current].querySelector('h2');
      if (focus) focus.focus();
      track('price_check_step', { step: steps[current].dataset.step });
      if (steps[current].dataset.step === 'result') render();
    }
    function next() { show(current + 1, true); }

    back.addEventListener('click', function () { if (history.length) show(history.pop(), false); });

    // Single-choice answers move on as soon as one is tapped.
    box.addEventListener('click', function (event) {
      var choice = event.target.closest('[data-answer]');
      if (!choice) return;
      var step = choice.closest('.pc-step');
      var key = step.dataset.step;
      if (step.hasAttribute('data-multi')) {
        var on = choice.getAttribute('aria-pressed') !== 'true';
        choice.setAttribute('aria-pressed', String(on));
        if (choice.dataset.answer === 'none' && on) {
          [].forEach.call(step.querySelectorAll('[data-answer]'), function (b) { if (b !== choice) b.setAttribute('aria-pressed', 'false'); });
        } else if (on) {
          var none = step.querySelector('[data-answer="none"]');
          if (none) none.setAttribute('aria-pressed', 'false');
        }
        answers[key] = [].map.call(step.querySelectorAll('[aria-pressed="true"]'), function (b) { return b.dataset.answer; });
        step.querySelector('[data-pc-next]').disabled = answers[key].length === 0;
        return;
      }
      var value = choice.dataset.answer;
      if (value === 'other') { step.querySelector('.pc-other').hidden = false; step.querySelector('.pc-other input').focus(); return; }
      answers[key] = key === 'agents' ? Number(value) : key === 'perSeat' ? (value === 'unsure' ? null : Number(value)) : value;
      answers[key + 'Label'] = key === 'agents' ? (value === '1' ? '1 agent' : value + ' agents') : choice.textContent.trim();
      next();
    });

    // "Type it" inputs for agents above 10 and an exact price per seat.
    [].forEach.call(box.querySelectorAll('.pc-other'), function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var step = form.closest('.pc-step');
        var n = Number(form.querySelector('input').value);
        if (!(n > 0)) return;
        answers[step.dataset.step] = n;
        answers[step.dataset.step + 'Label'] = step.dataset.step === 'agents' ? n + ' agents' : money(n) + ' a seat';
        next();
      });
    });

    [].forEach.call(box.querySelectorAll('[data-pc-next]'), function (b) { b.addEventListener('click', next); });

    function set(name, text) { var el = box.querySelector('[data-r="' + name + '"]'); if (el) el.textContent = text; }
    function toggle(name, on) { var el = box.querySelector('[data-r="' + name + '"]'); if (el) el.hidden = !on; }

    function render() {
      var r = compute(answers, facts);
      answers.result = r;
      set('agents', answers.agentsLabel || answers.agents + ' agents');
      set('perSeat', r.estimated ? 'not sure (we used ' + money(facts.typicalPerSeat) + ', a popular per-seat plan with its AI add-on)' : money(answers.perSeat) + ' a seat each month');
      set('renew', answers.renewLabel || 'not sure');
      set('pain', (answers.painLabels || []).join(', ') || 'not given');
      set('today', money(r.todayYear));
      set('ours', money(r.oursYear));
      set('plan', r.plan === 'Founding' ? 'Founding: ' + money(facts.foundingYear / 4) + ' a quarter, up to ' + facts.foundingAgents + ' agents' : r.plan === facts.foundingName ? facts.foundingName + ': ' + money(facts.foundingYear) + ' a year, up to ' + facts.foundingAgents + ' agents' : 'Team 25: ' + money(facts.team25Year) + ' a year, up to ' + facts.team25Agents + ' agents');
      set('keep', money(Math.max(0, r.keepYear)));
      set('hire', money(r.nextHireYear));
      toggle('estimate', r.estimated);
      toggle('save', r.verdict === 'save');
      toggle('small', r.verdict === 'small');
      toggle('not-yet', r.verdict === 'not-yet');
      toggle('too-big', r.verdict === 'too-big');
      set('missing', r.missing.map(function (m) { return { sso: 'single sign-on', phone: 'phone, SMS or WhatsApp', psa: 'billing per client' }[m]; }).join(', '));
      toggle('renew-soon', answers.renew === 'month' || answers.renew === 'quarter');
      track('price_check_result', { agents: answers.agents, verdict: r.verdict, estimated: r.estimated, renew: answers.renew });
    }

    // Labels for the multi-choice answers, read when the visitor moves on.
    [].forEach.call(box.querySelectorAll('.pc-step[data-multi] [data-pc-next]'), function (b) {
      b.addEventListener('click', function () {
        var step = b.closest('.pc-step');
        answers[step.dataset.step + 'Labels'] = [].map.call(step.querySelectorAll('[aria-pressed="true"]'), function (x) { return x.textContent.trim(); });
      }, true);
    });

    var form = box.querySelector('[data-pc-email]');
    var status = form.querySelector('.pc-status');
    var send = form.querySelector('button');
    var say = function (text, state) { status.textContent = text; status.dataset.state = state; };
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var r = answers.result;
      var message = [
        'Price check from colliedesk.com',
        'Agents: ' + (answers.agentsLabel || answers.agents),
        'Per seat: ' + (r.estimated ? 'not sure' : money(answers.perSeat)),
        'Renews: ' + (answers.renewLabel || 'not sure'),
        'Tickets a month: ' + (answers.volumeLabel || 'not given'),
        'Bothers most: ' + ((answers.painLabels || []).join('; ') || 'not given'),
        'Needs: ' + ((answers.needsLabels || []).join('; ') || 'not given'),
        'Decides: ' + (answers.whoLabel || 'not given'),
        'Source: ' + (Object.keys(attr).map(function (k) { return k + '=' + attr[k]; }).join(' ') || 'direct'),
        'Today ' + money(r.todayYear) + '/yr, ' + r.plan + ' ' + money(r.oursYear) + '/yr, keeps ' + money(Math.max(0, r.keepYear)) + ', verdict ' + r.verdict,
      ].join('\n');
      send.disabled = true;
      say('Sending…', 'busy');
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.value, website: form.website.value, source: 'site:price-check', message: message }),
      }).then(function (res) {
        if (res.status === 202) { say('Sent. We will reply with your numbers and a plan for the move.', 'ok'); track('price_check_email', { verdict: r.verdict }); }
        else if (res.status === 422) say('That email address does not look right.', 'error');
        else if (res.status === 429) say('Too many tries. Wait a minute and try again.', 'error');
        else say('Could not send right now. Please try again later.', 'error');
      }).catch(function () {
        say('Could not reach the server. Check your connection and try again.', 'error');
      }).then(function () { send.disabled = false; });
    });

    // Sign-up and checkout links carry the ad source so the trial can be traced to the post.
    [].forEach.call(box.querySelectorAll('.pc-result .cta-row a'), function (a) { a.href = withAttribution(a.getAttribute('href'), attr); });

    show(0, false);
  });
})(typeof window !== 'undefined' ? window : this);
