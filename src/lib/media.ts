// Only one video plays at a time: when any video starts, pause the others on the page.
export function pauseOtherVideos(current: HTMLVideoElement) {
  document.querySelectorAll('video').forEach((video) => {
    if (video !== current && !video.paused) video.pause();
  });
}

export function formatLength(seconds: number): string | null {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
