// Captures the selected conversation with headless Chrome over the DevTools protocol (no extra packages).
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME_BIN || 'google-chrome';
const VIEWPORT = { width: 1440, height: 900 };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function launch() {
  const profile = mkdtempSync(join(tmpdir(), 'colliedesk-shot-chrome-'));
  const chrome = spawn(CHROME, [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', '--force-color-profile=srgb', '--lang=en-US', '--disable-extensions',
    // Headless Chrome reports no pointer, so the app would show touch layouts (full times in the list).
    '--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4',
    `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
  ], { stdio: 'ignore', detached: true });
  const exited = new Promise((resolve) => chrome.once('exit', resolve));
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const [port, path] = readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n');
      const close = async () => {
        // Chrome runs in its own process group: stop its helpers too, or they keep writing the profile.
        try { process.kill(-chrome.pid, 'SIGTERM'); } catch { chrome.kill(); }
        await exited;
        try {
          rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
        } catch (error) {
          // The pictures are written by now; a temporary profile left behind is not worth failing the run.
          console.warn(`Could not remove ${profile}: ${error.message}`);
        }
      };
      return { endpoint: `ws://127.0.0.1:${port}${path}`, close };
    } catch {
      await sleep(100);
    }
  }
  try { process.kill(-chrome.pid, 'SIGTERM'); } catch { chrome.kill(); }
  throw new Error(`${CHROME} did not start; set CHROME_BIN to a Chrome or Chromium binary`);
}

async function connect(endpoint) {
  const socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = () => reject(new Error('DevTools connection failed')); });
  let next = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(`${waiter.method}: ${message.error.message}`));
    else waiter.resolve(message.result);
  };
  socket.onclose = () => {
    for (const waiter of pending.values()) waiter.reject(new Error(`${waiter.method}: DevTools connection closed`));
    pending.clear();
  };
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    next += 1;
    pending.set(next, { resolve, reject, method });
    socket.send(JSON.stringify({ id: next, method, params, sessionId }));
  });
  return { send, close: () => socket.close() };
}

// waitFor polls an expression in the page until it is true.
async function waitFor(page, expression, what) {
  for (let attempt = 0; attempt < 150; attempt += 1) {
    // A navigation in progress destroys the context being evaluated; that is a retry, not a failure.
    const answer = await page('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }).catch(() => null);
    if (answer?.result.value === true) return;
    await sleep(200);
  }
  throw new Error(`timed out waiting for ${what}`);
}

// capture signs the browser in with `cookie`, opens `path` and writes one JPEG per scale.
export async function capture({ origin, path, cookie, ready, shots }) {
  const chrome = await launch();
  const cdp = await connect(chrome.endpoint);
  try {
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    const page = (method, params) => cdp.send(method, params, sessionId);
    await page('Page.enable');
    await page('Network.enable');
    await page('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }, { name: 'prefers-reduced-motion', value: 'reduce' }] });
    await page('Network.setCookie', { ...cookie, url: origin, path: '/', httpOnly: true, secure: true, sameSite: 'Lax' });
    for (const { scale, file } of shots) {
      await page('Emulation.setDeviceMetricsOverride', { ...VIEWPORT, deviceScaleFactor: scale, mobile: false });
      await page('Page.navigate', { url: origin + path });
      await waitFor(page, `document.readyState === 'complete' && document.fonts.status === 'loaded' && (${ready})`, 'the conversation to render');
      await sleep(800); // let images decode and transitions settle
      const { data } = await page('Page.captureScreenshot', { format: 'jpeg', quality: 80, captureBeyondViewport: false });
      writeFileSync(file, Buffer.from(data, 'base64'));
    }
  } finally {
    await cdp.send('Browser.close').catch(() => {});
    cdp.close();
    await chrome.close();
  }
}
