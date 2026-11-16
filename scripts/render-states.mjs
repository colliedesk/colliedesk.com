// States of the tactile site, measured in headless Chrome by scripts/check-render.mjs. Three answers to the
// pointer: keys (a face on a solid base; a key whose state is on stays held at the press depth on a grey
// face with a darker rim), rows (a grey fill on hover, a darker fill when current, 1px down while pressed)
// and fields (slots: a 1px control line with a 2px grey lip, the amber focus outline). The expected colours
// are the app tokens (public/tokens.css) written out, so a token swap shows up here.

const C = {
  light: {
    surface0: 'rgb(250, 250, 250)', surface2: 'rgb(244, 244, 244)', surface3: 'rgb(235, 235, 235)',
    line: 'rgb(232, 232, 232)', control: 'rgb(173, 173, 173)', strong: 'rgb(133, 133, 133)',
    focus: 'rgb(184, 110, 0)', accent: 'rgb(194, 65, 12)',
  },
  dark: {
    surface0: 'rgb(10, 10, 10)', surface2: 'rgb(28, 28, 28)', surface3: 'rgb(38, 38, 38)',
    line: 'rgb(38, 38, 38)', control: 'rgb(77, 77, 77)', strong: 'rgb(120, 120, 120)',
    focus: 'rgb(240, 180, 76)', accent: 'rgb(251, 138, 74)',
  },
};
const HOME = '/index.html', PRICING = '/pricing.html', AUDIT = '/audit.html', DOCS = '/docs/inbox.html', VS = '/vs/freshdesk.html';
const BOTH = [390, 1440];
// Stands for the Highlight system colour, which the platform picks.
const HIGHLIGHT = 'system Highlight';

// A field is a slot as tall as the key face beside it, with the amber outline on focus.
const field = (name, page, sel, t) => ({
  name, page, sel, widths: BOTH, theme: t,
  states: {
    rest: { height: 45, border: 1, line: C[t].control, lip: `${C[t].surface2} 0px 2px 0px 0px inset` },
    hover: { line: C[t].strong },
    focus: { outline: `solid 2px ${C[t].focus}`, line: C[t].strong },
  },
});

// A held key: at the press depth of a small key (1px, the base under it at 1/2.5px), grey face, darker rim,
// and hover does not lift it.
const held = (t) => ({
  rest: { lift: 1, shadows: '1/2.5', bg: C[t].surface3, line: C[t].strong },
  hover: { lift: 1, shadows: '1/2.5' },
});

