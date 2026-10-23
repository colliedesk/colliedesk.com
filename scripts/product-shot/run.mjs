#!/usr/bin/env node
// Retakes public/product-inbox.jpg and public/product-inbox@2x.jpg from a throwaway local Colliedesk.
//
//   pnpm shot:product            fresh stack, seed the scene, capture, leave the stack running
//   pnpm shot:product --link     print a new sign-in link for the running stack
//   pnpm shot:product --down     remove the stack and its volumes
//
// COLLIEDESK_IMAGE picks the app image (default ghcr.io/colliedesk/colliedesk:edge); SHOT_PORT the local
// port (default 55480); CHROME_BIN the browser (default google-chrome).
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { redeem, tokenFromLink } from './api.mjs';
import { capture } from './capture.mjs';
import { SCENE } from './scene.mjs';
import { seed } from './seed.mjs';
import { IMAGE, ORIGIN, collie, down, isRunning, up } from './stack.mjs';
import { writeVariants } from './variants.mjs';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public');
const SLUG = 'northwind-help';

function signInLink() {
  return collie('pair', '--workspace', SLUG, '--email', SCENE.admin.email);
}

async function main(argument) {
  if (argument === '--down') {
    down();
    console.log('Removed the colliedesk-shot stack and its volumes.');
    return;
  }
  if (argument === '--link') {
    if (!isRunning()) throw new Error('The stack is not running; run pnpm shot:product first.');
    console.log(signInLink());
    return;
  }
  if (argument) throw new Error(`Unknown option ${argument}; use --link or --down.`);

  console.log(`Starting a fresh stack with ${IMAGE} ...`);
  up();
  console.log('Seeding the scene through the inbound endpoint, MCP and the API ...');
  const scene = await seed(ORIGIN);
  if (scene.slug !== SLUG) throw new Error(`expected workspace ${SLUG}, got ${scene.slug}`);

  console.log('Capturing 1440x900 at 1x and 2x ...');
  const booking = SCENE.conversations[0];
  const cookie = await redeem(ORIGIN, tokenFromLink(signInLink()), 'cookie');
  const has = (text) => `document.body.innerText.includes(${JSON.stringify(text)})`;
  await capture({
    origin: ORIGIN,
    path: `/conversations/${scene.selected}`,
    cookie,
    ready: [booking.note, booking.attachment, 'Sent', SCENE.conversations.at(-1).subject].map(has).join(' && '),
    shots: [
      { scale: 1, file: join(PUBLIC, 'product-inbox.jpg') },
      { scale: 2, file: join(PUBLIC, 'product-inbox@2x.jpg') },
    ],
  });
  writeVariants();

  console.log(`
Wrote public/product-inbox.jpg, public/product-inbox@2x.jpg and their AVIF and WebP sizes (workspace timezone ${scene.timeZone}).
The stack keeps running at ${ORIGIN} (docker compose project colliedesk-shot).
Sign in as ${SCENE.admin.name} (one use, 15 minutes):
  ${signInLink()}
New link: pnpm shot:product --link    Tear down: pnpm shot:product --down`);
}

main(process.argv[2]).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
