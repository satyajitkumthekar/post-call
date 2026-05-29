import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronDown, Volume2, VolumeX, Play, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ensureCalendlyScript, openCalendlyPopup, buildCalendlyUrl } from '../lib/calendly';

interface Testimonial {
  id: string;
  testimonial_name: string | null;
  testimonial_designation: string | null;
  url: string;
}

interface StoryPanel {
  lines: string[];
  scene?: string;
}

const storyPanels: StoryPanel[] = [
  {
    scene: 'hook',
    lines: [
      "If you're an Indian living abroad, you already know this feeling.",
      "You've poured everything into your career. Into getting settled. Into building a whole life from scratch, in a country that wasn't yours to begin with.",
      "And you've done it. Most of it, anyway.",
    ],
  },
  {
    scene: 'hook',
    lines: [
      "But somewhere in all of it, your body became the one thing you let slide.",
      "The one piece you've never quite managed to sort out.",
      "And no matter how much you achieve everywhere else, it sits at the back of your mind. Every single day.",
    ],
  },
  {
    scene: 'pain-a',
    lines: [
      "You feel it when you look around the room.",
      "Everyone seems to be in better shape than you. Your colleagues. The people you respect.",
      "And quietly, it gets to you.",
    ],
  },
  {
    scene: 'pain-a',
    lines: [
      "You feel it when you compare yourself to people who've done less than you.",
      "People who haven't built half of what you have.",
      "Yet somehow they walk into a room and command it in a way you can't.",
    ],
  },
  {
    scene: 'pain-b',
    lines: [
      "You feel it at the pool, when everyone takes their shirt off, and you're the one who keeps yours on.",
      "You feel it on a Sunday night, halfway through a pizza, when it quietly hits you.",
      "What am I even doing.",
    ],
  },
  {
    scene: 'loop',
    lines: [
      "And every time you finally find some rhythm, life gets in the way.",
      "A trip home. A brutal stretch at work. A few weeks where everything is on fire at once.",
      "By the time you surface, all of it is gone. And you're starting from zero. Again.",
    ],
  },
  {
    scene: 'loop',
    lines: [
      "You've been on this loop for years now.",
      "Start. Break. Restart. Promise yourself that Monday is the day.",
      "And somewhere along the way, you started to believe the problem was you.",
    ],
  },
  {
    scene: 'reframe',
    lines: [
      "So let me say this clearly, because it's the most important thing on this page.",
      "It was never your discipline.",
    ],
  },
  {
    scene: 'reframe',
    lines: [
      "Look at everything you've built. The career. The life. From nothing.",
      "You have more discipline than almost anyone you know.",
      "The idea that all of it disappears the second it comes to your body makes no sense. It was never you. It was the system you were handed.",
    ],
  },
  {
    scene: 'program',
    lines: [
      "Every program you've tried was a fixed path. Point A to point B, that you forced your life into.",
      "But you can't force your life onto a fixed path. It has to bend with your life, speed up when you can, ease off when you can't.",
      "That's what we built. It's called the Superhuman Protocol. There are five parts.",
    ],
  },
  {
    scene: 'mechanism-1',
    lines: [
      "One. We take the thinking off your plate.",
      "You and I both know you don't have a knowledge problem. You can figure things out, you've done it a thousand times in every other area of your life. What you don't have is the mental bandwidth to do it on top of everything else.",
      "So you get total clarity. A paved path. No guessing, no decisions. You just walk it.",
    ],
  },
  {
    scene: 'mechanism-2',
    lines: [
      "Two. You stop doing this alone.",
      "You get a dedicated team in your corner whose only job is to make you win. A system of accountability that keeps you in check throughout the journey, and 24/7 access to your team.",
      "Every time life throws a curveball at you, we're right there with you. You're never doing this alone again.",
    ],
  },
  {
    scene: 'mechanism-3',
    lines: [
      "Three. Your food.",
      "Let's be honest. This is where you've struggled the most, because food has always been a love language for us. I still crave my mom's parothas every time I have a bad day.",
      "Every plan you've tried only ever restricted the food you love, and every time you broke the diet, you felt like you were back at zero. Caged.",
    ],
  },
  {
    scene: 'mechanism-3',
    lines: [
      "So we don't put you on a diet.",
      "You learn how to anchor your nutrition around one meal that does all the heavy lifting.",
      "And that creates space for you to eat the food you love, while still making progress.",
    ],
  },
  {
    scene: 'mechanism-4',
    lines: [
      "Four. Your fitness bends with your life, not the other way around.",
      "Every program you've tried was built for a perfect week, and you spent years forcing every imperfect one, the travel, the brutal weeks, the weddings, into that plan.",
      "This works the opposite way. The plan bends every single week, around what your life actually looks like.",
    ],
  },
  {
    scene: 'mechanism-4',
    lines: [
      "And once you've navigated a few of those weeks with us, the travel, the chaos, the family obligations, you'll have something you've never had.",
      "The confidence that you can stay on track no matter what life throws at you.",
    ],
  },
  {
    scene: 'mechanism-5',
    lines: [
      "Five. The work that makes all of it last.",
      "Everything you've ever tried has only focused on the external. Your body. Your training. Your schedule.",
      "But every time you slipped, there was a voice in your head right before it. You've had a long day. You deserve this. You'll start Monday. You knew it wasn't good for you. You listened anyway.",
    ],
  },
  {
    scene: 'mechanism-5',
    lines: [
      "So we give you the exact tools to catch that voice in the moment, and beat it. Every single time.",
      "Because anyone can get you in shape for a few months. Our job is to make you the person who stays in shape for life.",
      "Once that happens, you don't need willpower anymore. Fitness just becomes automatic.",
    ],
  },
];