export const PROBES = [
  ...['light', 'dark'].flatMap((t) => [
    field(`${t} footer updates field`, HOME, '.updates-row input', t),
    field(`${t} audit email field`, AUDIT, '.audit-form input[type="email"]', t),
    field(`${t} audit select`, AUDIT, '.audit-form select', t),
  ]),
  { name: '"Your privacy choices" link button', page: HOME, sel: '.link-button', widths: BOTH, theme: 'light',
    states: { focus: { outline: `solid 2px ${C.light.focus}` } } },
  ...['light', 'dark'].map((t) => ({ name: `${t} phone "Menu" while open`, page: HOME, sel: '.nav-mobile summary', widths: [390], theme: t,
    setup: `document.querySelector('.nav-mobile').open = true;`, states: held(t) })),
  // Options (the bill by team size, the /vs team size): the chosen one is held; the radio is hidden, so the
  // amber focus outline is drawn on the key.
  ...[['light', HOME, '.segmented'], ['dark', HOME, '.segmented'], ['light', VS, '.vs-sizes'], ['dark', VS, '.vs-sizes']].flatMap(([t, page, group]) => [
    { name: `${t} chosen option`, page, sel: `${group} label:has(input:checked)`, widths: BOTH, theme: t, states: held(t) },
    { name: `${t} option with keyboard focus`, page, sel: `${group} label:not(:has(input:checked))`, force: `${group} label:not(:has(input:checked)) input`,
      widths: BOTH, theme: t, states: { focus: { outline: `solid 2px ${C[t].focus}` } } },
  ]),
  { name: '/vs option', page: VS, sel: '.vs-sizes label:not(:has(input:checked))', widths: BOTH, theme: 'light',
    states: { rest: { lift: 2, shadows: '2/3.5', border: 1.5 }, hover: { lift: 3 }, active: { lift: 1 } } },
  // Rows: a grey fill on hover, a darker fill when current, 1px down while pressed.
  { name: 'desktop nav link', page: HOME, sel: '.nav-desktop a:not([aria-current])', widths: [1440], theme: 'light',
    states: { rest: { nudge: 'none' }, hover: { bg: C.light.surface2 }, active: { nudge: '0px 1px' } } },
  ...['light', 'dark'].map((t) => ({ name: `${t} desktop nav current page`, page: PRICING, sel: '.nav-desktop a[aria-current="page"]', widths: [1440], theme: t,
    states: { rest: { bg: C[t].surface3 } } })),
  { name: 'phone menu row', page: HOME, sel: '.nav-mobile nav a:not([aria-current])', widths: [390], theme: 'light',
    setup: `document.querySelector('.nav-mobile').open = true;`, states: { hover: { bg: C.light.surface2 }, active: { nudge: '0px 1px' } } },
  { name: 'docs sidebar link', page: DOCS, sel: '.docs-sidebar .docs-nav a:not([aria-current])', widths: [1440], theme: 'light',
    states: { hover: { bg: C.light.surface2 }, active: { nudge: '0px 1px' } } },
  // The current page keeps the one orange mark the docs sidebar is allowed.
  ...['light', 'dark'].map((t) => ({ name: `${t} docs sidebar current page`, page: DOCS, sel: '.docs-sidebar .docs-nav a[aria-current="page"]', widths: [1440], theme: t,
    states: { rest: { bg: C[t].surface3, mark: C[t].accent, markWidth: 2, weight: 600 } } })),
  { name: '"Copy page" menu row', page: DOCS, sel: '.docs-ai-menu a', widths: BOTH, theme: 'light',
    setup: `document.querySelector('.docs-ai').open = true;`, states: { hover: { bg: C.light.surface2 }, active: { nudge: '0px 1px' } } },
  // Docs on a phone or tablet: "Docs menu" and "On this page" are small keys, held while open.
  ...['light', 'dark'].flatMap((t) => [
    { name: `${t} "Docs menu" while open`, page: DOCS, sel: '.docs-menu summary', widths: [390], theme: t,
      setup: `document.querySelector('.docs-menu').open = true;`, states: held(t) },
    { name: `${t} "On this page" while open`, page: DOCS, sel: '.docs-toc-mobile summary', widths: [390], theme: t,
      setup: `document.querySelector('.docs-toc-mobile').open = true;`, states: held(t) },
  ]),
  { name: 'docs pager tile', page: DOCS, sel: '.docs-pager a', widths: BOTH, theme: 'light',
    states: { focus: { outline: `solid 2px ${C.light.focus}`, offset: 3 } } },
  { name: 'search dialog', page: DOCS, sel: '.docs-search', widths: [1440], theme: 'light', setup: `document.querySelector('.docs-search').showModal();`,
    states: { rest: { lip: 'rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 24px 56px -12px' } } },
  // A keyboard key in text is a keycap: one line around, two under.
  { name: 'search keycap', page: DOCS, sel: '.docs-sidebar .docs-search-open kbd', widths: [1440], theme: 'light',
    states: { rest: { border: 1, under: 2, radius: 4, line: C.light.control } } },
  // Paper: a note in prose is a neutral sheet on a hairline ring, with no orange bar.
  ...['light', 'dark'].map((t) => ({ name: `${t} docs note`, page: '/docs/results.html', sel: '.prose blockquote', widths: [1440], theme: t,
    states: { rest: { bg: C[t].surface0, markWidth: 0, lip: `${C[t].line} 0px 0px 0px 1px`, radius: 6 } } })),
  // Forced colours drop the grey face and the base, so a held key takes the system highlight.
  { name: 'chosen option in forced colours', page: HOME, sel: '.segmented label:has(input:checked)', widths: [1440], theme: 'light',
    media: [{ name: 'forced-colors', value: 'active' }], states: { rest: { bg: HIGHLIGHT } } },
  // The toggle is on only in the dark theme.
  { name: 'dark "Dark theme" toggle while on', page: HOME, sel: '.theme-toggle', widths: BOTH, theme: 'dark',
    setup: `document.querySelector('.theme-toggle').setAttribute('aria-pressed', 'true');`, states: held('dark') },
  // Disabled (feedback after an answer): sunk, grey, no base.
  { name: 'docs feedback "Yes" after an answer', page: DOCS, sel: '.docs-feedback .btn', widths: BOTH, theme: 'light',
    setup: `document.querySelectorAll('.docs-feedback .btn').forEach((b) => { b.disabled = true; });`,
    states: { rest: { lift: 0, shadows: '', bg: C.light.surface2, line: C.light.line, color: 'rgb(99, 99, 99)' }, hover: { lift: 0, shadows: '' } } },
];

