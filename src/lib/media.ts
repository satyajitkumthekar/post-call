// Only one video plays at a time: when any video starts, pause the others on the page.
export function pauseOtherVideos(current: HTMLVideoElement) {
  document.querySelectorAll('video').forEach((video) => {
    if (video !== current && !video.paused) video.pause();
  });
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
