import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ensureCalendlyScript, openCalendlyPopup, buildCalendlyUrl } from '../lib/calendly';
import { trackPixel } from '../lib/pixel';

interface Testimonial {
  id: string;
  testimonial_name: string | null;
  testimonial_designation: string | null;
  thumbnail_url: string | null;
  url: string;
}

export default function Schedule() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [videoLoading, setVideoLoading] = useState<Record<string, boolean>>({});

  const testimonialVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

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
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('uploaded_files')
        .select('id, testimonial_name, testimonial_designation, thumbnail_url, url')
        .eq('bucket_id', 'video-testimonials')
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-id');
          if (!id) return;
          const video = testimonialVideoRefs.current[id];
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(id));
            if (video) {
              video.muted = true;
              video.play().catch(() => {});
            }
          } else {
            setVisibleCards((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
            if (video) {
              video.pause();
              video.currentTime = 0;
            }
          }
        });
      },
      { threshold: 0.6 }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) return;
    testimonials.forEach((t) => {
      const el = cardRefs.current[t.id];
      if (el) observer.observe(el);
    });
    return () => {
      testimonials.forEach((t) => {
        const el = cardRefs.current[t.id];
        if (el) observer.unobserve(el);
      });
    };
  }, [testimonials]);

  const vslPlayTracked = useRef(false);

  return (
    <div className="schedule-page">
      {/* Sticky bottom CTA */}
      <div className="schedule-sticky-cta">
        <button onClick={openBooking} className="schedule-cta-btn">
          Book Your Free Clarity Call
        </button>
      </div>

      {/* Centered column */}
      <div className="schedule-column">

        {/* SECTION 1 — VSL */}
        <section className="schedule-vsl">
          <h1 className="schedule-vsl-heading">
            The last piece, finally handled.
          </h1>
          <p className="schedule-vsl-sub">
            Before we talk, watch this.
          </p>

          <div className="schedule-video-wrap" onClick={() => {
            if (!vslPlayTracked.current) {
              vslPlayTracked.current = true;
              trackPixel('ViewContent', { content_name: 'VSL Video' });
            }
          }}>
            <iframe
              src="https://player.mediadelivery.net/embed/693813/15442e53-67bc-483c-bf3f-3a9abbb36038?autoplay=false&loop=true&muted=false&preload=true&responsive=true"
              loading="lazy"
              className="schedule-video"
              allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen"
              allowFullScreen
              style={{ border: 'none', position: 'absolute', top: 0, height: '100%', width: '100%' }}
            />
          </div>
        </section>

        {/* SECTION 2 — Clarity Call (compact) */}
        <section className="schedule-clarity">
          <span className="schedule-eyebrow">THE CLARITY CALL</span>
          <p className="schedule-clarity-body">
            A free call where we map exactly what it will take to crack your body. You leave with a clear next step, whether or not we end up working together.
          </p>
        </section>

        {/* SECTION 3 — Testimonials */}
        {testimonials.length > 0 && (
          <section className="schedule-testimonials">
            <span className="schedule-eyebrow">BUILDING A NEW GENERATION OF INDIANS</span>
            <p className="schedule-testimonials-sub">
              Weapons of intellect and physicality.
            </p>
          </section>
        )}
      </div>

      {/* Carousel breaks out of column for edge-to-edge scroll */}
      {testimonials.length > 0 && (
        <div className="schedule-carousel">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="schedule-card"
              data-id={t.id}
              ref={(el) => { cardRefs.current[t.id] = el; }}
            >
              <div className="schedule-card-video-area">
                <video
                  ref={(el) => { testimonialVideoRefs.current[t.id] = el; }}
                  src={t.url}
                  poster={t.thumbnail_url || undefined}
                  className="schedule-card-video"
                  playsInline
                  muted
                  loop
                  preload="metadata"
                  onWaiting={() => setVideoLoading((prev) => ({ ...prev, [t.id]: true }))}
                  onPlaying={() => setVideoLoading((prev) => ({ ...prev, [t.id]: false }))}
                />

                {videoLoading[t.id] && visibleCards.has(t.id) && (
                  <div className="schedule-card-loader">
                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'rgba(201,161,74,0.7)' }} />
                  </div>
                )}

                </div>

              <div className="schedule-card-info">
                <p className="schedule-card-name">
                  {t.testimonial_name || 'Client'}
                </p>
                {t.testimonial_designation && (
                  <p className="schedule-card-designation">
                    {t.testimonial_designation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .schedule-page {
          min-height: 100vh;
          min-height: 100svh;
          background-color: #070707;
          padding-bottom: 80px;
        }

        .schedule-column {
          max-width: 480px;
          margin: 0 auto;
          padding-left: 20px;
          padding-right: 20px;
        }

        /* ========== STICKY CTA ========== */
        .schedule-sticky-cta {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background-color: rgba(10,10,10,0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(201,161,74,0.25);
          padding: 10px 16px;
          padding-bottom: calc(10px + env(safe-area-inset-bottom));
        }
        .schedule-cta-btn {
          display: block;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          background-color: #C9A14A;
          color: #0A0A0A;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.02em;
          padding: 14px 20px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .schedule-cta-btn:active {
          transform: scale(0.97);
        }

        /* ========== SECTION 1 — VSL ========== */
        .schedule-vsl {
          padding-top: 32px;
          padding-bottom: 48px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .schedule-vsl-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: 27px;
          line-height: 1.1;
          color: #F0EDE8;
          margin: 0;
        }
        .schedule-vsl-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.5;
          color: #8A8680;
          margin: 0;
          max-width: 340px;
        }
        .schedule-video-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 12px;
          overflow: hidden;
          background-color: #131316;
          border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          margin-top: 6px;
        }
        .schedule-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .schedule-video-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.2);
        }
        .schedule-play-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(201,168,76,0.5);
          background-color: rgba(201,168,76,0.07);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .schedule-video-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 12px;
          background-color: #131316;
          animation: pulse 2s infinite;
          margin-top: 6px;
        }

        /* ========== SHARED EYEBROW ========== */
        .schedule-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: #C9A14A;
          text-transform: uppercase;
          display: block;
          margin-bottom: 10px;
        }

        /* ========== SECTION 2 — CLARITY (compact) ========== */
        .schedule-clarity {
          padding-bottom: 0;
          text-align: left;
        }
        .schedule-clarity-body {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.5;
          color: #8A8680;
          margin: 0;
        }

        /* ========== SECTION 3 — TESTIMONIALS ========== */
        .schedule-testimonials {
          padding-top: 40px;
          padding-bottom: 16px;
          text-align: left;
        }
        .schedule-testimonials-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: 20px;
          line-height: 1.3;
          color: #C9A14A;
          margin: 0;
        }
        .schedule-testimonials-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.5;
          color: #8A8680;
          margin: 6px 0 0 0;
        }

        /* ========== CAROUSEL ========== */
        .schedule-carousel {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 0 20px 16px;
          scrollbar-width: none;
        }
        .schedule-carousel::-webkit-scrollbar {
          display: none;
        }
        .schedule-card {
          flex-shrink: 0;
          width: 72vw;
          max-width: 300px;
          border-radius: 20px;
          overflow: hidden;
          background-color: #131316;
          border: 1px solid rgba(255,255,255,0.06);
          scroll-snap-align: start;
        }
        .schedule-card-video-area {
          position: relative;
          aspect-ratio: 9/16;
          overflow: hidden;
          background-color: #0A0A0B;
        }
        .schedule-card-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background-color: #131316;
        }
        .schedule-card-loader {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
        }
        .schedule-card-info {
          padding: 14px 16px;
        }
        .schedule-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 1.1rem;
          color: #F0EDE8;
          margin: 0;
        }
        .schedule-card-designation {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.78rem;
          color: #8A8680;
          margin: 2px 0 0 0;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
