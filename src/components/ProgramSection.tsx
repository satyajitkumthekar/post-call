import { useEffect, useRef } from 'react';

const problemItems = [
  "You knew exactly what to eat. You'd researched it. You still didn't do it.",
  "You started, it was going well, then one bad week happened and you just... stopped. And couldn't really explain why.",
  "You've had the same conversation with yourself every Sunday night about how this week will be different.",
  "You had a rough day, you ate badly, you felt guilty about it, and somehow that made the next day worse too.",
  "The moment your schedule got disrupted, a work trip, a late night, a stressful month, the whole thing fell apart.",
  "You've been consistent before. You know you can do it. That's what makes it so frustrating that you're here again.",
  "It's not that you don't care. You care a lot. That's almost the problem.",
];

const solutionItems = [
  "We handle the thinking so you don't have to. The plan, the adjustments, the decisions are on us. You just show up.",
  "Someone else is carrying the weight of keeping this going. Your only job is to not disappear.",
  "No meal plans. We build how you eat around your actual day, your actual food, until good choices stop feeling like choices.",
  "When a bad week happens we don't start over. We pick up exactly where you left off. The momentum never fully dies.",
  "We look at everything quietly working against you. Sleep, stress, the daily patterns that have nothing to do with the gym but explain everything.",
  "Over time the rules disappear. The tracking stops. The Sunday night conversation stops. You just live like this, because it's become who you are.",
];

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => {
              el.classList.add('visible');
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
}

export default function ProgramSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative py-14 md:py-16"
      style={{ backgroundColor: '#111114' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12 reveal">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 flex-shrink-0" style={{ backgroundColor: 'rgba(201,168,76,0.4)' }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase' as const,
              color: '#C9A84C',
            }}>
              The Program
            </span>
            <div className="h-px w-12 flex-shrink-0" style={{ backgroundColor: 'rgba(201,168,76,0.4)' }} />
          </div>

          <h2
            className="mb-5"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(1.7rem, 4vw, 2.25rem)',
              color: '#F0EDE8',
              lineHeight: 1.1,
            }}
          >
            You already know what to do.
            <br />
            <em>That was never the problem.</em>
          </h2>

          <p
            className="max-w-xl mx-auto"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '0.9375rem',
              color: '#8A8680',
              lineHeight: '1.75',
            }}
          >
            Everyone who books this call has tried before. More than once. This is what that usually looks like:
          </p>
        </div>

        {/* Split card */}
        <div
          className="reveal rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.06)',
            backgroundColor: '#131316',
          }}
        >
          <div className="grid md:grid-cols-2">
            {/* Left — Sound familiar */}
            <div
              className="p-8 md:p-10"
              style={{ borderRight: '1px solid rgba(201,168,76,0.12)' }}
            >
              <div
                className="mb-7 italic"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: '1rem',
                  color: '#5A5855',
                }}
              >
                Sound familiar?
              </div>
              <div className="space-y-5">
                {problemItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      fontSize: '0.9375rem',
                      color: '#8A8680',
                      lineHeight: '1.7',
                    }}
                  >
                    <span className="flex-shrink-0 mt-0.5" style={{ color: '#5A5855' }}>—</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — What changes */}
            <div className="p-8 md:p-10">
              <div
                className="mb-7 italic"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: '1rem',
                  color: '#C9A84C',
                }}
              >
                What changes
              </div>
              <div className="space-y-5">
                {solutionItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      fontSize: '0.9375rem',
                      color: '#F0EDE8',
                      lineHeight: '1.7',
                    }}
                  >
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: '#8A8680' }}
                    >
                      —
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
