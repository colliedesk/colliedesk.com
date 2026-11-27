// Web analytics for colliedesk.com through PostHog, the same project as the Colliedesk app.
// Every visit is counted. Until the visitor clicks Accept in the cookie banner (consent.js),
// PostHog runs cookieless: nothing is stored in the browser and visitors are counted with a
// daily hash PostHog computes on its servers. After Accept it sets its ph_ cookie, so a returning
// visitor is recognised, a trial can be traced to the page that brought it, and PostHog records
// the visit (clicks, scrolls, page changes; form fields masked) to show where a page is unclear.
// JavaScript errors are reported either way, except those no change to this site could fix (dropNoise
// below; scripts/analytics-errors.test.mjs). No person profile
// is ever created and the project discards client IP addresses after deriving the country.
// scripts/check.mjs fails if these settings change.
// Runs on colliedesk.com only, never on localhost or a preview, and never in a browser driven by
// automation (navigator.webdriver: Playwright, Puppeteer, Selenium, an agent checking the site),
// so the visitor count is people.
(function () {
  // An error whose every stack frame has a non-web address (iabjs://, chrome-extension://) was thrown by
  // code the browser or an extension injected: the Facebook in-app browser on Android throws "Java
  // object is gone" while a page unloads. A bare "Script error." is a script from another origin whose
  // error the browser hides; the site's own scripts are same-origin and PostHog's has crossorigin.
  function injectedOnly(e) {
    var frames = e && e.stacktrace && e.stacktrace.frames;
    if (!frames || !frames.length) return !!e && e.value === 'Script error.';
    for (var i = 0; i < frames.length; i++) if (/^https?:/.test((frames[i] && frames[i].filename) || '')) return false;
    return true;
  }
  function dropNoise(event) {
    var list = event && event.event === '$exception' && event.properties && event.properties.$exception_list;
    if (!Array.isArray(list) || !list.length) return event;
    for (var i = 0; i < list.length; i++) if (!injectedOnly(list[i])) return event;
    return null;
  }
  if (location.hostname !== 'colliedesk.com' || navigator.webdriver) return;
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('phc_zDJPtLCpaVyUQg2BbFoLMrzmfQBsfLg6vEJfsTtjyQ3N', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-05-30',
    cookieless_mode: 'on_reject',
    persistence: 'cookie',
    opt_out_capturing_by_default: true,
    person_profiles: 'never',
    // Replay runs only after Accept (PostHog never records a cookieless visit), with every form
    // field masked; the project allows recordings on colliedesk.com only.
    session_recording: { maskAllInputs: true },
    capture_exceptions: true,
    before_send: dropNoise,
  });
  // An Accept from an earlier visit (the banner keeps it under colliedesk-consent) turns the
  // cookie on before the first page view is sent; consent.js reports later choices.
  var choice = null;
  try { choice = localStorage.getItem('colliedesk-consent'); } catch (e) { /* storage blocked: stay cookieless */ }
  if (choice === 'granted') posthog.opt_in_capturing({ captureEventName: false });
})();
