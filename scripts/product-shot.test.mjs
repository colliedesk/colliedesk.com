import assert from 'node:assert/strict';
import { test } from 'node:test';
import { inboundEmail, demoPng } from './product-shot/mail.mjs';
import { SCENE, pickTimeZone, sceneTimes, zonedInstant } from './product-shot/scene.mjs';

// Expected instants are worked out by hand from the zone's UTC offset on that date
// (Lisbon is UTC+1 until 25 October 2026 and UTC+0 after; Madrid UTC+2; Tokyo UTC+9; Brisbane UTC+10).

test('zonedInstant turns a wall-clock time in a timezone into the UTC instant', () => {
  assert.equal(zonedInstant('2026-10-22', '09:12', 'Europe/Lisbon').toISOString(), '2026-10-22T08:12:00.000Z');
  assert.equal(zonedInstant('2026-11-02', '09:12', 'Europe/Lisbon').toISOString(), '2026-11-02T09:12:00.000Z');
  assert.equal(zonedInstant('2026-10-22', '07:02', 'Asia/Tokyo').toISOString(), '2026-10-21T22:02:00.000Z');
});

test('pickTimeZone picks the zone where the scene morning has just passed', () => {
  assert.equal(pickTimeZone(new Date('2026-10-22T08:15:00Z')), 'Europe/Madrid');
  assert.equal(pickTimeZone(new Date('2026-12-01T00:30:00Z')), 'Australia/Brisbane');
});

test('every UTC hour of the day finds a zone', () => {
  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of [0, 59]) {
      const now = new Date(Date.UTC(2026, 9, 22, hour, minute));
      assert.ok(pickTimeZone(now), `no zone for ${now.toISOString()}`);
    }
  }
});

test('sceneTimes puts the morning of today in the chosen zone, all in the past', () => {
  const now = new Date('2026-10-22T08:15:00Z');
  const { timeZone, conversations } = sceneTimes(now);
  assert.equal(timeZone, 'Europe/Madrid');
  const booking = conversations.find((item) => item.subject === 'Booking widget shows Lisbon times one hour early');
  assert.equal(booking.times.incoming.toISOString(), '2026-10-22T06:47:00.000Z');
  assert.equal(booking.times.note.toISOString(), '2026-10-22T06:58:00.000Z');
  assert.equal(booking.times.reply.toISOString(), '2026-10-22T07:12:00.000Z');
  const latest = conversations.map((item) => Math.max(...Object.values(item.times).map(Number)));
  assert.equal(new Set(latest).size, conversations.length, 'list times differ');
  assert.deepEqual([...latest].sort((a, b) => b - a), latest, 'conversations are listed newest first');
  for (const value of latest) assert.ok(value < now.getTime() && value >= Date.parse('2026-10-21T22:00:00Z'));
});

test('the scene has the five open conversations of the hero, booking first', () => {
  assert.deepEqual(SCENE.conversations.map((item) => [item.subject, item.priority]), [
    ['Booking widget shows Lisbon times one hour early', 'urgent'],
    ['Screenshots missing on imported tickets', 'high'],
    ['Invoice #2291 charged twice', 'high'],
    ['Full export with notes before renewal', 'normal'],
    ['Can we add a second inbox for billing?', 'normal'],
  ]);
  assert.deepEqual(SCENE.tags, ['billing', 'booking', 'export', 'sso', 'timezone']);
});

test('inboundEmail writes a trusted, authenticated message with its attachment', () => {
  const png = demoPng(64, 40);
  const raw = inboundEmail({
    from: { name: 'Ana Ribeiro', address: 'ana.ribeiro@clinicaestrela.pt' }, to: 'help@northwind.support',
    subject: 'Booking widget shows Lisbon times one hour early', body: 'Screenshot attached.\nAna',
    date: new Date('2026-10-22T06:47:00Z'), authservId: 'mx.shot.invalid',
    attachment: { filename: 'booking-widget.png', contentType: 'image/png', data: png },
  });
  assert.ok(raw.startsWith('Authentication-Results: mx.shot.invalid; spf=pass smtp.mailfrom=clinicaestrela.pt; dkim=pass header.d=clinicaestrela.pt\r\n'));
  assert.match(raw, /\r\nFrom: Ana Ribeiro <ana\.ribeiro@clinicaestrela\.pt>\r\n/);
  assert.match(raw, /\r\nDate: Thu, 22 Oct 2026 06:47:00 \+0000\r\n/);
  assert.match(raw, /\r\nMessage-ID: <[0-9a-f]+@clinicaestrela\.pt>\r\n/);
  assert.match(raw, /Content-Disposition: attachment; filename="booking-widget\.png"/);
  assert.ok(!/[^\r]\n/.test(raw), 'every line ends with CRLF');
  const encoded = raw.split('Content-Transfer-Encoding: base64\r\n\r\n')[1].split('\r\n--')[0].replace(/\r\n/g, '');
  assert.deepEqual(Buffer.from(encoded, 'base64'), png);
});

test('demoPng is a PNG of the requested size', () => {
  const png = demoPng(640, 400);
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.toString('latin1', 12, 16), 'IHDR');
  assert.equal(png.readUInt32BE(16), 640);
  assert.equal(png.readUInt32BE(20), 400);
});
