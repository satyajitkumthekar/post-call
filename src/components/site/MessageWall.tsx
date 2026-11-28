import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MESSAGES_SHOWN_FIRST, messages as pinned } from '../../data/messages';
import { supabase } from '../../lib/supabase';
import { ArrowIcon, Container, Eyebrow } from './ui';

// Screenshots of client messages, best first (the list and its order live in src/data/messages.ts).
// Screenshots uploaded on the admin page that are not in that list follow, newest first.
// The wall places each one in the shortest column, in order, so the best ones sit at the top.

interface WallItem {
  key: string;
  src: string;
  /** Height divided by width. */
  ratio: number;
  alt: string;
}

const GAP = 16;
const base = import.meta.env.BASE_URL;
const pinnedItems: WallItem[] = pinned.map((m) => ({
  key: m.file,
  src: `${base}messages/${m.file}`,
  ratio: m.height / m.width,
  alt: m.alt,
}));
const pinnedUploads = new Set(pinned.map((m) => m.supabaseUrl).filter(Boolean));

function columnCount(width: number) {
  if (width >= 880) return 4;
  if (width >= 560) return 3;
  return 2;
}

export default function MessageWall() {
  const [uploads, setUploads] = useState<WallItem[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [width, setWidth] = useState(0);
  const wallRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const items = [...pinnedItems, ...uploads];
  const shown = showAll ? items : items.slice(0, MESSAGES_SHOWN_FIRST);

  // New screenshots from the admin page, if any.
  useEffect(() => {
    let alive = true;
    supabase
      .from('uploaded_files')
      .select('id, url')
      .eq('bucket_id', 'text-testimonial-images')
      .order('created_at', { ascending: false })
      .then(
        ({ data }) => {
          if (!alive || !data) return;
          setUploads(
            data
              .filter((m) => m.url && !pinnedUploads.has(m.url))
              .map((m) => ({ key: String(m.id), src: m.url, ratio: 1.3, alt: 'A message from a client' })),
          );
        },
        () => undefined,
      );
    return () => {
      alive = false;
    };
  }, []);

  // The wall's width decides the number of columns.
  useLayoutEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    setWidth(wall.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(wall);
    return () => observer.disconnect();
  }, []);

  // An uploaded screenshot's real shape is known once it loads.
  const measure = (key: string, img: HTMLImageElement) => {
    if (!img.naturalWidth) return;
    const ratio = img.naturalHeight / img.naturalWidth;
    setUploads((list) => list.map((m) => (m.key === key && Math.abs(m.ratio - ratio) > 0.01 ? { ...m, ratio } : m)));
  };

  const cols = columnCount(width);
  const colWidth = width ? (width - GAP * (cols - 1)) / cols : 0;
  const heights = new Array(cols).fill(0);
  const placed = shown.map((item) => {
    const col = heights.indexOf(Math.min(...heights));
    const top = heights[col];
    const height = Math.round(colWidth * item.ratio);
    heights[col] += height + GAP;
    return { item, left: Math.round(col * (colWidth + GAP)), top, height };
  });
  const wallHeight = Math.max(0, Math.max(...heights) - GAP);

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, items.length, close]);

  if (!items.length) return null;

  return (
    <section aria-labelledby="messages-title">
      <Container>
        <div className="pb-16 pt-16 sm:pb-24 sm:pt-24">
          <Eyebrow>In their own words</Eyebrow>
          <h2
            id="messages-title"
            className="max-w-[24ch] text-balance font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.022em]"
          >
            What clients send us along the way.
          </h2>

          <div ref={wallRef} className="relative mt-10" style={{ height: wallHeight }}>
            {colWidth > 0 &&
              placed.map(({ item, left, top, height }, i) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={(e) => {
                    lastTrigger.current = e.currentTarget;
                    setOpen(i);
                  }}
                  style={{ left, top, width: colWidth, height }}
                  className="absolute overflow-hidden rounded-card border border-line bg-ink transition-shadow hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading={i < MESSAGES_SHOWN_FIRST ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={(e) => measure(item.key, e.currentTarget)}
                    className="block h-full w-full object-cover object-top"
                  />
                </button>
              ))}
          </div>

          {!showAll && items.length > MESSAGES_SHOWN_FIRST && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Show all {items.length} messages
                <ArrowIcon direction="down" />
              </button>
            </div>
          )}
        </div>
      </Container>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Message ${open + 1} of ${items.length}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <img
            src={items[open].src}
            alt={items[open].alt}
            className="max-h-[85vh] max-w-full rounded-card object-contain shadow-lift"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-surface px-4 py-2 font-display text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
          >
            Close
          </button>
          {items.length > 1 && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                aria-label="Previous message"
                onClick={() => setOpen((open - 1 + items.length) % items.length)}
                className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                aria-label="Next message"
                onClick={() => setOpen((open + 1) % items.length)}
                className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
              >
                <ArrowIcon />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
