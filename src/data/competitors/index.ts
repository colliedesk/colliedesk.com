// Every competitor file, one per /vs page. scripts/vs-facts-gate.mjs checks each one and fails a
// /vs page whose competitor is missing here.
import type { Competitor } from '../../lib/competitor.ts';
import { chatwoot } from './chatwoot.ts';
import { freescout } from './freescout.ts';
import { freshdesk } from './freshdesk.ts';
import { front } from './front.ts';
import { gorgias } from './gorgias.ts';
import { groove } from './groove.ts';
import { happyfox } from './happyfox.ts';
import { helpScout } from './help-scout.ts';
import { hubspotServiceHub } from './hubspot-service-hub.ts';
import { zammad } from './zammad.ts';
import { zendesk } from './zendesk.ts';
import { zohoDesk } from './zoho-desk.ts';

export const COMPETITORS: readonly Competitor[] = [
  freshdesk, zendesk, helpScout, zohoDesk, front, gorgias, happyfox, hubspotServiceHub, groove, zammad, chatwoot, freescout,
];
