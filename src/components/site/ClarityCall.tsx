import { Container, Eyebrow } from './ui';

// The four parts of the call, in the order they happen.
const agenda = [
  { title: 'Your current reality', text: 'We’ll discuss your fitness levels, energy, confidence, and what your days actually look like.' },
  { title: 'Your goals, honestly', text: 'Not what you think you should want. What actually matters to you right now.' },
  { title: 'What’s been in the way', text: 'Clarity on the real patterns. Not motivation, not discipline. The actual structural blockers.' },
  { title: 'A direction forward', text: 'A clear picture of how a program built for your life would actually work and what that looks like.' },
];

export default function ClarityCall() {
  return (
    <section aria-labelledby="call-title">
      <Container>
        <div className="border-t border-line py-16 sm:py-24">
          <div className="mb-12 grid items-end gap-5 lg:grid-cols-2 lg:gap-12">
            <div>
              <Eyebrow>The Clarity Call</Eyebrow>
              <h2 id="call-title" className="text-balance font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.022em]">
                Four things we&rsquo;ll actually get through.
              </h2>
            </div>
            <p className="max-w-[44ch] text-lg text-muted">
              A free call where we map exactly what it will take to crack your body. You leave with a clear next step, whether
              or not we end up working together.
            </p>
          </div>
          <ol className="grid list-none gap-x-6 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {agenda.map((item, i) => (
              <li key={item.title} className="min-w-0 border-t-[1.5px] border-ink pt-4">
                <span className="mb-3 block font-label text-xs tracking-[0.06em] text-accent">0{i + 1}</span>
                <h3 className="mb-2 font-display text-lg font-semibold tracking-[-0.01em]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
