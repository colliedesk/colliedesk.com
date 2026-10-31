// Renders every built page in headless Chrome and fails when what a person sees is broken, which static
// checks cannot catch:
//   - at a 375px phone width a page scrolls sideways (a nowrap label or a wide table only overflows once
//     the browser lays it out);
//   - in the light or the dark theme a button or link's text is below 4.5:1 against what is behind it
//     (19/10/2026 the closing band's "Start free trial" was dark text on a transparent button on ink);
//   - with the cookie banner open (it shows only on colliedesk.com, so it is opened here through the
//     "Cookie settings" button), it covers a button or link-button that starts in the first view of a
//     1280x800 desktop or a 390x844 phone, or takes more than 15% of that screen (30/10/2026 it hid half of
//     "Join for $99 every 3 months" on /pricing and a quarter of every phone screen).
// No dependencies: Chrome DevTools Protocol over Node's built-in WebSocket.
//   node scripts/check-render.mjs            (needs _site/ and a Chrome binary; CHROME_BIN overrides)
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const WIDTH = 375;
const MIN_CONTRAST = 4.5;
const BANNER_SCREENS = [
  { name: 'desktop', width: 1280, height: 800, mobile: false },
  { name: 'phone', width: 390, height: 844, mobile: true },
];
const MAX_BANNER_SHARE = 0.15;
const site = fileURLToPath(new URL('../_site/', import.meta.url));
const chromeBin = process.env.CHROME_BIN
  || ['google-chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((b) => !b.startsWith('/') || existsSync(b));

function pages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return pages(p);
    return e.name.endsWith('.html') ? ['/' + relative(site, p).split(sep).join('/')] : [];
  });
}

function waitForLine(proc, re, label) {
  return new Promise((resolve, reject) => {
    let buf = '';
    const onData = (d) => { buf += d; const m = buf.match(re); if (m) resolve(m); };
    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);
    proc.on('exit', (code) => reject(new Error(`${label} exited (${code}) before it was ready:\n${buf}`)));
  });
}

function cdp(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const waiting = new Map();
  const listeners = [];
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id && waiting.has(msg.id)) {
      const { resolve, reject } = waiting.get(msg.id);
      waiting.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else listeners.forEach((l) => l(msg));
  };
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    waiting.set(++id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
  const once = (method, sessionId) => new Promise((resolve) => {
    const l = (msg) => { if (msg.method === method && msg.sessionId === sessionId) { listeners.splice(listeners.indexOf(l), 1); resolve(msg.params); } };
    listeners.push(l);
  });
  return new Promise((resolve, reject) => { ws.onopen = () => resolve({ send, once, close: () => ws.close() }); ws.onerror = reject; });
}

// Page-side check: switches the theme with transitions off, then measures each visible control's text
// colour against the first opaque background behind it (alpha-blended colours are skipped).
function lowContrast(theme) {
  return `(() => {
    document.documentElement.setAttribute('data-theme', '${theme}');
    const style = document.createElement('style'); style.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}';
    document.head.append(style);
    const rgb = (c) => { const m = c.match(/[\\d.]+/g); return m ? m.map(Number) : null; };
    const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
    const bgOf = (el) => { for (; el; el = el.parentElement) { const c = rgb(getComputedStyle(el).backgroundColor); if (c && (c[3] ?? 1) >= 0.95) return c; } return [255, 255, 255]; };
    const out = [];
    for (const e of document.querySelectorAll('a, button, summary, .btn')) {
      const b = e.getBoundingClientRect(); const s = getComputedStyle(e);
      if (!b.width || !b.height || !e.textContent.trim() || s.visibility === 'hidden' || +s.opacity === 0) continue;
      const fg = rgb(s.color); if (!fg || (fg[3] ?? 1) < 0.95) continue;
      const bg = bgOf(e); const [hi, lo] = [lum(fg), lum(bg)].sort((x, y) => y - x); const ratio = (hi + 0.05) / (lo + 0.05);
      if (ratio < ${MIN_CONTRAST}) out.push({ text: e.textContent.trim().replace(/\\s+/g, ' ').slice(0, 40), ratio: ratio.toFixed(2), fg: s.color, bg: 'rgb(' + bg.slice(0, 3).join(', ') + ')' });
    }
    style.remove(); document.documentElement.removeAttribute('data-theme');
    return out;
  })()`;
}

