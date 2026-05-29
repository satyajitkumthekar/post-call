import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronDown, Volume2, VolumeX, Play, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ensureCalendlyScript, openCalendlyPopup, buildCalendlyUrl } from '../lib/calendly';

interface StoryPanelRow {
  id: string;
  image_url: string;
  sequence_order: number;
}

interface Testimonial {
  id: string;
  testimonial_name: string | null;
  testimonial_designation: string | null;
  url: string;
}

export default function Schedule() {
  const [vslUrl, setVslUrl] = useState<string | null>(null);
  const [storyPanels, setStoryPanels] = useState<StoryPanelRow[]>([]);
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
    const fetchStoryPanels = async () => {
      const { data } = await supabase
        .from('story_panels')
        .select('id, image_url, sequence_order')
        .order('sequence_order', { ascending: true });
      if (data) setStoryPanels(data);
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
    fetchStoryPanels();
    fetchTestimonials();
  }, []);

  // Preload all story panel images as soon as URLs are available
  useEffect(() => {
    storyPanels.forEach((panel) => {
      const img = new Image();
      img.src = panel.image_url;
    });
  }, [storyPanels]);

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
      { root: container, threshold: 0.15 }
    );

    const panels = container.querySelectorAll('.schedule-panel');
    panels.forEach((panel) => observer.observe(panel));

    return () => observer.disconnect();
  }, [storyPanels.length, testimonials.length]);

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

    const frameId = requestAnimationFrame(() => {
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
    container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
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

  const hasTestimonials = testimonials.length > 0;

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
      {showSkipBtn && hasTestimonials && (
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

        {/* Story Panels - vertical images from database */}
        {storyPanels.map((panel) => (
          <section
            key={panel.id}
            className="schedule-panel relative flex items-center justify-center"
            style={{
              minHeight: '100svh',
              height: '100svh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              backgroundColor: '#0A0A0A',
              overflow: 'hidden',
            }}
          >
            <img
              src={panel.image_url}
              alt=""
              className="w-full h-full object-contain"
            />
          </section>
        ))}

        {/* Transition Panel - only show if there are testimonials */}
        {hasTestimonials && (
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
            </div>
          </section>
        )}

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
          transform: translateY(12px);
        }

        .schedule-panel.panel-visible .panel-line {
          animation: fadeRiseIn 280ms ease-out forwards;
        }

        @keyframes fadeRiseIn {
          from {
            opacity: 0;
            transform: translateY(12px);
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
