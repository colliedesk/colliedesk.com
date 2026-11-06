import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  businessCardFindings, doneForYouFindings, offerFindings, retiredClaimFindings, switchPageFindings, SWITCH_CALL, SWITCH_PATH,
} from './switch-offer-gate.mjs';

// Fixtures written by hand from the owner's decision of 03/11/2026 and colliedesk.com#134: Business is
// $499 a month or $4,990 a year for 26 to 100 agents with 1 TB, sold through a call; the switch and
// invoice offers apply to Team 25 and Business; the 14-day trial is unchanged.
const BUSINESS = `<article class="plan"><h2 class="plan-name">Business</h2><p class="plan-price"><strong>$499</strong> <span>a month</span></p>
<p class="plan-alt">or $4,990 a year</p><p class="plan-size"><strong>26 to 100 agents</strong> <span>1 TB of attachments</span></p>
<a class="btn btn-primary" href="${SWITCH_CALL}">Talk to us</a></article>`;
const TEAM_25 = '<article class="plan"><h2 class="plan-name">Team 25</h2><p>$149</p><a class="btn" href="https://app.colliedesk.com/sign-in?intent=trial&amp;plan=team25">Start free trial</a></article>';
const OFFER = `We move your team from Freshdesk, and you pay when your team answers its first real ticket in Colliedesk.
Don&#x27;t pay twice while you switch. Your first paid month is on us, up to the amount on that invoice.
Team 25 and Business only. The 14-day free trial is unchanged and comes first. <a href="${SWITCH_CALL}">Talk to us</a>`;
const MOVES = 'Tickets (archived ones included), replies, private notes, attachments, tags, contacts, companies and time entries. A reconcile report with counts and a SHA-256 checksum for every attachment.';
const TRUST = 'Colliedesk is generally available. Run one queue next to Freshdesk. We run the import. Nightly encrypted backups, and we test a restore every week. It is open source.';
const CTAS = `<a class="btn btn-primary" href="https://app.colliedesk.com/sign-in?intent=trial">Start free trial</a> <a class="btn" href="${SWITCH_CALL}">Book a 30-min switch call</a>`;
const SWITCH_PAGE = `<link rel="canonical" href="https://colliedesk.com${SWITCH_PATH}"><script src="/attribution.js" defer></script>${CTAS}${TEAM_25}${BUSINESS}${OFFER}${MOVES}${TRUST}`;

test('business card: price, size, storage and a "Talk to us" call link pass', () => {
  assert.deepEqual(businessCardFindings({ path: '/pricing', html: BUSINESS }), []);
});

test('business card: missing card fails', () => {
  assert.deepEqual(businessCardFindings({ path: '/pricing', html: TEAM_25 }), ['/pricing: no Business card']);
});

test('business card: a checkout or trial link fails, even beside the call link', () => {
  for (const href of ['https://app.colliedesk.com/sign-in?intent=trial', 'https://app.colliedesk.com/settings/billing?buy=business', 'https://buy.polar.sh/x']) {
    const findings = businessCardFindings({ path: '/pricing', html: BUSINESS.replace('</article>', `<a href="${href}">Buy</a></article>`) });
    assert.equal(findings.length, 1, href);
    assert.match(findings[0], /sold through a call/);
  }
});

test('business card: "Talk to us" pointing elsewhere fails', () => {
  const findings = businessCardFindings({ path: '/pricing', html: BUSINESS.replace(SWITCH_CALL, 'mailto:support@colliedesk.com') });
  assert.deepEqual(findings, [`/pricing: Business card has no "Talk to us" link to ${SWITCH_CALL}`]);
});

test('business card: the Unlimited price or size fails', () => {
  const findings = businessCardFindings({ path: '/pricing', html: BUSINESS.replace('$499', '$349').replace('26 to 100 agents', 'Unlimited agents') });
  assert.deepEqual(findings, ['/pricing: Business card lacks "$499"', '/pricing: Business card lacks "26 to 100 agents"']);
});

test('offers: both offers with their limits and the call link pass, HTML entities decoded', () => {
  assert.deepEqual(offerFindings({ path: '/pricing', text: OFFER }), []);
});

test('offers: an invoice offer with no cap fails', () => {
  const findings = offerFindings({ path: '/pricing.md', text: OFFER.replace('up to the amount on that invoice', 'free') });
  assert.deepEqual(findings, ['/pricing.md: switch offer lacks "up to the amount on that invoice"']);
});

test('offers: a page without the offer fails on every term and the call link', () => {
  assert.equal(offerFindings({ path: '/vs/freshdesk', text: 'Start free trial' }).length, 6);
});

test('switch page: two CTAs, both plans, what moves and the trust paragraph pass', () => {
  assert.deepEqual(switchPageFindings({ path: SWITCH_PATH, html: SWITCH_PAGE }), []);
});

test('switch page: a third-party script, stylesheet, image or frame fails', () => {
  for (const tag of ['<script src="https://cal.com/embed.js"></script>', '<link rel="stylesheet" href="https://fonts.googleapis.com/css">', '<img src="//cdn.example.com/a.png">', '<iframe src="https://cal.com/chinh/colliedesk-switch"></iframe>']) {
    const findings = switchPageFindings({ path: SWITCH_PATH, html: SWITCH_PAGE + tag });
    assert.equal(findings.length, 1, tag);
    assert.match(findings[0], /another origin/);
  }
});

test('switch page: no call CTA, no Business card and no backup line fail', () => {
  const html = SWITCH_PAGE.replace('Book a 30-min switch call', 'Book').replace('plan-name">Business', 'plan-name">Other').replace('test a restore', 'test a backup');
  assert.deepEqual(switchPageFindings({ path: SWITCH_PATH, html }), [
    `${SWITCH_PATH}: no "Book a 30-min switch call" link to ${SWITCH_CALL}`,
    `${SWITCH_PATH}: no Business card`,
    `${SWITCH_PATH}: trust paragraph lacks "restore"`,
  ]);
});

test('switch page: a trial link that is not the sign-up entry fails', () => {
  const html = SWITCH_PAGE.replace('href="https://app.colliedesk.com/sign-in?intent=trial">Start', 'href="https://app.colliedesk.com/sign-in">Start');
  assert.deepEqual(switchPageFindings({ path: SWITCH_PATH, html }), [`${SWITCH_PATH}: no "Start free trial" link to https://app.colliedesk.com/sign-in?intent=trial`]);
});

test('done-for-you: links the switch page and names Business', () => {
  assert.deepEqual(doneForYouFindings({ path: '/x', text: `Team 25 and Business: [switch offer](${SWITCH_PATH})` }), []);
  assert.equal(doneForYouFindings({ path: '/x', text: 'Included with Founding only.' }).length, 2);
});

test('retired claims: the Unlimited plan and the "uptime commitment is coming" line fail; the published 99.9% and "Unlimited conversations" pass', () => {
  assert.deepEqual(retiredClaimFindings({ path: '/x', text: 'Unlimited conversations, no per-agent fees.' }), []);
  assert.equal(retiredClaimFindings({ path: '/x', text: 'Above 25, Unlimited is coming soon.' }).length, 1);
  assert.deepEqual(retiredClaimFindings({ path: '/x', text: '99.9% uptime a month on every paid plan.' }), []);
  assert.match(retiredClaimFindings({ path: '/x', text: 'A written uptime commitment is coming.' })[0], /published/);
  assert.match(retiredClaimFindings({ path: '/x', text: 'Written uptime commitment coming' })[0], /published/);
  assert.match(retiredClaimFindings({ path: '/x', text: 'no uptime number is stated until the written commitment is published.' })[0], /published/);
});
