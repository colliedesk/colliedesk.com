// Sizes of buttons and type, measured in headless Chrome by scripts/check-render.mjs. The numbers are
// PostHog's (measured on posthog.com 16/11/2026; owner decision 16/11/2026: copy their sizing and their
// pressable button). A button is a key: a face lifted D px above a darker base it casts with box-shadow,
// higher on hover, lower while pressed, with a 100ms transition only while pressed.
// Run at device pixel ratio 2: at 1 Chrome snaps the 1.5px border to 1px.

const KEY = {
  default: { fontSize: 15, lineHeight: 26, padY: 8, padX: 20, radius: 8, border: 1.5, weight: 700, rest: 4, hover: 6, active: 2 },
  sm: { fontSize: 13, lineHeight: 20, padY: 4, padX: 10, radius: 6, border: 1.5, weight: 700, rest: 2, hover: 3, active: 1 },
};
const PRESS_MS = 0.1;
export const SIZE_SCREENS = [
  { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
  { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false },
];
const HOME = '/index.html', PRICING = '/pricing.html', DOCS = '/docs/inbox.html';
export const SIZE_PAGES = [HOME, PRICING, DOCS];

// face: the element whose text and padding are measured; key: the element that carries the face and base;
// press: the element a visitor hovers and presses (the split control moves as one key).
function keysOf(path, width) {
  const keys = [{ name: 'header "Start free trial"', face: '.header-cta', size: 'sm' }];
  if (width <= 1100) keys.push({ name: 'header "Menu"', face: '.nav-mobile summary', size: 'sm' });
  if (path === HOME) keys.push({ name: 'hero "Start free trial"', face: '.hero-actions .btn-primary', size: 'default' });
  if (path === PRICING) keys.push({ name: 'Founding card "Join"', face: '.plan .btn-primary', size: 'default' });
  if (path === DOCS) keys.push({ name: '"Copy page"', face: '.docs-copy', key: '.docs-ai-group', press: '.docs-copy', size: 'sm' });
  return keys.map((k) => ({ key: k.face, press: k.key ?? k.face, ...k }));
}

// [selector, font-size, line-height] per page type: prose pages (docs) the same at every width, marketing
// pages (home, /pricing) with a smaller hero on phones.
function typeOf(path, width) {
  const phone = width < 641;
  if (path === DOCS) return { h1: ['.page-hero h1', 36, 45], h2: ['.prose h2', 21.4, 30], p: ['.prose p', 15, 22.5] };
  const h1 = phone ? [30, 31.5] : [60, 60];
  if (path === HOME) return { h1: ['.hero-copy h1', ...h1], h2: ['.sheet h2', 28, 35], p: ['.intro-lede', 16, 24] };
  return { h1: ['.page-hero h1', ...h1], h2: ['.prose h2', 28, 35], p: ['.prose p', 16, 24] };
}

// Page-side: computed sizes of a key in its current (possibly forced) state.
const measure = (face, key) => `(() => {
  const f = document.querySelector(${JSON.stringify(face)}), k = document.querySelector(${JSON.stringify(key)});
  if (!f || !k || !f.getClientRects().length) return null;
  const fs = getComputedStyle(f), ks = getComputedStyle(k);
  const m = ks.transform.match(/matrix\\(([^)]+)\\)/);
  const shadows = [...ks.boxShadow.matchAll(/(-?[\\d.]+)px (-?[\\d.]+)px (-?[\\d.]+)px (-?[\\d.]+)px/g)].map((s) => +s[2]);
  return { fontSize: parseFloat(fs.fontSize), lineHeight: parseFloat(fs.lineHeight), weight: +fs.fontWeight,
    padY: parseFloat(fs.paddingTop), padX: parseFloat(fs.paddingLeft), radius: parseFloat(ks.borderTopLeftRadius),
    border: parseFloat(ks.borderTopWidth), lift: m ? -m[1].split(',').map(Number)[5] : 0, shadows,
    transition: parseFloat(ks.transitionDuration) || 0 };
})()`;

const typeMeasure = (sel) => `(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null;
  const s = getComputedStyle(e); return { fontSize: parseFloat(s.fontSize), lineHeight: s.lineHeight === 'normal' ? null : parseFloat(s.lineHeight) }; })()`;

// Page-side: every key on the page, scrolled to the middle of the screen. Its footprint runs from the face
// at hover height to the base's bottom edge (1.5px under the layout box). A scroll box around it must hold
// the whole footprint, and no other element may sit inside it (the next line starts at or after the base).
export const CLIPPED_KEYS = `document.fonts.ready.then(() => {
  const out = [];
  const keys = [...document.querySelectorAll('.btn:not(.is-placeholder), .nav-mobile summary, .docs-ai-group, .docs-search-open')]
    .filter((e) => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden' && !e.closest('dialog, .docs-ai-group > *'));
  for (const e of keys) {
    const label = (e.textContent.trim().replace(/\\s+/g, ' ') || e.getAttribute('aria-label') || e.className).slice(0, 40);
    const s = getComputedStyle(e);
    const m = s.transform.match(/matrix\\(([^)]+)\\)/);
    const rest = m ? -m[1].split(',').map(Number)[5] : 0;
    if (!(rest > 0) || !/px/.test(s.boxShadow)) { out.push('"' + label + '" has no raised face over a base'); continue; }
    const hover = rest * 1.5;
    e.scrollIntoView({ block: 'center', inline: 'nearest' });
    const r = e.getBoundingClientRect();
    const top = r.top + rest - hover, bottom = r.bottom + rest + 1.5;
    for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
      const as = getComputedStyle(a);
      if (as.overflowX === 'visible' && as.overflowY === 'visible') continue;
      const ar = a.getBoundingClientRect();
      if (ar.top > top + 0.5 || ar.bottom < bottom - 0.5) out.push('"' + label + '" is clipped by ' + a.tagName.toLowerCase() + '.' + String(a.className).split(' ')[0]);
    }
    const inHeader = e.closest('.site-header');
    const xs = r.width > 24 ? [r.left + 8, (r.left + r.right) / 2, r.right - 8] : [(r.left + r.right) / 2];
    for (const [y, where] of [[top + 0.5, 'above'], [bottom - 0.5, 'under']]) {
      if (y < 0 || y >= innerHeight) continue;
      for (const x of xs) {
        const hit = document.elementFromPoint(x, y);
        if (!hit || hit === e || e.contains(hit) || hit.contains(e)) continue;
        if (!inHeader && hit.closest('.site-header')) continue;
        out.push('"' + label + '" overlaps ' + hit.tagName.toLowerCase() + (hit.className ? '.' + String(hit.className).split(' ')[0] : '') + ' ' + where + ' it');
        break;
      }
    }
  }
  return [...new Set(out)];
})`;

const near = (a, b) => typeof a === 'number' && Math.abs(a - b) < 0.06;

export async function checkSizes({ send, once, sessionId, port }) {
  const failures = [];
  const ev = async (expression, awaitPromise = false) => (await send('Runtime.evaluate', { returnByValue: true, awaitPromise, expression }, sessionId)).result.value;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  await send('DOM.enable', {}, sessionId);
  await send('CSS.enable', {}, sessionId);
  const force = async (sel, states) => {
    const { root } = await send('DOM.getDocument', {}, sessionId);
    const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: sel }, sessionId);
    if (nodeId) await send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: states }, sessionId);
    await sleep(states.length ? 250 : 50);
  };
  for (const screen of SIZE_SCREENS) {
    await send('Emulation.setDeviceMetricsOverride', screen, sessionId);
    for (const path of SIZE_PAGES) {
      const at = `${path} at ${screen.width}px`;
      const loaded = once('Page.loadEventFired', sessionId);
      await send('Page.navigate', { url: `http://localhost:${port}${path}` }, sessionId);
      await loaded;
      await ev('document.fonts.ready.then(() => true)', true);
      for (const k of keysOf(path, screen.width)) {
        const want = KEY[k.size];
        const rest = await ev(measure(k.face, k.key));
        if (!rest) { failures.push(`${at}: ${k.name} is missing`); continue; }
        for (const p of ['fontSize', 'lineHeight', 'weight', 'padY', 'padX', 'radius', 'border']) {
          if (!near(rest[p], want[p])) failures.push(`${at}: ${k.name} ${p} is ${rest[p]}, want ${want[p]}`);
        }
        const states = [['rest', rest, 0]];
        await force(k.press, ['hover']);
        states.push(['hover', await ev(measure(k.face, k.key)), 0]);
        await force(k.press, ['hover', 'active']);
        states.push(['active', await ev(measure(k.face, k.key)), PRESS_MS]);
        await force(k.press, []);
        for (const [state, got, transition] of states) {
          const d = want[state];
          if (!near(got.lift, d)) failures.push(`${at}: ${k.name} ${state} face is ${got.lift}px up, want ${d}`);
          if (!near(got.shadows[0], d) || !near(got.shadows[1], d + 1.5)) failures.push(`${at}: ${k.name} ${state} base shadows at ${got.shadows.join('/')}px, want ${d}/${d + 1.5}`);
          if (!near(got.transition, transition)) failures.push(`${at}: ${k.name} ${state} transition is ${got.transition}s, want ${transition}s`);
        }
      }
      for (const [tag, [sel, size, lh]] of Object.entries(typeOf(path, screen.width))) {
        const got = await ev(typeMeasure(sel));
        if (!got) failures.push(`${at}: no ${sel}`);
        else if (!near(got.fontSize, size) || !near(got.lineHeight, lh)) failures.push(`${at}: ${tag} (${sel}) is ${got.fontSize}/${got.lineHeight}, want ${size}/${lh}`);
      }
    }
  }
  // Reduced motion keeps the depths but drops the press transition.
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId);
  await force('.header-cta', ['hover', 'active']);
  const still = await ev(measure('.header-cta', '.header-cta'));
  await force('.header-cta', []);
  await send('Emulation.setEmulatedMedia', { features: [] }, sessionId);
  if (!still || still.transition !== 0 || !near(still.lift, KEY.sm.active)) failures.push(`${DOCS}: with reduced motion the pressed header button should sit ${KEY.sm.active}px up with no transition, got ${JSON.stringify(still && { lift: still.lift, transition: still.transition })}`);
  return failures;
}
