// Cache-busting URL for a file in public/: ?v= is a hash of the file, so a changed icon gets a new
// URL. Browsers keep favicons per URL and ignore Cache-Control, so a hand-bumped ?v= goes stale.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function versionedAsset(path: string): string {
  const bytes = readFileSync(join(process.cwd(), 'public', path));
  return `${path}?v=${createHash('sha256').update(bytes).digest('hex').slice(0, 10)}`;
}