// A probe measures `sel` after forcing each state on `force` (default: `sel` itself).
// Page-side: the computed values a probe can ask for.
const measure = (sel) => `(() => {
  const e = document.querySelector(${JSON.stringify(sel)});
  if (!e || !e.getClientRects().length) return null;
  const s = getComputedStyle(e), r = e.getBoundingClientRect();
  const m = s.transform.match(/matrix\\(([^)]+)\\)/);
  return { height: r.height, border: parseFloat(s.borderTopWidth), line: s.borderTopColor, lip: s.boxShadow,
    outline: s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor, offset: parseFloat(s.outlineOffset),
    under: parseFloat(s.borderBottomWidth), radius: parseFloat(s.borderTopLeftRadius), bg: s.backgroundColor, nudge: s.translate,
    mark: s.borderLeftColor, markWidth: parseFloat(s.borderLeftWidth), weight: +s.fontWeight, color: s.color,
    lift: m ? -m[1].split(',').map(Number)[5] : 0,
    highlight: (() => { const h = document.createElement('i'); h.style.cssText = 'forced-color-adjust: none; background: Highlight'; document.body.append(h); const c = getComputedStyle(h).backgroundColor; h.remove(); return c; })(),
    shadows: [...s.boxShadow.matchAll(/(-?[\\d.]+)px (-?[\\d.]+)px (-?[\\d.]+)px (-?[\\d.]+)px/g)].map((x) => +x[2]).join('/') };
})()`;

const FORCED = { rest: [], hover: ['hover'], active: ['hover', 'active'], focus: ['focus', 'focus-visible'] };
const same = (got, want) => (typeof want === 'number' ? typeof got === 'number' && Math.abs(got - want) < 0.06 : got === want);

export async function checkStates({ send, once, sessionId, port }) {
  const failures = [];
  const ev = async (expression) => (await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression }, sessionId)).result.value;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  await send('DOM.enable', {}, sessionId);
  await send('CSS.enable', {}, sessionId);
  for (const p of PROBES) {
    for (const width of p.widths) {
      const at = `${p.page} at ${width}px`;
      await send('Emulation.setDeviceMetricsOverride', { width, height: width < 641 ? 844 : 900, deviceScaleFactor: 2, mobile: width < 641 }, sessionId);
      await send('Emulation.setEmulatedMedia', { features: p.media ?? [] }, sessionId);
      const loaded = once('Page.loadEventFired', sessionId);
      await send('Page.navigate', { url: `http://localhost:${port}${p.page}` }, sessionId);
      await loaded;
      await ev(`document.fonts.ready.then(() => {
        document.documentElement.setAttribute('data-theme', ${JSON.stringify(p.theme)});
        ${p.setup ?? ''}
        document.querySelector(${JSON.stringify(p.sel)})?.scrollIntoView({ block: 'center' });
        return true; })`);
      const { root } = await send('DOM.getDocument', {}, sessionId);
      const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: p.force ?? p.sel }, sessionId);
      if (!nodeId) { failures.push(`${at}: ${p.name} (${p.force ?? p.sel}) is missing`); continue; }
      for (const [state, want] of Object.entries(p.states)) {
        await send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: FORCED[state] }, sessionId);
        await sleep(state === 'rest' ? 50 : 250);
        const got = await ev(measure(p.sel));
        if (!got) { failures.push(`${at}: ${p.name} is not shown`); break; }
        for (const [prop, w] of Object.entries(want)) {
          const value = w === HIGHLIGHT ? got.highlight : w;
          if (!same(got[prop], value)) failures.push(`${at}: ${p.name} ${state} ${prop} is ${got[prop]}, want ${value}`);
        }
      }
      await send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] }, sessionId);
    }
  }
  await send('Emulation.setEmulatedMedia', { features: [] }, sessionId);
  return failures;
}
