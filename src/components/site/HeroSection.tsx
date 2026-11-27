import MainVideo from './MainVideo';
import { Container, Eyebrow } from './ui';

export default function HeroSection() {
  return (
    <section aria-labelledby="hero-title">
      <Container className="pb-16 pt-8 sm:pb-24 sm:pt-12">
        <div className="mb-6 grid items-end gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] xl:gap-12">
          <div>
            <Eyebrow>You&rsquo;re in</Eyebrow>
            <h1
              id="hero-title"
              className="text-balance font-display text-[clamp(1.9rem,8.4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.022em]"
            >
              The call is booked. <span className="block font-medium text-muted">Now let&rsquo;s make it count.</span>
            </h1>
          </div>
          <p className="max-w-[38ch] text-lg text-muted xl:pb-1">
            Spend ten minutes here before we talk. It covers what The Last Piece is, how it works and what you get, so the
            call can be about you.
          </p>
        </div>
        <MainVideo />
      </Container>
    </section>
  );
}
