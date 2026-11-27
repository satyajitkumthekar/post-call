import { LINKS } from './links';
import { ArrowIcon, CheckBadge, Container, Eyebrow } from './ui';

const fit = [
  'You’ve built the career and the life, and your body is the last piece of the puzzle.',
  'You’re tired of starting every Monday again.',
  'You’re willing to be completely honest about yourself and your journey.',
  'You’re ready to start now, not when things settle down.',
  'You’re ready to invest in yourself the way you’ve invested in everything else.',
];

const steps = [
  'Pay $49. It counts toward your first three months.',
  'We book your onboarding call. You pay the remaining $551 on that call.',
  'Your first job is simple. Log what you eat, exactly as you eat it today, with no targets yet.',
];

export default function FitAndPrice() {
  return (
    <section aria-labelledby="fit-title">
      <Container>
        <div className="grid items-start gap-12 border-t border-line py-16 sm:py-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-16">
          <div>
            <Eyebrow>Is it for you</Eyebrow>
            <h2 id="fit-title" className="text-balance font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.022em]">
              This is for you if all of these are true.
            </h2>
            <ul className="my-8 grid list-none gap-4 p-0">
              {fit.map((line) => (
                <li key={line} className="grid grid-cols-[28px_minmax(0,1fr)] items-start gap-3 text-lg leading-normal">
                  <CheckBadge />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="max-w-[54ch] text-sm leading-relaxed text-muted">
              It works for people working twelve hour days and for people who travel every other week. It works for people with
              a cook at home and for people who have never cooked anything.
            </p>
            <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-muted">
              If you just want a meal plan and a workout split to follow, with someone looking over your shoulder just so that
              you feel accountable, this isn&rsquo;t for you.
            </p>
          </div>

          <aside aria-label="Price and how to join" className="rounded-panel border border-line bg-surface p-6 shadow-card sm:p-8">
            <span className="block font-label text-xs uppercase tracking-[0.09em] text-muted">The Last Piece</span>
            <p className="mt-4 flex items-baseline gap-2 font-display text-[clamp(2.25rem,8vw,3.5rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums">
              $200 <small className="text-lg font-medium tracking-normal text-muted">a month</small>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              You pay for your first three months when you start. After that, it&rsquo;s $200 a month.
            </p>
            <span className="mt-6 block border-t border-line pt-6 font-label text-xs uppercase tracking-[0.09em] text-muted">
              If you decide to join
            </span>
            <ol className="my-5 grid list-none gap-3 p-0">
              {steps.map((step, i) => (
                <li key={step} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2 text-sm leading-normal">
                  <span className="font-label text-xs leading-[1.8] text-accent">0{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <a
              href={LINKS.offerDoc}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-card bg-ink px-5 py-3.5 font-display text-sm font-semibold text-paper transition hover:-translate-y-px hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Read the full offer
              <ArrowIcon direction="out" />
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Want completely private coaching? 1:1 coaching with Satyajit is priced by the depth of coaching you need. Message{' '}
              <a
                href={LINKS.satyaInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline underline-offset-[3px]"
              >
                @satyajitkumthekar
              </a>{' '}
              on Instagram.
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
