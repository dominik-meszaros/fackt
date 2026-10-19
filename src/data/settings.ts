// Single-file content edited in the CMS (Settings in /admin).
import home from '../content/settings/home.json';
import pricing from '../content/settings/pricing.json';

export type AskItem = { question: string; type: 'work' | 'answer'; project?: string; answer?: string; linkLabel?: string; linkHref?: string };
export const homeSettings = home as typeof home & { ask: AskItem[] };
export const pricingSettings = pricing;
