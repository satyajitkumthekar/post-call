import { LINKS } from './links';
import { CheckBadge, Container, Eyebrow, TextLink } from './ui';

export default function BeforeWeTalk() {
  const card = 'min-w-0 rounded-panel border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:shadow-card';
  return (
    <section aria-labelledby="prep-title">
      <Container>
        <div className="border-t border-line py-16 sm:py-24">
          <Eyebrow>Before we talk</Eyebrow>
          <h2 id="prep-title" className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.022em]">
            Three things to do first.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className={card}>
              <CheckBadge />
              <h3 className="mb-2 mt-4 font-display text-lg font-semibold">Watch the video</h3>
              <p className="text-sm leading-relaxed text-muted">It&rsquo;s at the top of this page. Start there.</p>
              <div className="mt-3">
                <TextLink href="#video">Go to the video</TextLink>
              </div>
            </div>
            <div className={card}>
              <CheckBadge />
              <h3 className="mb-2 mt-4 font-display text-lg font-semibold">Read the Superhuman KIT</h3>
              <p className="text-sm leading-relaxed text-muted">
                The whole system on one page: how to train, how to eat, how to handle social plans, and the regulation practice
                that makes it stick. It&rsquo;s free and takes about seven minutes.
              </p>
              <div className="mt-3">
                <TextLink href={LINKS.kit}>Open the KIT</TextLink>
              </div>
            </div>
            <div className={card}>
              <CheckBadge />
              <h3 className="mb-2 mt-4 font-display text-lg font-semibold">Come ready to be honest</h3>
              <p className="text-sm leading-relaxed text-muted">
                This works for people who are willing to be completely honest about themselves and their journey. The call is
                where that starts.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
