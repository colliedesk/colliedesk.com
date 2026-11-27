// The pages ads and cold email link to must show their action in the first screen, above the cookie banner
// that every visitor from an opt-in place (UK, Ireland, Toronto) sees on arrival. Screens are the smallest
// common sizes PostHog recorded on these pages from 04 to 18/11/2026: a 360 x 653 Android phone (rounded
// down to 360 x 640) and an 1180 x 682 laptop. On a 360 x 640 phone the switch page's
// "Book a 30-min switch call" sat under the banner.
// The action is every key in the hero's CTA row, or the first field of the hero form (its submit follows
// the fields the visitor fills in first).
export const FIRST_SCREEN_PAGES = ['/migrate/freshdesk/switch', '/audit'];
export const FIRST_SCREENS = [
  { width: 360, height: 640, deviceScaleFactor: 1, mobile: true },
  { width: 1180, height: 682, deviceScaleFactor: 1, mobile: false },
];

const MEASURE = `document.fonts.ready.then(() => {
  document.querySelector('[data-consent-open]')?.click();
  const banner = document.querySelector('.consent-banner:not([hidden])');
  const limit = banner ? banner.getBoundingClientRect().top : innerHeight;
  const hero = document.querySelector('main .page-hero');
  const actions = hero ? [...hero.querySelectorAll('.cta-row .btn'), ...[...hero.querySelectorAll('form input:not([type=hidden]):not([tabindex="-1"])')].slice(0, 1)] : [];
  return {
    banner: !!banner, limit: Math.round(limit),
    actions: actions.map((e) => ({ label: (e.textContent.trim() || e.getAttribute('aria-label') || e.labels?.[0]?.textContent || e.name).replace(/\\s+/g, ' ').slice(0, 40), bottom: Math.round(e.getBoundingClientRect().bottom) })),
  };
})`;

export async function checkFirstScreen({ send, once, sessionId, port }) {
  const failures = [];
  for (const screen of FIRST_SCREENS) {
    await send('Emulation.setDeviceMetricsOverride', screen, sessionId);
    for (const path of FIRST_SCREEN_PAGES) {
      const at = `${path} at ${screen.width}x${screen.height}`;
      const loaded = once('Page.loadEventFired', sessionId);
      await send('Page.navigate', { url: `http://localhost:${port}${path}` }, sessionId);
      await loaded;
      const { result } = await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: MEASURE }, sessionId);
      const { banner, limit, actions } = result.value;
      if (!banner) failures.push(`${at}: the cookie banner did not open`);
      if (!actions.length) { failures.push(`${at}: the hero has no action (CTA row or form)`); continue; }
      for (const a of actions) {
        if (a.bottom > limit) failures.push(`${at}: "${a.label}" ends at ${a.bottom}px, under the cookie banner or the fold at ${limit}px`);
      }
    }
  }
  return failures;
}
