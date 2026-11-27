import { Container, Eyebrow } from './ui';

const inclusions = [
  { title: 'An onboarding call with Satya', text: 'We map out your exact goals and your vision, and chart your roadmap around the obstacles we can see coming.' },
  { title: 'Your training', text: 'Built for your goals on the Superhuman training system.' },
  { title: 'Technique reviews every two weeks', text: 'A call and a review of your technique, tempo and execution.' },
  { title: 'Weekly strength tracking', text: 'Your habits development coach tracks your strength every week and guides your progressions.' },
  { title: 'The Superhuman Tracker', text: 'Our own app, built in house to build your food awareness.' },
  { title: 'Personal cookbooks', text: 'You get these if you need them.' },
  {
    title: 'A private group with your team',
    text: 'Your coach works with you there day to day. Satya is in the group as your program architect, overseeing your progress. Access is unlimited.',
  },
  { title: 'A community', text: 'Like minded people who are on the same journey.' },
  { title: 'Weekly group calls with Satya', text: 'Every week we go deeper into understanding your nervous system.' },
];

export default function WhatYouGet() {
  return (
    <section aria-labelledby="get-title">
      <Container className="py-16 sm:py-24">
        <div className="mb-12 grid items-end gap-5 lg:grid-cols-2 lg:gap-12">
          <div>
            <Eyebrow>What you get</Eyebrow>
            <h2 id="get-title" className="text-balance font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.022em]">
              Everything inside The Last Piece.
            </h2>
          </div>
          <p className="max-w-[44ch] text-lg text-muted">
            A habits development coach works with you day to day on your training and nutrition habits. Satya designs your
            program and oversees it as your program architect.
          </p>
        </div>
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {inclusions.map((item) => (
            <div key={item.title} className="min-w-0 border-t-[1.5px] border-ink pt-4">
              <h3 className="mb-2 font-display text-lg font-semibold leading-snug tracking-[-0.01em]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