// Page-side check: opens the cookie banner the way a visitor reopens it, then reports how much of the screen it
// takes and which buttons that start in the first view it overlaps.
const OPEN_BANNER = `document.querySelector('[data-consent-open]')?.click()`;
const bannerCover = `document.fonts.ready.then(() => {
  ${OPEN_BANNER};
  const banner = document.querySelector('.consent-banner');
  if (!banner || banner.hidden) return { opened: false };
  const bar = banner.getBoundingClientRect();
  const covered = [];
  for (const e of document.querySelectorAll('a.btn, button.btn')) {
    if (banner.contains(e)) continue;
    const b = e.getBoundingClientRect(); const s = getComputedStyle(e);
    if (!b.width || !b.height || s.visibility === 'hidden' || +s.opacity === 0) continue;
    if (b.top >= innerHeight || b.right <= 0 || b.left >= innerWidth) continue;
    if (b.left < bar.right && b.right > bar.left && b.top < bar.bottom && b.bottom > bar.top) covered.push(e.textContent.trim().replace(/\\s+/g, ' ').slice(0, 50));
  }
  return { opened: true, share: bar.height / innerHeight, covered };
})`;

if (!existsSync(join(site, 'index.html'))) { console.error('check-render: _site/ is missing; build the site first'); process.exit(1); }

const port = 4400 + Math.floor(Math.random() * 500);
const server = spawn(process.execPath, [fileURLToPath(new URL('./serve.mjs', import.meta.url))], { env: { ...process.env, PORT: String(port) } });
const profile = mkdtempSync(join(tmpdir(), 'check-render-'));
const chrome = spawn(chromeBin, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank']);
const failures = [];
let list = [];
try {
  await waitForLine(server, /serving/, 'serve.mjs');
  const [, wsUrl] = await waitForLine(chrome, /DevTools listening on (ws:\S+)/, chromeBin);
  const c = await cdp(wsUrl);
  const { targetId } = await c.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await c.send('Target.attachToTarget', { targetId, flatten: true });
  await c.send('Page.enable', {}, sessionId);
  await c.send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: 812, deviceScaleFactor: 1, mobile: true }, sessionId);
  list = pages(site);
  for (const path of list) {
    const loaded = c.once('Page.loadEventFired', sessionId);
    await c.send('Page.navigate', { url: `http://localhost:${port}${path}` }, sessionId);
    await loaded;
    const { result } = await c.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const w = document.documentElement.clientWidth, sw = document.documentElement.scrollWidth;
        if (sw <= w) return null;
        const clipped = (e) => { for (let p = e.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o !== 'visible') return true; } return false; };
        const worst = [...document.body.querySelectorAll('*')].filter((e) => e.getBoundingClientRect().right > w + 0.5 && !clipped(e))
          .map((e) => e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).trim().split(/\\s+/).join('.') : '') + ' "' + e.textContent.trim().slice(0, 40) + '"');
        return sw + 'px wide; ' + (worst.slice(-1)[0] || 'no single element');
      })()`,
    }, sessionId);
    if (result.value) failures.push(`${path}: scrolls sideways at ${WIDTH}px, ${result.value}`);
    await c.send('Runtime.evaluate', { expression: OPEN_BANNER }, sessionId);
    for (const theme of ['light', 'dark']) {
      const { result: low } = await c.send('Runtime.evaluate', { returnByValue: true, expression: lowContrast(theme) }, sessionId);
      for (const l of low.value) failures.push(`${path}: ${theme} theme, "${l.text}" ${l.ratio}:1 (${l.fg} on ${l.bg}), needs ${MIN_CONTRAST}:1`);
    }
  }
  for (const screen of BANNER_SCREENS) {
    await c.send('Emulation.setDeviceMetricsOverride', { width: screen.width, height: screen.height, deviceScaleFactor: 1, mobile: screen.mobile }, sessionId);
    for (const path of list) {
      const loaded = c.once('Page.loadEventFired', sessionId);
      await c.send('Page.navigate', { url: `http://localhost:${port}${path}` }, sessionId);
      await loaded;
      const { result } = await c.send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: bannerCover }, sessionId);
      const at = `${screen.width}x${screen.height}`;
      if (!result.value.opened) { failures.push(`${path}: the "Cookie settings" button did not open the cookie banner at ${at}`); continue; }
      for (const label of result.value.covered) failures.push(`${path}: the cookie banner covers "${label}" at ${at}`);
      if (result.value.share > MAX_BANNER_SHARE) failures.push(`${path}: the cookie banner takes ${Math.round(result.value.share * 100)}% of the ${at} screen, max ${MAX_BANNER_SHARE * 100}%`);
    }
  }
  await c.send('Browser.close').catch(() => {});
  c.close();
} finally {
  const exited = chrome.exitCode === null ? new Promise((r) => chrome.once('exit', r)) : null;
  chrome.kill();
  server.kill();
  await exited;
  // Chrome helpers can still be flushing the temporary profile; leaving a stray file in tmp is harmless.
  try { rmSync(profile, { recursive: true, force: true, maxRetries: 3 }); } catch {}
}

if (failures.length) { failures.forEach((f) => console.error('FAIL ' + f)); process.exit(1); }
console.log(`OK ${list.length} pages fit ${WIDTH}px without sideways scroll; every control reads at ${MIN_CONTRAST}:1 in both themes; the cookie banner covers no button in the first view of a desktop or phone screen`);
