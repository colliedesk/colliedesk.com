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
const HOME = '/index.html', AUDIT = '/audit.html';
const BOTH = [390, 1440];

// A field is a slot as tall as the key face beside it, with the amber outline on focus.
const field = (name, page, sel, t) => ({
  name, page, sel, widths: BOTH, theme: t,
  states: {
    rest: { height: 45, border: 1, line: C[t].control, lip: `${C[t].surface2} 0px 2px 0px 0px inset` },
    hover: { line: C[t].strong },
    focus: { outline: `solid 2px ${C[t].focus}`, line: C[t].strong },
  },
});

export const PROBES = [
  ...['light', 'dark'].flatMap((t) => [
    field(`${t} footer updates field`, HOME, '.updates-row input', t),
    field(`${t} audit email field`, AUDIT, '.audit-form input[type="email"]', t),
    field(`${t} audit select`, AUDIT, '.audit-form select', t),
  ]),
  { name: '"Your privacy choices" link button', page: HOME, sel: '.link-button', widths: BOTH, theme: 'light',
    states: { focus: { outline: `solid 2px ${C.light.focus}` } } },
];

// Page-side: the computed values a probe can ask for.
const measure = (sel) => `(() => {
  const e = document.querySelector(${JSON.stringify(sel)});
  if (!e || !e.getClientRects().length) return null;
  const s = getComputedStyle(e), r = e.getBoundingClientRect();
  const m = s.transform.match(/matrix\\(([^)]+)\\)/);
  return { height: r.height, border: parseFloat(s.borderTopWidth), line: s.borderTopColor, lip: s.boxShadow,
    outline: s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor, bg: s.backgroundColor, nudge: s.translate,
    mark: s.borderLeftColor, markWidth: parseFloat(s.borderLeftWidth), weight: +s.fontWeight, color: s.color,
    lift: m ? -m[1].split(',').map(Number)[5] : 0,
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
      const loaded = once('Page.loadEventFired', sessionId);
      await send('Page.navigate', { url: `http://localhost:${port}${p.page}` }, sessionId);
      await loaded;
      await ev(`document.fonts.ready.then(() => {
        document.documentElement.setAttribute('data-theme', ${JSON.stringify(p.theme)});
        ${p.setup ?? ''}
        document.querySelector(${JSON.stringify(p.sel)})?.scrollIntoView({ block: 'center' });
        return true; })`);
      const { root } = await send('DOM.getDocument', {}, sessionId);
      const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: p.sel }, sessionId);
      if (!nodeId) { failures.push(`${at}: ${p.name} (${p.sel}) is missing`); continue; }
      for (const [state, want] of Object.entries(p.states)) {
        await send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: FORCED[state] }, sessionId);
        await sleep(state === 'rest' ? 50 : 250);
        const got = await ev(measure(p.sel));
        if (!got) { failures.push(`${at}: ${p.name} is not shown`); break; }
        for (const [prop, value] of Object.entries(want)) {
          if (!same(got[prop], value)) failures.push(`${at}: ${p.name} ${state} ${prop} is ${got[prop]}, want ${value}`);
        }
      }
      await send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] }, sessionId);
    }
  }
  return failures;
}
