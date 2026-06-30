import { trackPixel, trackPixelCustom } from './pixel';

let calendlyScriptLoaded = false;
let calendlyPixelListenerAttached = false;

function attachCalendlyPixelListener() {
  if (calendlyPixelListenerAttached) return;
  calendlyPixelListenerAttached = true;
  window.addEventListener('message', (e) => {
    if (!e.data?.event) return;
    if (e.data.event === 'calendly.date_and_time_selected') {
      trackPixelCustom('CalendlyDateSelected');
    }
    if (e.data.event === 'calendly.event_scheduled') {
      trackPixel('Schedule');
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

export function openCalendlyPopup(url: string) {
  attachCalendlyPixelListener();
  trackPixelCustom('CalendlyOpened');
  ensureCalendlyScript().then(() => {
    (window as any).Calendly.initPopupWidget({ url });
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
