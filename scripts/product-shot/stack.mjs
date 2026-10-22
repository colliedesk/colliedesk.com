// The docker compose stack (project colliedesk-shot) and the commands run inside it.
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const COMPOSE_FILE = join(dirname(fileURLToPath(import.meta.url)), 'compose.yaml');

export const IMAGE = process.env.COLLIEDESK_IMAGE || 'ghcr.io/colliedesk/colliedesk:edge';
export const PORT = Number(process.env.SHOT_PORT || 55480);
export const ORIGIN = `http://localhost:${PORT}`;

// The database password is generated for each fresh stack and only needed when containers are
// created; commands on running containers get a placeholder.
function compose(args, { password = 'unused', input } = {}) {
  const result = spawnSync('docker', ['compose', '-f', COMPOSE_FILE, ...args], {
    env: { ...process.env, COLLIEDESK_IMAGE: IMAGE, SHOT_PORT: String(PORT), SHOT_DB_PASSWORD: password },
    input,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`docker compose ${args[0]} failed (exit ${result.status}): ${result.stderr.trim()}`);
  }
  return result.stdout;
}

// up replaces any previous stack and its volumes, so every run starts from an empty database.
export function up() {
  down();
  compose(['pull', '--quiet', 'server']);
  compose(['up', '--detach', '--wait', '--quiet-pull'], { password: randomBytes(24).toString('hex') });
}

export function down() {
  compose(['down', '--volumes', '--remove-orphans']);
}

export function isRunning() {
  return compose(['ps', '--status', 'running', '--services']).split('\n').includes('server');
}

// collie runs the product CLI inside the server container and returns its stdout (secrets stay out of argv).
export function collie(...args) {
  return compose(['exec', '-T', 'server', '/app/collie', ...args]).trim();
}

// sql runs statements in one transaction as the database owner.
export function sql(statements) {
  compose(['exec', '-T', 'postgres', 'psql', '-q', '-v', 'ON_ERROR_STOP=1', '--single-transaction', '-U', 'colliedesk', '-d', 'colliedesk'],
    { input: statements });
}
