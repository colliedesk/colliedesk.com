import svg from '../../public/logo-wordmark.svg?raw';
import { NAME } from '../lib/site';

// Brand wordmark (mascot + outlined text, no font needed), inlined so it costs no request. The mascot is a
// white collie head on its orange tile (--logo-tile); the letters take the theme's text colours.
const WORDMARK = svg
  .replace('<svg xmlns="http://www.w3.org/2000/svg"', '<svg class="wordmark" height="30"')
  .replace(/<!--[\s\S]*?-->\s*/g, '')
  .replace('<rect width="32" height="32" rx="7" fill="#c2410c"/>', '<rect class="wm-tile" width="32" height="32" rx="7"/>')
  .replace('fill="#e8edf4"', 'class="wm-collie"')
  .replace('fill="#b4bfcf"', 'class="wm-desk"')
  .replace(/\s*\n\s*/g, '');

export function BrandLink() {
  return <a className="brand" href="/" aria-label={`${NAME} home`} dangerouslySetInnerHTML={{ __html: WORDMARK }} />;
}
