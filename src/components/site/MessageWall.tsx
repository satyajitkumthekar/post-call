import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowIcon, Container, Eyebrow } from './ui';

interface Message {
  id: string;
  url: string;
}

// Screenshots of client messages, from the "text-testimonial-images" bucket (uploaded on the admin page).
// The section hides itself when there are none.
export default function MessageWall() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from('uploaded_files')
      .select('id, url')
      .eq('bucket_id', 'text-testimonial-images')
      .order('created_at', { ascending: true })
      .then(
        ({ data }) => {
          if (alive && data) setMessages(data.filter((m) => m.url));
        },
        () => undefined,
      );
    return () => {
      alive = false;
    };
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % messages.length));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + messages.length) % messages.length));
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, messages.length, close]);

  if (!messages.length) return null;

  return (
    <section aria-labelledby="messages-title">
      <Container>
        <div className="border-t border-line pb-16 pt-16 sm:pb-24 sm:pt-24">
          <Eyebrow>In their own words</Eyebrow>
          <h2
            id="messages-title"
            className="max-w-[24ch] text-balance font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.022em]"
          >
            What clients send us along the way.
          </h2>
          <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4">
            {messages.map((message, i) => (
              <button
                key={message.id}
                type="button"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setOpen(i);
                }}
                className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-card border border-line bg-surface transition-shadow hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label={`Open message ${i + 1} of ${messages.length}`}
              >
                <img src={message.url} alt={`Message from a client, ${i + 1} of ${messages.length}`} loading="lazy" decoding="async" className="block h-auto w-full" />
              </button>
            ))}
          </div>
        </div>
      </Container>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Message ${open + 1} of ${messages.length}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <img
            src={messages[open].url}
            alt={`Message from a client, ${open + 1} of ${messages.length}`}
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
          {messages.length > 1 && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                aria-label="Previous message"
                onClick={() => setOpen((open - 1 + messages.length) % messages.length)}
                className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                aria-label="Next message"
                onClick={() => setOpen((open + 1) % messages.length)}
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
