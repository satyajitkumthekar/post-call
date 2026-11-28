import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { BUNNY_LIBRARY_ID, RESULTS_INSTAGRAM_URL, stories } from '../../data/stories';
import type { ClientStory } from '../../data/stories';
import { pauseOtherVideos, prefersReducedMotion } from '../../lib/media';
import { ArrowIcon, Container, PlayIcon, TextLink } from './ui';

// Each client gets one panel: their testimonial video first, then their best result in their own words,
// the objection they had before starting, and their Instagram carousel (their story, slide by slide).
// The panels sit side by side: swiping moves the whole story, and the names row moves with it.

function StoryCarousel({ story, active }: { story: ClientStory; active: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = story.slides.length;

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    setIndex(Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth))));
  };

  const go = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.min(count - 1, Math.max(0, target));
    track.scrollTo({ left: i * track.clientWidth, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    }
  };

  // Arrows are for mouse users. On touch screens a swipe that starts on an arrow would move the whole
  // story instead of the slide, so phones get swipe, dots and the counter only.
  const arrow =
    'absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink shadow-card backdrop-blur transition hover:bg-surface disabled:pointer-events-none disabled:opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [@media(pointer:coarse)]:hidden';

  return (
    <figure className="m-0">
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${story.name}'s story, ${count} slides. Use the arrow keys to move.`}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-panel bg-ink shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {story.slides.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={`Slide ${i + 1} of ${count}: ${slide.alt}`}
              width={1080}
              height={1350}
              loading={active && i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              className="aspect-[4/5] w-full flex-none snap-start snap-always object-cover"
            />
          ))}
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 font-label text-xs tabular-nums text-paper backdrop-blur"
        >
          {index + 1} / {count}
        </span>
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide" className={`${arrow} left-3`}>
          <ArrowIcon direction="left" />
        </button>
        <button type="button" onClick={() => go(index + 1)} disabled={index === count - 1} aria-label="Next slide" className={`${arrow} right-3`}>
          <ArrowIcon />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-center">
        {story.slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            className="group grid h-6 w-5 place-items-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-200 ${
                i === index ? 'w-4 bg-ink' : 'w-1.5 bg-line group-hover:bg-muted'
              }`}
            />
          </button>
        ))}
      </div>
      <figcaption className="sr-only">
        {story.name}&rsquo;s Instagram carousel, slide {index + 1} of {count}.
      </figcaption>
    </figure>
  );
}

function PlayPill({ story, onPlay }: { story: ClientStory; onPlay: () => void }) {
  // The whole frame starts the video. The visible button sits in the empty strip under the captions,
  // left of the coach's window, so it never covers words or faces in the reel's layout.
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play ${story.name}'s testimonial${story.reel.length ? `, ${story.reel.length} long` : ''}`}
      className="group absolute inset-0 focus-visible:outline-none"
    >
      <span className="absolute left-[57%] top-[81%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-volt py-1.5 pl-1.5 pr-3.5 font-display text-sm font-semibold text-ink shadow-[0_8px_24px_rgba(18,41,30,.22)] transition-transform duration-200 group-hover:scale-[1.04] group-focus-visible:outline group-focus-visible:outline-[3px] group-focus-visible:outline-offset-4 group-focus-visible:outline-ink sm:py-2 sm:pl-2 sm:pr-4">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-volt sm:h-8 sm:w-8">
          <PlayIcon className="ml-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </span>
        <span className="hidden sm:inline">Watch {story.name}</span>
        {story.reel.length && <span className="font-label text-xs font-normal tabular-nums">{story.reel.length}</span>}
      </span>
    </button>
  );
}

