import { LINKS } from './links';
import { Container, Eyebrow, TextLink } from './ui';

// The Last Piece, from the offer doc, in plain words: why it hasn't worked before, then the three parts.

const parts = [
  {
    tag: 'Your state',
    title: 'Hard days stop deciding for you.',
    text: 'You learn to notice your triggers early, stay steady under stress instead of giving in, and look back on what happened so the new habits stick. Over time, a hard day stops deciding what you eat and whether you train.',
  },
  {
    tag: 'Your food',
    title: 'No meal plans.',
    text: 'We start from what you already eat and take the easiest path forward: a few swaps, or fixing a couple of meals. One or two small meals you repeat every day become your anchor, so you can eat what you like the rest of the time, guided by your hunger. In the end, you don’t need to track your food at all.',
  },
  {
    tag: 'Your training',
    title: 'No workout plans.',
    text: 'You build your own way of training, around your goals and your life, that you can keep for good. It builds muscle and strength. When life is calm, you grow. When it’s chaotic, you maintain. You never have to start again.',
  },
];

export default function ProgramSection() {
  return (
    <section id="program" aria-labelledby="program-title" className="bg-ink text-paper">
      <Container className="py-16 sm:py-24">
        <Eyebrow dark>The program</Eyebrow>
        <h2
          id="program-title"
          className="mb-4 font-display text-[clamp(1.9rem,8.4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.022em]"
        >
          The Last Piece
        </h2>
        <p className="mb-10 flex flex-wrap gap-x-3 gap-y-1 font-label text-xs tracking-[0.04em] text-paper-muted">
          <span>By Satya, founder of Superhuman Lab</span>
          <a
            href={LINKS.myStory}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded text-paper-soft underline underline-offset-[3px] hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          >
            Read &ldquo;My Story&rdquo;
          </a>
        </p>
        <p className="mb-14 max-w-[26ch] text-balance font-display text-[clamp(1.375rem,3.4vw,1.75rem)] font-medium leading-[1.3] tracking-[-0.02em]">
          You&rsquo;ve built the career and the life. Your body is the last piece of the puzzle.
        </p>

        <h3 className="mb-4 max-w-[18ch] font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.022em]">
          It&rsquo;s not because you lack discipline.
        </h3>
        <div className="mb-12 grid max-w-[60ch] gap-3 text-[17px] leading-[1.65] text-paper-soft">
          <p>Two things get in the way:</p>
          <ul className="grid gap-3 border-l-2 border-volt/60 pl-4">
            <li>
              <b className="font-semibold text-paper">Stress.</b> After a hard day or a long week, you stop doing what you
              know you should.
            </li>
            <li>
              <b className="font-semibold text-paper">Plans.</b> Most programs hand you a meal plan, a workout plan and a
              coach who checks in. They only work for as long as you can force yourself to follow them.
            </li>
          </ul>
          <p>The Last Piece fixes both, in three parts.</p>
        </div>

        <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
          {parts.map((part, i) => (
            <li key={part.tag} className="min-w-0 border-t border-paper/15 pt-5">
              <span className="mb-3 block font-label text-xs uppercase tracking-[0.1em] text-volt">
                {String(i + 1).padStart(2, '0')} &middot; {part.tag}
              </span>
              <h4 className="mb-2 font-display text-xl font-semibold tracking-[-0.015em]">{part.title}</h4>
              <p className="leading-[1.7] text-paper-soft">{part.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-paper/15 pt-8 sm:mt-20">
          <p className="max-w-[54ch] leading-relaxed text-paper-soft">
            Everything here is free to read in the Superhuman KIT. The Last Piece is us doing it with you.
          </p>
          <TextLink href={LINKS.kit} dark>
            Read the Superhuman KIT
          </TextLink>
        </div>
      </Container>
    </section>
  );
}
