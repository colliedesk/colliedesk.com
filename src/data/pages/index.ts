// Every page of the site, in llms.txt and sitemap order.
import type { Page } from '../../lib/page';
import changelog from './changelog';
import compare from './compare';
import freshdeskAlternative from './freshdesk-alternative';
import freshdeskPricingHistory from './freshdesk-pricing-history';
import helpdeskForSmallTeams from './helpdesk-for-small-teams';
import home from './home';
import migrateFreshdesk from './migrate-freshdesk';
import migrateFreshdeskDoneForYou from './migrate-freshdesk-done-for-you';
import migrateFreshdeskExport from './migrate-freshdesk-export';
import migrateZendeskExport from './migrate-zendesk-export';
import openSource from './open-source';
import priceCheck from './price-check';
import pricing from './pricing';
import privacy from './privacy';
import { docsPages, roadmapPage } from './repo-docs';
import selfHostedHelpdesk from './self-hosted-helpdesk';
import terms from './terms';
import vsChatwoot from './vs-chatwoot';
import vsFreescout from './vs-freescout';
import vsFreshdesk from './vs-freshdesk';
import vsGorgias from './vs-gorgias';
import vsGroove from './vs-groove';
import vsHappyfox from './vs-happyfox';
import vsFront from './vs-front';
import vsHelpScout from './vs-help-scout';
import vsHubspotServiceHub from './vs-hubspot-service-hub';
import vsZammad from './vs-zammad';
import vsZendesk from './vs-zendesk';
import vsZohoDesk from './vs-zoho-desk';

let cache: readonly Page[] | undefined;

// Built on first use, because the docs pages read the product checkout (PRODUCT_DIR), which
// only a build needs; astro check and the config load must work without it.
export function allPages(): readonly Page[] {
  cache ??= [
    home, pricing, priceCheck, migrateFreshdesk, migrateFreshdeskDoneForYou, migrateFreshdeskExport, migrateZendeskExport,
    compare, vsFreshdesk, vsZendesk, vsHelpScout, vsFront, vsZammad, vsChatwoot, vsFreescout,
    vsZohoDesk, vsHappyfox, vsGorgias, vsHubspotServiceHub, vsGroove, freshdeskAlternative, freshdeskPricingHistory, selfHostedHelpdesk, helpdeskForSmallTeams, openSource, roadmapPage(), changelog,
    privacy, terms, ...docsPages(),
  ];
  return cache;
}
