// Raw customer email for Colliedesk's inbound endpoint, and a small PNG to attach. Pure: no I/O.
import { createHash } from 'node:crypto';
import { crc32, deflateSync } from 'node:zlib';

const CRLF = '\r\n';

// RFC 5322 date in UTC, e.g. "Thu, 22 Oct 2026 06:47:00 +0000".
function rfcDate(date) {
  return date.toUTCString().replace('GMT', '+0000');
}

function base64Lines(data) {
  return data.toString('base64').match(/.{1,76}/g).join(CRLF);
}

// inboundEmail writes the message a receiving mail server would hand over: its Authentication-Results
// (authserv-id `authservId`, which the stack trusts) reports SPF and DKIM pass for the sender's domain.
export function inboundEmail({ from, to, subject, body, date, authservId, attachment }) {
  const domain = from.address.split('@')[1];
  const id = createHash('sha256').update(`${from.address}\n${subject}\n${date.toISOString()}`).digest('hex').slice(0, 24);
  const headers = [
    `Authentication-Results: ${authservId}; spf=pass smtp.mailfrom=${domain}; dkim=pass header.d=${domain}`,
    `From: ${from.name} <${from.address}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Date: ${rfcDate(date)}`,
    `Message-ID: <${id}@${domain}>`,
    'MIME-Version: 1.0',
  ];
  const text = body.replace(/\r?\n/g, CRLF);
  if (!attachment) {
    return [...headers, 'Content-Type: text/plain; charset=utf-8', '', text, ''].join(CRLF);
  }
  const boundary = `shot-${id}`;
  return [
    ...headers,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    text,
    `--${boundary}`,
    `Content-Type: ${attachment.contentType}; name="${attachment.filename}"`,
    `Content-Disposition: attachment; filename="${attachment.filename}"`,
    'Content-Transfer-Encoding: base64',
    '',
    base64Lines(attachment.data),
    `--${boundary}--`,
    '',
  ].join(CRLF);
}

function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, 'latin1');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])) >>> 0, 0);
  return Buffer.concat([head, data, crc]);
}

// demoPng draws a plain calendar-like grid (light rows, one ink header band), enough to be a real image.
export function demoPng(width, height) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header.set([8, 2, 0, 0, 0], 8); // 8-bit RGB, no interlace
  const rows = [];
  for (let y = 0; y < height; y += 1) {
    const row = Buffer.alloc(1 + width * 3);
    for (let x = 0; x < width; x += 1) {
      const band = y < height / 8;
      const line = !band && (y % Math.max(4, Math.floor(height / 10)) === 0 || x % Math.max(4, Math.floor(width / 7)) === 0);
      const value = band ? 23 : line ? 212 : 250;
      row.fill(value, 1 + x * 3, 4 + x * 3);
    }
    rows.push(row);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
