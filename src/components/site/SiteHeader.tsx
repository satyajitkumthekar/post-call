import { Container } from './ui';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/95 backdrop-blur-md">
      <Container className="flex min-h-[60px] items-center justify-between gap-4 py-3">
        <a
          href="#top"
          className="flex min-w-0 items-center gap-3 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span className="grid h-[26px] w-[26px] flex-none place-items-center rounded-lg bg-ink" aria-hidden="true">
            <span className="h-[9px] w-[9px] rounded-full bg-volt" />
          </span>
          <span className="truncate font-display text-[0.95rem] font-semibold tracking-[-0.01em] text-ink">
            Superhuman <span className="text-accent">Lab</span>
          </span>
        </a>
        <span className="flex flex-none items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.08] py-[5px] pl-[9px] pr-[11px] font-label text-xs tracking-[0.04em] text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" />
          Call confirmed
        </span>
      </Container>
    </header>
  );
}
