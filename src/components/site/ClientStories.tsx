import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { RESULTS_INSTAGRAM_URL, stories } from '../../data/stories';
import type { ClientStory } from '../../data/stories';
import { pauseOtherVideos, prefersReducedMotion } from '../../lib/media';
import { ArrowIcon, Container, Eyebrow, PlayIcon, TextLink } from './ui';

// Each client gets one panel: their Instagram carousel on the left (their story, slide by slide),
// and on the right their words, their testimonial reel, their numbers, and a link to the case study.

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

  const arrow =
    'absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink shadow-card backdrop-blur transition hover:bg-surface disabled:pointer-events-none disabled:opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

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

function StoryReel({ story, active }: { story: ClientStory; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!active) videoRef.current?.pause();
  }, [active]);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    video.play().catch(() => setStarted(false));
  };

  // No video file yet: show a still from the reel instead.
  if (!story.reel.src) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-panel border border-line bg-surface shadow-card">
        <img
          src={story.reel.poster}
          alt={`A still from ${story.name}'s testimonial video`}
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute left-[57%] top-[81%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-line bg-surface/95 px-3.5 py-1.5 font-label text-xs text-muted shadow-card">
          Video coming soon
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-panel border border-line bg-surface shadow-card">
      <video
        ref={videoRef}
        src={story.reel.src}
        poster={story.reel.poster}
        preload="none"
        playsInline
        controls={started}
        controlsList="nodownload"
        onPlay={(e) => pauseOtherVideos(e.currentTarget)}
        onEnded={() => setStarted(false)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!started && (
        // The whole frame starts the video. The visible button sits in the empty strip under the captions,
        // left of the coach's window, so it never covers words or faces in the reel's layout.
        <button
          type="button"
          onClick={play}
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
      )}
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
  return (
    <article className="grid gap-8 pt-8 sm:pt-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-14">
      <div className="mx-auto w-full max-w-[420px] lg:sticky lg:top-24 lg:mx-0 lg:max-w-none lg:self-start">
        <StoryCarousel story={story} active={active} />
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <p className="font-label text-xs uppercase tracking-[0.09em] text-muted">
          <span className="font-medium text-ink">{story.name}</span>
          {story.role && <span> · {story.role}</span>}
        </p>
        <blockquote className="m-0 text-balance font-display text-[clamp(1.375rem,3.4vw,1.75rem)] font-medium leading-[1.3] tracking-[-0.02em]">
          &ldquo;{story.quote}&rdquo;
        </blockquote>

        <StoryReel story={story} active={active} />

        <dl className="grid grid-cols-2 gap-4">
          {story.stats.map((stat) => (
            <div key={stat.value} className="flex min-w-0 flex-col-reverse border-t-[1.5px] border-ink pt-3">
              <dt className="text-sm leading-snug text-muted">{stat.label}</dt>
              <dd className="m-0 font-display text-2xl font-semibold tabular-nums tracking-[-0.02em]">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex max-w-[62ch] flex-col gap-3 leading-[1.7] text-muted">
          {story.summary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-5">
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
      </div>
    </article>
  );
}

export default function ClientStories() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rowRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const count = stories.length;

  // Keep the active tab in view inside the tab row on phones, without moving the page.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const row = rowRef.current;
    const tab = tabRefs.current[active];
    if (row && tab) row.scrollTo({ left: tab.offsetLeft - 16, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [active]);

  const select = (i: number, focus = false) => {
    const target = (i + count) % count;
    setActive(target);
    if (focus) tabRefs.current[target]?.focus();
  };

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const moves: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: count - 1 };
    if (e.key in moves) {
      e.preventDefault();
      select(moves[e.key], true);
    }
  };

  const showNext = (i: number) => {
    select(i + 1);
    rowRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section id="stories" aria-labelledby="stories-title">
      <Container>
        <div className="border-t border-line pb-16 pt-16 sm:pb-24 sm:pt-24">
          <div className="mb-10 grid items-end gap-5 lg:grid-cols-2 lg:gap-12">
            <div>
              <Eyebrow>Building a new generation of Indians</Eyebrow>
              <h2
                id="stories-title"
                className="max-w-[22ch] text-balance font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.022em]"
              >
                Weapons of intellect and physicality.
              </h2>
            </div>
            <p className="max-w-[44ch] text-lg text-muted">
              Real clients, in their own words. Swipe through each story, then watch them tell it.
            </p>
          </div>

          <div
            ref={rowRef}
            role="tablist"
            aria-label="Client stories"
            className="no-scrollbar -mx-4 flex scroll-mt-24 gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:px-0"
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
                  className={`min-w-[42%] flex-none border-t-2 pb-2 pr-3 pt-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:min-w-0 ${
                    selected ? 'border-ink' : 'border-line hover:border-muted'
                  }`}
                >
                  <span className={`block font-display text-lg font-semibold ${selected ? 'text-ink' : 'text-muted'}`}>
                    {story.name}
                  </span>
                  <span className="block truncate font-label text-[11px] uppercase tracking-[0.06em] text-muted">
                    {story.role ?? ' '}
                  </span>
                </button>
              );
            })}
          </div>

          {stories.map((story, i) => (
            <div
              key={story.slug}
              role="tabpanel"
              id={`story-panel-${story.slug}`}
              aria-labelledby={`story-tab-${story.slug}`}
              hidden={i !== active}
            >
              <StoryPanel story={story} active={i === active} next={stories[(i + 1) % count]} onNext={() => showNext(i)} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
