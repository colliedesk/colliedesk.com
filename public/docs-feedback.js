// Docs pages: "Was this page helpful? Yes / No" sends the PostHog event docs_feedback with the page path
// and the answer. It goes through the posthog object analytics.js set up, so it follows the visitor's
// cookie choice (cookieless until they accept) and is not sent where analytics.js does not run
// (localhost, previews, automated browsers); the reader is thanked either way. One answer per view.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var box = document.querySelector('[data-docs-feedback]');
    if (!box) return;
    var buttons = box.querySelectorAll('button[data-helpful]');
    var status = box.querySelector('[data-docs-feedback-status]');
    var path = box.getAttribute('data-path');
    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function () {
        var helpful = button.getAttribute('data-helpful') === 'yes';
        var posthog = window.posthog;
        if (posthog && typeof posthog.capture === 'function') posthog.capture('docs_feedback', { path: path, helpful: helpful });
        Array.prototype.forEach.call(buttons, function (b) { b.disabled = true; });
        status.textContent = 'Thanks for telling us.';
      });
    });
  });
})();
