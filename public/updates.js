// Sends every updates form on the page as JSON to the Colliedesk web form channel and reports the
// result in the form's status line. Without this script the box does nothing harmful: the
// endpoint only accepts JSON.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-updates-form]').forEach(bind);
  });

  function bind(form) {
    var status = form.querySelector('.updates-status');
    var button = form.querySelector('button');
    var say = function (text, state) { status.textContent = text; status.dataset.state = state; };
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      button.disabled = true;
      say('Sending…', 'busy');
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.value, website: form.website.value, source: 'site:updates ' + location.pathname }),
      }).then(function (res) {
        if (res.status === 202) { form.reset(); say('Done. You will get the next release notes.', 'ok'); }
        else if (res.status === 422) say('That email address does not look right.', 'error');
        else if (res.status === 429) say('Too many tries. Wait a minute and try again.', 'error');
        else say('Could not subscribe right now. Please try again later.', 'error');
      }).catch(function () {
        say('Could not reach the server. Check your connection and try again.', 'error');
      }).then(function () { button.disabled = false; });
    });
  }
})();
