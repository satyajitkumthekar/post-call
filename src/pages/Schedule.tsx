import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Volume2, VolumeX, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ensureCalendlyScript, openCalendlyPopup, buildCalendlyUrl } from '../lib/calendly';

interface Testimonial {
  id: string;
  testimonial_name: string | null;
  testimonial_designation: string | null;
  url: string;
}

export default function Schedule() {
  const [vslUrl, setVslUrl] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [vslPlaying, setVslPlaying] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState<string | null>(null);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});
  const [videoLoading, setVideoLoading] = useState<Record<string, boolean>>({});

  const vslVideoRef = useRef<HTMLVideoElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const testimonialVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

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

  const handleVslPlay = async () => {
    const video = vslVideoRef.current;
    if (!video) return;
    if (vslPlaying) {
      video.pause();
    } else {
      try { await video.play(); } catch {}
    }
  };

  const playTestimonial = (id: string) => {
    if (activeTestimonial && activeTestimonial !== id) {
      const prev = testimonialVideoRefs.current[activeTestimonial];
      if (prev) { prev.pause(); prev.currentTime = 0; }
    }
    const video = testimonialVideoRefs.current[id];
    if (!video) return;
    if (activeTestimonial === id) {
      video.pause();
      setActiveTestimonial(null);
    } else {
      video.muted = true;
      setMutedStates((prev) => ({ ...prev, [id]: true }));
      video.play().catch(() => {});
      setActiveTestimonial(id);
    }
  };

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = testimonialVideoRefs.current[id];
    if (!video) return;
    const newMuted = !video.muted;
    video.muted = newMuted;
    setMutedStates((prev) => ({ ...prev, [id]: newMuted }));
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#070707' }}>
      {/* Sticky CTA */}
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
            fontWeight: 600,
            fontSize: '0.9rem',
            letterSpacing: '0.03em',
            padding: '14px 24px',
            borderRadius: '10px',
          }}
        >
          Book Your Free Clarity Call
        </button>
      </div>

      {/* SECTION 1 — VSL */}
      <section
        className="relative flex flex-col items-center justify-center px-6"
        style={{ minHeight: '100svh', paddingTop: '64px', paddingBottom: '96px' }}
      >
        <div className="w-full max-w-2xl flex flex-col items-center gap-8">
          <div className="text-center flex flex-col gap-3">
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                color: '#F0EDE8',
                lineHeight: 1.2,
              }}
            >
              The last piece, finally handled.
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                color: '#8A8680',
                lineHeight: 1.6,
                maxWidth: '520px',
                margin: '0 auto',
              }}
            >
              Watch this before your call. It explains exactly how we crack the Indian body and make fitness run on its own.
            </p>
          </div>

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
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                    style={{
                      border: '1.5px solid rgba(201,168,76,0.5)',
                      backgroundColor: 'rgba(201,168,76,0.07)',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    <Play className="w-6 h-6 ml-0.5" style={{ color: '#C9A84C', fill: '#C9A84C' }} />
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
        </div>
      </section>

      {/* SECTION 2 — What You Get On The Call */}
      <section className="px-6 py-24 flex justify-center">
        <div className="w-full max-w-xl flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: '0.75rem',
                color: '#C9A14A',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              The Clarity Call
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                color: '#F0EDE8',
                lineHeight: 1.25,
              }}
            >
              A working session, not a sales pitch.
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                color: '#8A8680',
                lineHeight: 1.7,
              }}
            >
              This is a working session. We get to the bottom of why your body hasn't changed, map exactly what it will take to crack it, and you leave with a clear picture of your next step — whether or not we end up working together.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {[
              'We diagnose what\u2019s actually been stopping your progress.',
              'We map the exact path to take the stubborn fat off and put real muscle on.',
              'You leave with total clarity on your next move — working with us or not.',
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-4">
                <span
                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5"
                  style={{ backgroundColor: '#C9A14A' }}
                />
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    color: '#D4D0CC',
                    lineHeight: 1.65,
                  }}
                >
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Testimonials Carousel */}
      {testimonials.length > 0 && (
        <section className="py-24 pb-40">
          <div className="px-6 max-w-2xl mx-auto mb-10">
            <h2
              className="text-center"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                fontSize: 'clamp(1.3rem, 4vw, 1.85rem)',
                color: '#F0EDE8',
                lineHeight: 1.3,
              }}
            >
              Building a new generation of Indians. Weapons of intellect and physicality.
            </h2>
          </div>

          {/* Carousel navigation */}
          <div className="relative">
            <button
              onClick={() => scrollCarousel('left')}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full transition-opacity hover:opacity-100"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(8px)',
                opacity: 0.7,
              }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" style={{ color: '#F0EDE8' }} />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full transition-opacity hover:opacity-100"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(8px)',
                opacity: 0.7,
              }}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" style={{ color: '#F0EDE8' }} />
            </button>

            {/* Scrollable row */}
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory"
              style={{
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex-shrink-0 snap-start relative rounded-xl overflow-hidden cursor-pointer group"
                  style={{
                    width: 'clamp(260px, 70vw, 300px)',
                    aspectRatio: '9/16',
                    backgroundColor: '#131316',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onClick={() => playTestimonial(t.id)}
                >
                  <video
                    ref={(el) => { testimonialVideoRefs.current[t.id] = el; }}
                    src={t.url}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                    loop
                    preload="metadata"
                    onWaiting={() => setVideoLoading((prev) => ({ ...prev, [t.id]: true }))}
                    onPlaying={() => setVideoLoading((prev) => ({ ...prev, [t.id]: false }))}
                  />

                  {/* Play overlay when not active */}
                  {activeTestimonial !== t.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: 'rgba(201,161,74,0.15)',
                          border: '1px solid rgba(201,161,74,0.4)',
                        }}
                      >
                        <Play className="w-5 h-5 ml-0.5" style={{ color: '#C9A84C', fill: '#C9A84C' }} />
                      </div>
                    </div>
                  )}

                  {/* Loading */}
                  {videoLoading[t.id] && activeTestimonial === t.id && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgba(201,161,74,0.7)' }} />
                    </div>
                  )}

                  {/* Mute toggle */}
                  {activeTestimonial === t.id && (
                    <button
                      onClick={(e) => toggleMute(t.id, e)}
                      className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {mutedStates[t.id] === false ? (
                        <Volume2 className="w-4 h-4" style={{ color: '#F0EDE8' }} />
                      ) : (
                        <VolumeX className="w-4 h-4" style={{ color: '#F0EDE8' }} />
                      )}
                    </button>
                  )}

                  {/* Bottom gradient + name */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4 pt-12 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        color: '#F0EDE8',
                      }}
                    >
                      {t.testimonial_name || 'Client'}
                    </p>
                    {t.testimonial_designation && (
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 300,
                          fontSize: '0.75rem',
                          color: '#8A8680',
                          marginTop: '2px',
                        }}
                      >
                        {t.testimonial_designation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Static CTA below testimonials */}
          <div className="flex justify-center px-6 mt-12">
            <button
              onClick={openBooking}
              className="w-full transition-transform active:scale-[0.97]"
              style={{
                maxWidth: '480px',
                backgroundColor: '#C9A14A',
                color: '#0A0A0A',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: '0.95rem',
                letterSpacing: '0.03em',
                padding: '16px 32px',
                borderRadius: '10px',
              }}
            >
              Book Your Free Clarity Call
            </button>
          </div>
        </section>
      )}

      {/* Hide carousel scrollbar */}
      <style>{`
        .snap-x::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
