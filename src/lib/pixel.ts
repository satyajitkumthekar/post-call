function isPixelAllowed(): boolean {
  const h = window.location.hostname;
  if (h !== 'superhumanlab.fit' && h !== 'www.superhumanlab.fit') return false;
  try {
    if (localStorage.getItem('internal_visitor') === '1') return false;
  } catch {
    // localStorage unavailable
  }
  return true;
}

export function trackPixel(event: string, params?: Record<string, string>) {
  if (!isPixelAllowed()) return;
  if (typeof (window as any).fbq === 'function') {
    if (params) {
      (window as any).fbq('track', event, params);
    } else {
      (window as any).fbq('track', event);
    }
  }
}

export function trackPixelCustom(event: string, params?: Record<string, string>) {
  if (!isPixelAllowed()) return;
  if (typeof (window as any).fbq === 'function') {
    if (params) {
      (window as any).fbq('trackCustom', event, params);
    } else {
      (window as any).fbq('trackCustom', event);
    }
  }
}
