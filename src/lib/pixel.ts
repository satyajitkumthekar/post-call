export function trackPixel(event: string, params?: Record<string, string>) {
  if (typeof (window as any).fbq === 'function') {
    if (params) {
      (window as any).fbq('track', event, params);
    } else {
      (window as any).fbq('track', event);
    }
  }
}

export function trackPixelCustom(event: string, params?: Record<string, string>) {
  if (typeof (window as any).fbq === 'function') {
    if (params) {
      (window as any).fbq('trackCustom', event, params);
    } else {
      (window as any).fbq('trackCustom', event);
    }
  }
}
