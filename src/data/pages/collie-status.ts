// Colliedesk's own capability status and facts, rendered from src/data/competitors/colliedesk.ts.
// Shared by comparison pages.
import { GA_DOC } from '../../lib/site';
import { colliedesk, STATUS } from '../competitors/colliedesk';
import { factText } from '../../lib/competitor';

export const statusTable = `Colliedesk is generally available. Everything marked shipped runs on Colliedesk Cloud today; everything marked not built yet is not in the product. [What general availability means](${GA_DOC}).

| Capability | Status |
|---|---|
${STATUS.map(([capability, status]) => `| ${capability} | ${status} |`).join('\n')}`;

const fact = (key: string): string => factText(colliedesk, key);
export const collieFacts: Readonly<Record<'price' | 'ai' | 'free' | 'source' | 'export', string>> = {
  price: fact('price'),
  ai: fact('ai'),
  free: fact('free'),
  source: fact('source'),
  export: fact('export'),
};