function StoryReel({ story, active }: { story: ClientStory; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const { bunnyId, src, poster } = story.reel;

  // Leaving a story stops its video. A Bunny player is removed, which stops it; a file is paused.
  useEffect(() => {
    if (active) return;
    videoRef.current?.pause();
    if (bunnyId) setStarted(false);
  }, [active, bunnyId]);

  const frame = 'relative aspect-video w-full overflow-hidden rounded-panel border border-line bg-surface shadow-card';
  const still = (
    <img
      src={poster}
      alt={`A still from ${story.name}'s testimonial video`}
      width={1280}
      height={720}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );

  if (bunnyId) {
    return (
      <div className={frame}>
        {started ? (
          <iframe
            src={`https://player.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${bunnyId}?autoplay=true&preload=true&responsive=true`}
            title={`${story.name}'s testimonial`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <>
            {still}
            <PlayPill story={story} onPlay={() => setStarted(true)} />
          </>
        )}
      </div>
    );
  }

  if (src) {
    const play = () => {
      const video = videoRef.current;
      if (!video) return;
      setStarted(true);
      video.play().catch(() => setStarted(false));
    };
    return (
      <div className={frame}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="none"
          playsInline
          controls={started}
          controlsList="nodownload"
          onPlay={(e) => pauseOtherVideos(e.currentTarget)}
          onEnded={() => setStarted(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {!started && <PlayPill story={story} onPlay={play} />}
      </div>
    );
  }

  // No video yet: a still from the reel.
  return (
    <div className={frame}>
      {still}
      <span className="absolute left-[57%] top-[81%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-line bg-surface/95 px-3.5 py-1.5 font-label text-xs text-muted shadow-card">
        Video coming soon
      </span>
    </div>
  );
}

function StoryPanel({
  story,
  active,
  next,
  onNext,
}: {
  story: ClientStory;
  active: boolean;
  next: ClientStory;
  onNext: () => void;
}) {
  // Phones: one column (video, result, objection, carousel, links). Desktop: the carousel moves to a right column.
  return (
    <article className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-12">
      <StoryReel story={story} active={active} />

      <div className="flex flex-col gap-5">
        <h3 className="m-0 text-balance font-display text-[clamp(1.5rem,5vw,2rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
          &ldquo;{story.headline}&rdquo;
        </h3>
        <div className="border-l-2 border-accent pl-4">
          <p className="font-label text-[11px] uppercase tracking-[0.08em] text-muted">
            {story.objectionLabel ?? `${story.name}’s biggest worry before starting`}
          </p>
          <p className="mt-1.5 max-w-[56ch] text-[15px] leading-[1.6] text-muted sm:text-base">{story.objection}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[420px] lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mx-0 lg:max-w-none">
        <StoryCarousel story={story} active={active} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-5 lg:self-start">
        {story.instagramUrl ? (
          <TextLink href={story.instagramUrl}>See {story.name}&rsquo;s case study on Instagram</TextLink>
        ) : (
          <TextLink href={RESULTS_INSTAGRAM_URL}>More client results on Instagram</TextLink>
        )}
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 font-display text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Next story: {next.name}
          <ArrowIcon />
        </button>
      </div>
    </article>
  );
}

export default function ClientStories() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // While a tap on a name scrolls the stories, the stories it passes on the way are not selected.
  const scrollingTo = useRef<number | null>(null);
  const count = stories.length;

  useEffect(() => {
    activeRef.current = active;
    // Only the story on screen can be reached with the keyboard or a screen reader.
    panelRefs.current.forEach((panel, i) => panel?.toggleAttribute('inert', i !== active));
  }, [active]);

  // On phones the names row cannot be moved on its own: it slides together with the stories.
  // As the stories move, the row moves with them, keeping the current name at the left edge.
  const syncRow = useCallback(() => {
    const track = trackRef.current;
    const row = rowRef.current;
    if (!track || !row || !track.clientWidth || row.scrollWidth <= row.clientWidth) return;
    const position = Math.min(count - 1, Math.max(0, track.scrollLeft / track.clientWidth));
    const i = Math.floor(position);
    const from = tabRefs.current[i]?.offsetLeft ?? 0;
    const to = tabRefs.current[Math.min(count - 1, i + 1)]?.offsetLeft ?? from;
    row.scrollLeft = from + (to - from) * (position - i) - 16;
  }, [count]);

  const select = useCallback(
    (i: number, focus = false) => {
      const target = Math.min(count - 1, Math.max(0, i));
      setActive(target);
      const track = trackRef.current;
      if (track) {
        scrollingTo.current = target;
        track.scrollTo({ left: target * track.clientWidth, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        window.setTimeout(() => {
          if (scrollingTo.current === target) scrollingTo.current = null;
        }, 1000);
      }
      if (focus) tabRefs.current[target]?.focus();
    },
    [count],
  );

  // Stay on the same story when the width changes, for example when a phone is turned.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      track.scrollLeft = activeRef.current * track.clientWidth;
      syncRow();
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [syncRow]);

  // A sideways swipe on the names row moves the stories (and so the names) under the finger.
  // When the finger lifts, it settles on the next or previous story.
  useEffect(() => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) return;
    let drag: { x: number; y: number; left: number; step: number; axis: 'x' | 'y' | null } | null = null;
    let swallowClick = false;
    const onStart = (e: TouchEvent) => {
      if (row.scrollWidth <= row.clientWidth || e.touches.length !== 1) return;
      const i = activeRef.current;
      const here = tabRefs.current[i]?.offsetLeft ?? 0;
      const next = tabRefs.current[i < count - 1 ? i + 1 : i - 1]?.offsetLeft ?? here + 1;
      drag = { x: e.touches[0].clientX, y: e.touches[0].clientY, left: track.scrollLeft, step: Math.max(1, Math.abs(next - here)), axis: null };
    };
    const onMove = (e: TouchEvent) => {
      if (!drag) return;
      const dx = e.touches[0].clientX - drag.x;
      const dy = e.touches[0].clientY - drag.y;
      if (!drag.axis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (drag.axis === 'x') {
          scrollingTo.current = null;
          track.style.scrollSnapType = 'none';
        }
      }
      if (drag.axis === 'x') track.scrollLeft = drag.left - (dx * track.clientWidth) / drag.step;
    };
    const onEnd = () => {
      const done = drag;
      drag = null;
      if (!done || done.axis !== 'x') return;
      track.style.scrollSnapType = '';
      swallowClick = true;
      window.setTimeout(() => {
        swallowClick = false;
      }, 400);
      const from = Math.round(done.left / track.clientWidth);
      const moved = (track.scrollLeft - done.left) / track.clientWidth;
      select(Math.abs(moved) < 0.15 ? from : from + Math.sign(moved) * Math.max(1, Math.round(Math.abs(moved))));
    };
    // A swipe that ends on a name is not a tap on that name.
    const onClick = (e: MouseEvent) => {
      if (!swallowClick) return;
      swallowClick = false;
      e.preventDefault();
      e.stopPropagation();
    };
    row.addEventListener('touchstart', onStart, { passive: true });
    row.addEventListener('touchmove', onMove, { passive: true });
    row.addEventListener('touchend', onEnd);
    row.addEventListener('touchcancel', onEnd);
    row.addEventListener('click', onClick, true);
    return () => {
      row.removeEventListener('touchstart', onStart);
      row.removeEventListener('touchmove', onMove);
      row.removeEventListener('touchend', onEnd);
      row.removeEventListener('touchcancel', onEnd);
      row.removeEventListener('click', onClick, true);
    };
  }, [count, select]);

  // A swipe on the stories moves the whole story; the names row follows.
  const onTrackScroll = () => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    syncRow();
    const i = Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));
    if (scrollingTo.current !== null) {
      if (i !== scrollingTo.current) return;
      scrollingTo.current = null;
    }
    if (i !== activeRef.current) setActive(i);
  };

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const moves: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: count - 1 };
    if (e.key in moves) {
      e.preventDefault();
      select(moves[e.key], true);
    }
  };

  const showNext = (i: number) => {
    select((i + 1) % count);
    rowRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section id="stories" aria-labelledby="stories-title">
      <Container>
        <div className="pb-10 pt-6 sm:pb-16 sm:pt-10">
          <h2
            id="stories-title"
            className="mb-8 max-w-[22ch] text-balance font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.022em] sm:mb-10"
          >
            Weapons of intellect and physicality.
          </h2>

          <div
            ref={rowRef}
            role="tablist"
            aria-label="Client stories"
            className="no-scrollbar relative -mx-4 flex touch-pan-y touch-pinch-zoom scroll-mt-24 gap-3 overflow-x-hidden px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-x-4 sm:gap-y-3 sm:overflow-visible sm:px-0 lg:grid-cols-6"
          >
            {stories.map((story, i) => {
              const selected = i === active;
              return (
                <button
                  key={story.slug}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`story-tab-${story.slug}`}
                  aria-selected={selected}
                  aria-controls={`story-panel-${story.slug}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={`flex min-w-[42%] flex-none flex-col justify-start border-t-2 pb-2 pr-3 pt-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:min-w-0 ${
                    selected ? 'border-ink' : 'border-line hover:border-muted'
                  }`}
                >
                  <span className={`block font-display text-lg font-semibold ${selected ? 'text-ink' : 'text-muted'}`}>
                    {story.name}
                  </span>
                  <span className="line-clamp-2 font-label text-[11px] uppercase leading-[1.5] tracking-[0.06em] text-muted">
                    {story.role ?? ' '}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            ref={trackRef}
            onScroll={onTrackScroll}
            className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain sm:-mx-6"
          >
            {stories.map((story, i) => (
              <div
                key={story.slug}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                role="tabpanel"
                id={`story-panel-${story.slug}`}
                aria-labelledby={`story-tab-${story.slug}`}
                className="w-full flex-none snap-start snap-always px-4 pb-6 pt-6 sm:px-6 sm:pt-8"
              >
                <StoryPanel story={story} active={i === active} next={stories[(i + 1) % count]} onNext={() => showNext(i)} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