export default function Schedule() {
  const [vslUrl, setVslUrl] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [vslPlaying, setVslPlaying] = useState(false);
  const [showScrollCue, setShowScrollCue] = useState(true);
  const [showSkipBtn, setShowSkipBtn] = useState(true);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});
  const [muteIconVisible, setMuteIconVisible] = useState<Record<string, boolean>>({});
  const [videoLoading, setVideoLoading] = useState<Record<string, boolean>>({});
  const [videoErrors, setVideoErrors] = useState<Record<string, boolean>>({});

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const vslVideoRef = useRef<HTMLVideoElement>(null);
  const testimonialRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const testimonialSectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const testimonialsStartRef = useRef<HTMLElement | null>(null);
  const muteTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const params = new URLSearchParams(window.location.search);
  const urlName = params.get('name');
  const urlWhatsapp = params.get('whatsapp');
  const leadData = urlName && urlWhatsapp ? { firstName: urlName, whatsappNumber: urlWhatsapp } : null;
  const calendlyUrl = buildCalendlyUrl(leadData);

  const openBooking = useCallback(() => {
    openCalendlyPopup(calendlyUrl);
  }, [calendlyUrl]);

  useEffect(() => {
    ensureCalendlyScript();
  }, []);

  useEffect(() => {
    const fetchVsl = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'vsl_video_url')
        .maybeSingle();
      if (data?.value) setVslUrl(data.value);
    };
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('uploaded_files')
        .select('id, testimonial_name, testimonial_designation, url')
        .eq('bucket_id', 'video-testimonials')
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setTestimonials(data);
    };
    fetchVsl();
    fetchTestimonials();
  }, []);

  // Panel entrance animations via IntersectionObserver (rooted in scroll container)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('panel-visible');
          }
        });
      },
      { root: container, threshold: 0.3 }
    );

    const panels = container.querySelectorAll('.schedule-panel');
    panels.forEach((panel) => observer.observe(panel));

    return () => observer.disconnect();
  }, [testimonials.length]);

  // Hide scroll cue on first scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop > 50) {
        setShowScrollCue(false);
      }
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Show/hide "Skip to testimonials" based on whether user is in testimonials area
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || testimonials.length === 0) return;

    const testimonialSections = container.querySelectorAll('[data-testimonial-id]');
    if (testimonialSections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((e) => e.isIntersecting);
        if (anyVisible) {
          setShowSkipBtn(false);
        } else {
          setShowSkipBtn(true);
        }
      },
      { root: container, threshold: 0.3 }
    );

    testimonialSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [testimonials]);

  // Testimonial video autoplay/pause and lazy preload
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || testimonials.length === 0) return;

    // Wait a frame for refs to be populated after render
    const frameId = requestAnimationFrame(() => {
      // Autoplay observer: play when 60% visible, pause when not
      const playObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const section = entry.target as HTMLElement;
            const video = section.querySelector('video');
            if (!video) return;

            if (entry.isIntersecting) {
              setVideoLoading((prev) => ({ ...prev, [section.dataset.testimonialId || '']: true }));
              video.play().then(() => {
                setVideoLoading((prev) => ({ ...prev, [section.dataset.testimonialId || '']: false }));
              }).catch(() => {
                setVideoLoading((prev) => ({ ...prev, [section.dataset.testimonialId || '']: false }));
              });
            } else {
              video.pause();
            }
          });
        },
        { root: container, threshold: 0.6 }
      );

      // Preload observer: start loading video 1 panel ahead
      const preloadObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const section = entry.target as HTMLElement;
              const video = section.querySelector('video');
              if (video && video.preload === 'none') {
                video.preload = 'auto';
              }
            }
          });
        },
        { root: container, rootMargin: '100% 0px 100% 0px', threshold: 0 }
      );

      Object.values(testimonialSectionRefs.current).forEach((section) => {
        if (section) {
          playObserver.observe(section);
          preloadObserver.observe(section);
        }
      });

      return () => {
        playObserver.disconnect();
        preloadObserver.disconnect();
      };
    });

    return () => cancelAnimationFrame(frameId);
  }, [testimonials]);

  // Pause VSL when scrolled away from panel 0
  useEffect(() => {
    const container = scrollContainerRef.current;
    const video = vslVideoRef.current;
    if (!container || !video) return;

    const handleScroll = () => {
      if (container.scrollTop > window.innerHeight * 0.5 && !video.paused) {
        video.pause();
      }
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [vslUrl]);

  const handleVslPlay = async () => {
    const video = vslVideoRef.current;
    if (!video) return;
    if (vslPlaying) {
      video.pause();
    } else {
      try { await video.play(); } catch {}
    }
  };

  const toggleMute = (id: string) => {
    const video = testimonialRefs.current[id];
    if (!video) return;
    const newMuted = !video.muted;
    video.muted = newMuted;
    setMutedStates((prev) => ({ ...prev, [id]: newMuted }));
    setMuteIconVisible((prev) => ({ ...prev, [id]: true }));
    if (muteTimeouts.current[id]) clearTimeout(muteTimeouts.current[id]);
    muteTimeouts.current[id] = setTimeout(() => {
      setMuteIconVisible((prev) => ({ ...prev, [id]: false }));
    }, 1500);
  };

  const scrollToTestimonials = useCallback(() => {
    const container = scrollContainerRef.current;
    const target = testimonialsStartRef.current;
    if (!container || !target) return;
    const offset = target.offsetTop;
    container.scrollTo({ top: offset, behavior: 'smooth' });
  }, []);

  const scrollToFirstTestimonial = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const target = container.querySelector('#testimonial-panel-0') as HTMLElement | null;
    if (!target) return;
    container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  }, []);

  const handleClose = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0" style={{ backgroundColor: '#070707' }}>
      {/* Fixed UI - Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-full transition-opacity hover:opacity-100"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(8px)',
          opacity: 0.7,
        }}
        aria-label="Close"
      >
        <X className="w-4 h-4" style={{ color: '#F0EDE8' }} />
      </button>

      {/* Fixed UI - Skip to Testimonials */}
      {showSkipBtn && testimonials.length > 0 && (
        <button
          onClick={scrollToTestimonials}
          className="fixed top-4 right-4 z-50 transition-opacity duration-300"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: '0.75rem',
            color: 'rgba(201,161,74,0.7)',
            letterSpacing: '0.02em',
          }}
        >
          Skip to testimonials
        </button>
      )}

      {/* Fixed UI - Bottom Book Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(201,161,74,0.3)',
          padding: '12px 24px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        }}
      >
        <button
          onClick={openBooking}
          className="w-full transition-transform active:scale-[0.97]"
          style={{
            maxWidth: '480px',
            backgroundColor: '#C9A14A',
            color: '#0A0A0A',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: '0.9rem',
            letterSpacing: '0.03em',
            padding: '14px 24px',
            borderRadius: '10px',
          }}
        >
          Book Your Call
        </button>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="schedule-scroll-container h-full overflow-y-auto"
        style={{
          scrollSnapType: 'y mandatory',
          overscrollBehaviorY: 'contain',
          WebkitOverflowScrolling: 'touch',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        {/* Panel 0: VSL */}
        <section
          className="schedule-panel relative flex flex-col items-center justify-center"
          style={{
            minHeight: '100svh',
            height: '100svh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            padding: '56px 24px 80px',
            backgroundColor: '#0A0A0A',
          }}
        >
          <div className="w-full max-w-sm flex flex-col items-center gap-6">
            <h1
              className="panel-line text-center"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 'clamp(1.5rem, 6vw, 1.9rem)',
                color: '#F0EDE8',
                lineHeight: 1.3,
              }}
            >
              Before we talk, watch this.
            </h1>

            {vslUrl ? (
              <div
                className="relative w-full rounded-xl overflow-hidden cursor-pointer"
                style={{
                  aspectRatio: '16/9',
                  backgroundColor: '#131316',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onClick={handleVslPlay}
              >
                <video
                  ref={vslVideoRef}
                  src={vslUrl}
                  className="w-full h-full object-contain"
                  playsInline
                  preload="metadata"
                  onPlay={() => setVslPlaying(true)}
                  onPause={() => setVslPlaying(false)}
                  onEnded={() => setVslPlaying(false)}
                />
                {!vslPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        border: '1.5px solid rgba(201,168,76,0.5)',
                        backgroundColor: 'rgba(201,168,76,0.07)',
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      <Play className="w-5 h-5 ml-0.5" style={{ color: '#C9A84C', fill: '#C9A84C' }} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="w-full rounded-xl animate-pulse"
                style={{ aspectRatio: '16/9', backgroundColor: '#131316' }}
              />
            )}

            <p
              className="panel-line text-center"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: '0.85rem',
                color: '#5A5855',
                lineHeight: 1.6,
              }}
            >
              Prefer to read instead? Just keep scrolling.
            </p>
          </div>

          {/* Scroll Cue */}
          {showScrollCue && (
            <div
              className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce"
              style={{ opacity: 0.5 }}
            >
              <ChevronDown className="w-5 h-5" style={{ color: '#C9A14A' }} />
            </div>
          )}
        </section>

        {/* Story Panels 1-18 */}
        {storyPanels.map((panel, idx) => (
          <section
            key={`story-${idx}`}
            className="schedule-panel relative flex flex-col items-center justify-center"
            style={{
              minHeight: '100svh',
              height: '100svh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              padding: '56px 24px 80px',
              backgroundColor: '#0A0A0A',
              backgroundImage: getSceneGradient(panel.scene),
            }}
          >
            <div className="w-full flex flex-col gap-4">
              {panel.lines.map((line, lineIdx) => (
                <p
                  key={lineIdx}
                  className="panel-line"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize: 'clamp(1.2rem, 5vw, 1.5rem)',
                    color: lineIdx === 0 ? '#F0EDE8' : '#C8C4BE',
                    lineHeight: 1.55,
                    animationDelay: `${lineIdx * 80}ms`,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </section>
        ))}

        {/* Transition Panel */}
        <section
          ref={(el) => { testimonialsStartRef.current = el; }}
          className="schedule-panel relative flex flex-col items-center justify-center"
          style={{
            minHeight: '100svh',
            height: '100svh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            padding: '56px 24px 80px',
            backgroundColor: '#0A0A0A',
          }}
        >
          <div className="flex flex-col items-center gap-8">
            <p
              className="panel-line text-center"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 'clamp(1.5rem, 6vw, 1.9rem)',
                color: '#F0EDE8',
                lineHeight: 1.3,
              }}
            >
              But you don't have to take my word for it.
            </p>
            {testimonials.length > 0 && (
              <button
                onClick={scrollToFirstTestimonial}
                className="panel-line flex items-center gap-2 transition-transform active:scale-95"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: '0.9rem',
                  color: '#C9A14A',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '1px solid rgba(201,161,74,0.4)',
                  animationDelay: '160ms',
                }}
              >
                Watch their stories
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        {/* Testimonial Panels */}
        {testimonials.map((testimonial, idx) => (
          <section
            key={testimonial.id}
            id={`testimonial-panel-${idx}`}
            ref={(el) => { testimonialSectionRefs.current[testimonial.id] = el; }}
            data-testimonial-id={testimonial.id}
            className="schedule-panel relative flex items-end"
            style={{
              minHeight: '100svh',
              height: '100svh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              backgroundColor: '#0A0A0A',
              overflow: 'hidden',
            }}
          >
            {/* Video */}
            <video
              ref={(el) => { testimonialRefs.current[testimonial.id] = el; }}
              src={testimonial.url}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
              loop
              preload="none"
              onClick={() => toggleMute(testimonial.id)}
              onWaiting={() => setVideoLoading((prev) => ({ ...prev, [testimonial.id]: true }))}
              onPlaying={() => setVideoLoading((prev) => ({ ...prev, [testimonial.id]: false }))}
              onError={() => setVideoErrors((prev) => ({ ...prev, [testimonial.id]: true }))}
            />

            {/* Loading indicator */}
            {videoLoading[testimonial.id] && !videoErrors[testimonial.id] && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: 'rgba(201,161,74,0.7)' }}
                />
              </div>
            )}

            {/* Error state */}
            {videoErrors[testimonial.id] && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.85rem',
                    color: '#5A5855',
                  }}
                >
                  Video unavailable
                </p>
              </div>
            )}

            {/* Mute/Unmute indicator */}
            <div
              className="absolute top-16 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-opacity duration-300 cursor-pointer"
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                opacity: muteIconVisible[testimonial.id] ? 1 : 0.6,
              }}
              onClick={(e) => { e.stopPropagation(); toggleMute(testimonial.id); }}
            >
              {mutedStates[testimonial.id] === false ? (
                <Volume2 className="w-4 h-4" style={{ color: '#F0EDE8' }} />
              ) : (
                <VolumeX className="w-4 h-4" style={{ color: '#F0EDE8' }} />
              )}
            </div>

            {/* Dark gradient overlay - lower third */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, transparent 65%)',
              }}
            />

            {/* Caption overlay */}
            <div className="relative z-10 w-full px-6 pb-24">
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: 'clamp(1.5rem, 6vw, 1.75rem)',
                  color: '#F0EDE8',
                  marginBottom: '4px',
                }}
              >
                {testimonial.testimonial_name || 'Client'}
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.85rem',
                  color: '#8A8680',
                }}
              >
                {testimonial.testimonial_designation || ''}
              </p>
            </div>
          </section>
        ))}

        {/* Final CTA Panel */}
        <section
          className="schedule-panel relative flex flex-col items-center justify-center"
          style={{
            minHeight: '100svh',
            height: '100svh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            padding: '56px 24px 80px',
            backgroundColor: '#0A0A0A',
          }}
        >
          <div className="flex flex-col items-center gap-6 text-center">
            <h2
              className="panel-line"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 'clamp(1.5rem, 6vw, 1.9rem)',
                color: '#F0EDE8',
                lineHeight: 1.3,
              }}
            >
              If this sounded like your life, let's get the last piece handled.
            </h2>
            <p
              className="panel-line"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(0.9rem, 3.5vw, 1rem)',
                color: '#8A8680',
                lineHeight: 1.65,
                animationDelay: '80ms',
              }}
            >
              It starts with a 30-minute diagnostic call. We'll look at where you are, where you want to be, and exactly what it would take to finally fix this.
            </p>
            <button
              onClick={openBooking}
              className="panel-line mt-4 transition-transform active:scale-[0.97]"
              style={{
                backgroundColor: '#C9A14A',
                color: '#0A0A0A',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: '1rem',
                letterSpacing: '0.03em',
                padding: '16px 40px',
                borderRadius: '10px',
                animationDelay: '160ms',
              }}
            >
              Book Your Call
            </button>
          </div>
        </section>
      </div>

      {/* Scoped styles */}
      <style>{`
        .schedule-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .schedule-scroll-container {
          scrollbar-width: none;
        }

        .schedule-panel .panel-line {
          opacity: 0;
          transform: translateY(16px);
        }

        .schedule-panel.panel-visible .panel-line {
          animation: fadeRiseIn 400ms ease-out forwards;
        }

        @keyframes fadeRiseIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function getSceneGradient(scene?: string): string | undefined {
  switch (scene) {
    case 'hook':
      return 'radial-gradient(ellipse at 50% 60%, rgba(18,18,20,1) 0%, #0A0A0A 70%)';
    case 'pain-a':
    case 'pain-b':
      return 'radial-gradient(ellipse at 50% 40%, rgba(16,15,14,1) 0%, #0A0A0A 70%)';
    case 'loop':
      return 'radial-gradient(ellipse at 50% 50%, rgba(14,14,16,1) 0%, #0A0A0A 70%)';
    case 'reframe':
      return 'radial-gradient(ellipse at 50% 50%, rgba(20,18,14,1) 0%, #0A0A0A 70%)';
    case 'program':
    case 'mechanism-1':
    case 'mechanism-2':
    case 'mechanism-3':
    case 'mechanism-4':
    case 'mechanism-5':
      return 'radial-gradient(ellipse at 50% 30%, rgba(15,14,12,1) 0%, #0A0A0A 70%)';
    default:
      return undefined;
  }
}
