import { LINKS } from './links';
import { Container, Eyebrow, TextLink } from './ui';

// The Last Piece, in the words of the offer doc. Each part is one heading and one block of text:
// the client's voice, what changes, and where it lands.

const intro = [
  'It’s because you’ve spent years in a dysregulated state, and looking after your body has been reduced to something completely mechanical.',
  'Most programs give you a training plan, form checks, a diet plan and a coach who holds you accountable. That’s brute force. Your success depends entirely on how long you can keep forcing it.',
  'The Last Piece is built to reverse this. Instead of brute force, we remove the obstacles. Two things get in the way: your state and your system.',
];

interface Pillar {
  tag: string;
  title: string;
  pain: string;
  paragraphs: string[];
  lands: string;
}

const pillars: Pillar[] = [
  {
    tag: 'Your state',
    title: 'Aware, Regulate, Reflect',
    pain: 'Most of the time I’m rational and motivated, and I know exactly what to do. But at the end of a hard day or a long week, no matter how good I’ve been, all that logic disappears.',
    paragraphs: [
      'You become far less reactive. You start seeing your triggers and your patterns coming from a mile away, and the same emotions and thoughts stop hitting you with the same intensity.',
      'Being regulated isn’t about managing your nervous system once you’re already dysregulated. It means you can endure more without reacting or giving in.',
    ],
    lands: 'A hard day stops deciding what you eat and whether you train. And the new patterns you create get reinforced until they become a part of you.',
  },
  {
    tag: 'Your system: food',
    title: 'No meal plans',
    pain: 'Every plan I’ve tried was exhausting, and it felt like it shouldn’t be this mechanical.',
    paragraphs: [
      'Food stops being a test of willpower. Every decision becomes yours, not something a PDF told you to eat. You start from where you are and take the easiest path to where you need to be. That can be a few swaps or, if you’re far off, fixing a couple of meals.',
      'You learn to build anchor meals, a base of one or two small, consistent meals that lets you eat basically whatever you like for the rest of your meals. You learn to listen to your body and eat by your hunger.',
    ],
    lands: 'In the end, you don’t need to track your food at all.',
  },
  {
    tag: 'Your system: training',
    title: 'No workout plans',
    pain: 'I start strong every time, but three or four weeks in, one rest day becomes two, and then I’m out.',
    paragraphs: [
      'You don’t get a workout plan. You walk away with a training system that is yours, shaped around your goals, that you can run for the rest of your life.',
      'It builds muscle and strength, and it bends to your life instead of you bending to a routine.',
    ],
    lands: 'When life is calm, you grow. When life is at peak chaos, you maintain. You never have to start again.',
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

        <h3 className="mb-5 max-w-[18ch] font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.022em]">
          It&rsquo;s not because you lack discipline.
        </h3>
        <div className="mb-14 grid max-w-[62ch] gap-4 leading-[1.72] text-paper-soft">
          {intro.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>

        <div className="grid gap-12">
          {pillars.map((p) => (
            <article key={p.tag} className="border-t border-paper/15 pt-6">
              <h4 className="mb-4 font-display text-[1.375rem] font-semibold leading-tight tracking-[-0.02em]">
                <span className="mb-1.5 block font-label text-xs font-normal uppercase tracking-[0.1em] text-volt">{p.tag}</span>
                {p.title}
              </h4>
              <div className="grid max-w-[62ch] gap-4 leading-[1.72] text-paper-soft">
                <p className="italic text-paper-muted">&ldquo;{p.pain}&rdquo;</p>
                {p.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
                <p className="font-medium text-paper">{p.lands}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-paper/15 pt-8 sm:mt-20">
          <p className="max-w-[54ch] leading-relaxed text-paper-soft">
            The whole system is free to read in the Superhuman KIT. That is the do it yourself version. The Last Piece is us
            running it with you.
          </p>
          <TextLink href={LINKS.kit} dark>
            Read the Superhuman KIT
          </TextLink>
        </div>
      </Container>
    </section>
  );
}
