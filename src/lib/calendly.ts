let calendlyScriptLoaded = false;
let calendlyPixelListenerAttached = false;

function attachCalendlyPixelListener() {
  if (calendlyPixelListenerAttached) return;
  calendlyPixelListenerAttached = true;
  window.addEventListener('message', (e) => {
    if (e.data?.event === 'calendly.event_scheduled') {
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Schedule');
      }
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
  ensureCalendlyScript().then(() => {
    (window as any).Calendly.initPopupWidget({ url });
  });
}

export function buildCalendlyUrl(leadData?: { firstName: string; whatsappNumber: string } | null): string {
  const base = 'https://calendly.com/satyajit-kumthekar/diagnostic-call';
  const params = new URLSearchParams({
    hide_gdpr_banner: '1',
    background_color: '0a0a0a',
    text_color: 'f5f5f5',
    primary_color: 'c9a14a',
  });
  if (leadData) {
    params.set('name', leadData.firstName);
    params.set('a1', leadData.whatsappNumber);
  }
  return `${base}?${params.toString()}`;
}
