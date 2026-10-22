// The demo data behind public/product-inbox.jpg and the clock it runs on. Pure: no I/O.

export const SCENE = {
  workspace: 'Northwind Help',
  admin: { email: 'tom.okoye@northwind.support', name: 'Tom Okoye' },
  supportAddress: 'help@northwind.support',
  tokenLabel: 'Claude Code',
  tags: ['billing', 'booking', 'export', 'sso', 'timezone'],
  // Newest first, as the inbox lists them. `at` is the wall-clock time of each step, today, in the
  // workspace timezone: the customer's email, then the agent's private note and drafted reply.
  conversations: [
    {
      subject: 'Booking widget shows Lisbon times one hour early', priority: 'urgent', tags: ['booking', 'timezone'], assignee: 'me',
      from: { name: 'Ana Ribeiro', address: 'ana.ribeiro@clinicaestrela.pt' },
      body: 'Since this morning the booking widget shows every slot at our Lisbon clinic one hour early. A patient picked 10:00 and the confirmation says 9:00. Screenshot attached.\nAna',
      attachment: 'booking-widget.png',
      note: 'Same cause as the Porto clinic last month: a new location keeps the workspace timezone. Check the Valencia location too.',
      reply: 'Hi Ana, thanks for the screenshot. The Lisbon location still uses the Madrid timezone, which is one hour ahead. I have set Lisbon to Europe/Lisbon, so new bookings land at the right time.',
      at: { incoming: '08:47', note: '08:58', reply: '09:12' },
    },
    {
      subject: 'Screenshots missing on imported tickets', priority: 'high', tags: [],
      from: { name: 'Jonas Weber', address: 'jonas.weber@kleinfeld-logistik.de' },
      body: 'We imported our old tickets yesterday. The text is all there, but the screenshots customers attached are missing on most of them. Can you check?\nJonas',
      at: { incoming: '08:40' },
    },
    {
      subject: 'Invoice #2291 charged twice', priority: 'high', tags: ['billing'],
      from: { name: 'Priya Nair', address: 'priya@brightleafstudio.co' },
      body: 'Hello, our card was charged twice for invoice #2291 this month. Could you refund the second charge?\nThanks, Priya',
      at: { incoming: '08:05' },
    },
    {
      subject: 'Full export with notes before renewal', priority: 'normal', tags: ['export'],
      from: { name: 'Marcus Hale', address: 'marcus.hale@halewoodsupply.com' },
      body: 'Before we renew, our auditor wants a full export of last year, including internal notes. Is that possible?\nMarcus',
      at: { incoming: '07:31' },
    },
    {
      subject: 'Can we add a second inbox for billing?', priority: 'normal', tags: [],
      from: { name: 'Sofia Lindqvist', address: 'sofia@nordvik.se' },
      body: 'Hi, we would like billing questions to arrive at billing@ and not mix with support. Can we add a second inbox?\nSofia',
      at: { incoming: '07:02' },
    },
  ],
};

// One zone per whole-hour UTC offset from -11 to +14, so some zone is always just past the scene morning.
export const ZONES = [
  'Pacific/Pago_Pago', 'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles', 'America/Denver', 'America/Chicago',
  'America/New_York', 'America/Halifax', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Europe/Lisbon',
  'Europe/Madrid', 'Europe/Athens', 'Africa/Nairobi', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Dhaka', 'Asia/Bangkok',
  'Asia/Singapore', 'Asia/Tokyo', 'Australia/Brisbane', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Tongatapu', 'Pacific/Kiritimati',
];

// The earliest local clock at which the scene may be shown: the last step (09:12) plus a margin for seeding.
const NOT_BEFORE = '09:45';

function parts(instant, timeZone) {
  const values = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(instant).map(({ type, value }) => [type, value]));
  return { date: `${values.year}-${values.month}-${values.day}`, clock: `${values.hour}:${values.minute}`, second: Number(values.second) };
}

// zonedInstant is the UTC instant at which the clock in timeZone reads `clock` on `date` (YYYY-MM-DD).
export function zonedInstant(date, clock, timeZone) {
  const wanted = Date.parse(`${date}T${clock}:00Z`);
  let guess = wanted;
  // Two corrections settle any offset, including a day on which the offset changes.
  for (let round = 0; round < 2; round += 1) {
    const seen = parts(new Date(guess), timeZone);
    guess += wanted - Date.parse(`${seen.date}T${seen.clock}:${String(seen.second).padStart(2, '0')}Z`);
  }
  return new Date(guess);
}

// pickTimeZone returns the zone whose clock is the earliest at or after NOT_BEFORE, so every scene time
// is today and in the past, and "Today" lasts as long as possible for whoever keeps the session.
export function pickTimeZone(now, zones = ZONES) {
  let best = null;
  for (const zone of zones) {
    const { clock } = parts(now, zone);
    if (clock >= NOT_BEFORE && (best === null || clock < best.clock)) best = { zone, clock };
  }
  return best?.zone ?? null;
}

// sceneTimes gives each conversation's steps as instants, today in the picked workspace timezone.
export function sceneTimes(now, scene = SCENE) {
  const timeZone = pickTimeZone(now);
  const { date } = parts(now, timeZone);
  const conversations = scene.conversations.map((conversation) => ({
    subject: conversation.subject,
    times: Object.fromEntries(Object.entries(conversation.at).map(([step, clock]) => [step, zonedInstant(date, clock, timeZone)])),
  }));
  return { timeZone, date, conversations };
}
