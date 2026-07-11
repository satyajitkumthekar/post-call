import { trackPixel, trackPixelCustom } from './pixel';

let calendlyScriptLoaded = false;
let calendlyPixelListenerAttached = false;
let currentEventPrefix = '';

function attachCalendlyPixelListener() {
  if (calendlyPixelListenerAttached) return;
  calendlyPixelListenerAttached = true;
  window.addEventListener('message', (e) => {
    if (!e.data?.event) return;
    if (e.data.event === 'calendly.date_and_time_selected') {
      trackPixelCustom(`${currentEventPrefix}CalendlyDateSelected`);
    }
    if (e.data.event === 'calendly.event_scheduled') {
      trackPixel(`${currentEventPrefix}Schedule`);
    }
  });
}

export function ensureCalendlyScript(): Promise<void> {
  if ((window as any).Calendly) {
    calendlyScriptLoaded = true;
    return Promise.resolve();
  }
  if (calendlyScriptLoaded) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if ((window as any).Calendly) { clearInterval(check); resolve(); }
      }, 50);
    });
  }
  calendlyScriptLoaded = true;
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export interface CalendlyUtm {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export function getUtmFromUrl(): CalendlyUtm {
  const params = new URLSearchParams(window.location.search);
  const utm: CalendlyUtm = {};
  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');
  const content = params.get('utm_content');
  const term = params.get('utm_term');
  if (source) utm.utmSource = source;
  if (medium) utm.utmMedium = medium;
  if (campaign) utm.utmCampaign = campaign;
  if (content) utm.utmContent = content;
  if (term) utm.utmTerm = term;
  return utm;
}

export function openCalendlyPopup(url: string, utm?: CalendlyUtm, eventPrefix = '') {
  currentEventPrefix = eventPrefix;
  attachCalendlyPixelListener();
  trackPixelCustom(`${eventPrefix}CalendlyOpened`);
  ensureCalendlyScript().then(() => {
    const opts: Record<string, unknown> = { url };
    if (utm && Object.keys(utm).length > 0) {
      opts.utm = utm;
    }
    (window as any).Calendly.initPopupWidget(opts);
  });
}

export function buildCalendlyUrl(leadData?: { firstName: string; whatsappNumber: string } | null): string {
  const base = 'https://calendly.com/satyajit-kumthekar/discovery-call-clone';
  const params = new URLSearchParams({
    hide_gdpr_banner: '1',
    primary_color: 'c9a14a',
  });
  if (leadData) {
    params.set('name', leadData.firstName);
    params.set('a1', leadData.whatsappNumber);
  }
  return `${base}?${params.toString()}`;
}
