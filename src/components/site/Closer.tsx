import { ArrowIcon, Container } from './ui';

export default function Closer() {
  return (
    <section aria-labelledby="closer-title" className="bg-ink text-paper">
      <Container className="py-16 sm:py-32">
        <p className="mb-4 max-w-[30ch] font-display text-[1.375rem] font-medium leading-[1.3] tracking-[-0.015em] text-paper-muted">
          When I&rsquo;m scared of a big jump, I ask myself one question.
        </p>
        <h2 id="closer-title" className="mb-8 font-display text-[clamp(1.9rem,8.4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.022em]">
          What&rsquo;s the alternative?
        </h2>
        <div className="mb-8 grid max-w-[52ch] gap-4 text-lg leading-relaxed text-paper-soft">
          <p>The answer is always the same. I stay exactly where I am.</p>
          <p>
            You don&rsquo;t have to manage these problems for the rest of your life. You can finish them, and then spend
            everything you have on the things that actually matter to you.
          </p>
        </div>
        <p className="mb-8 grid gap-1">
          <b className="font-display text-[1.375rem] font-semibold tracking-[-0.015em]">See you on the call.</b>
          <span className="font-label text-xs uppercase tracking-[0.06em] text-paper-muted">Satya, founder of Superhuman Lab</span>
        </p>
        <a
          href="#video"
          className="inline-flex items-center gap-2 rounded-card bg-volt px-6 py-3.5 font-display text-sm font-semibold text-ink transition hover:-translate-y-px hover:bg-volt-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-paper"
        >
          Back to the video
          <ArrowIcon direction="up" />
        </a>
      </Container>
    </section>
  );
}
