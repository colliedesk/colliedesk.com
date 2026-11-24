import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = join(dirname(fileURLToPath(import.meta.url)), 'find-node.sh');

// A stand-in node binary: it answers the version probe the way a real build would.
function stubNode(binDir, version, typescript) {
  mkdirSync(binDir, { recursive: true });
  const path = join(binDir, 'node');
  writeFileSync(path, `#!/bin/sh\necho "${version} ${typescript}"\n`);
  chmodSync(path, 0o755);
  return binDir;
}

// A throwaway repo root holding .nvmrc and the script, plus empty fnm and nvm homes.
function sandbox(nvmrc = '22\n') {
  const root = mkdtempSync(join(tmpdir(), 'find-node-'));
  mkdirSync(join(root, 'scripts'));
  copyFileSync(script, join(root, 'scripts', 'find-node.sh'));
  writeFileSync(join(root, '.nvmrc'), nvmrc);
  const fnm = (v, ts) => stubNode(join(root, 'fnm', 'node-versions', `v${v}`, 'installation', 'bin'), v, ts);
  const nvm = (v, ts) => stubNode(join(root, 'nvm', 'versions', 'node', `v${v}`, 'bin'), v, ts);
  const mise = (v, ts) => stubNode(join(root, 'mise', 'installs', 'node', v, 'bin'), v, ts);
  const active = (v, ts) => stubNode(join(root, 'active'), v, ts);
  const run = () =>
    spawnSync('bash', [join(root, 'scripts', 'find-node.sh')], {
      encoding: 'utf8',
      env: {
        HOME: join(root, 'home'),
        FNM_DIR: join(root, 'fnm'),
        NVM_DIR: join(root, 'nvm'),
        MISE_DATA_DIR: join(root, 'mise'),
        PATH: `${join(root, 'active')}:/usr/bin:/bin`,
      },
    });
  return { root, fnm, nvm, mise, active, run };
}

test('keeps the active node when it is new enough and strips TypeScript', () => {
  const s = sandbox();
  const bin = s.active('24.1.0', 'strip');
  s.fnm('22.20.0', 'strip');
  const r = s.run();
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), bin);
});

test('skips a distro node of the right major that lacks TypeScript stripping', () => {
  const s = sandbox();
  s.active('22.22.1', 'false');
  const bin = s.fnm('24.21.0', 'strip');
  const r = s.run();
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), bin);
});

test('prefers an installed node of the CI major over a newer one', () => {
  const s = sandbox();
  s.active('22.22.1', 'false');
  s.fnm('24.21.0', 'strip');
  const bin = s.fnm('22.20.0', 'strip');
  const r = s.run();
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), bin);
});

test('finds a node installed by nvm', () => {
  const s = sandbox();
  s.active('22.22.1', 'false');
  const bin = s.nvm('22.21.0', 'strip');
  const r = s.run();
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), bin);
});

test('finds a node installed by mise', () => {
  const s = sandbox();
  s.active('22.22.1', 'false');
  const bin = s.mise('22.23.5', 'strip');
  const r = s.run();
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), bin);
});

test('fails fast and names the needed version when no node fits', () => {
  const s = sandbox();
  s.active('22.22.1', 'false');
  s.fnm('20.19.0', 'false');
  const r = s.run();
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /Node 22 or newer/);
  assert.match(r.stderr, /22\.22\.1/);
  assert.match(r.stderr, /mise install node@22/);
});

test('reads a v-prefixed .nvmrc', () => {
  const s = sandbox('v24\n');
  s.active('22.22.1', 'strip');
  const bin = s.fnm('24.21.0', 'strip');
  const r = s.run();
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), bin);
});
