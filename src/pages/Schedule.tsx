import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Volume2, VolumeX, Loader2 } from 'lucide-react';
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
            Watch this before your call. It explains exactly how we crack the Indian body and make fitness run on its own.
          </p>

          {vslUrl ? (
            <div className="schedule-video-wrap" onClick={handleVslPlay}>
              <video
                ref={vslVideoRef}
                src={vslUrl}
                className="schedule-video"
                playsInline
                preload="metadata"
                onPlay={() => setVslPlaying(true)}
                onPause={() => setVslPlaying(false)}
                onEnded={() => setVslPlaying(false)}
              />
              {!vslPlaying && (
                <div className="schedule-video-overlay">
                  <div className="schedule-play-btn">
                    <Play className="w-5 h-5 ml-0.5" style={{ color: '#C9A84C', fill: '#C9A84C' }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="schedule-video-placeholder" />
          )}
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
            <h2 className="schedule-testimonials-heading">
              Building a new generation of Indians.
            </h2>
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
              onClick={() => playTestimonial(t.id)}
            >
              <video
                ref={(el) => { testimonialVideoRefs.current[t.id] = el; }}
                src={t.url}
                className="schedule-card-video"
                playsInline
                muted
                loop
                preload="metadata"
                onWaiting={() => setVideoLoading((prev) => ({ ...prev, [t.id]: true }))}
                onPlaying={() => setVideoLoading((prev) => ({ ...prev, [t.id]: false }))}
              />

              {activeTestimonial !== t.id && (
                <div className="schedule-card-play-overlay">
                  <div className="schedule-card-play-circle">
                    <Play className="w-4 h-4 ml-0.5" style={{ color: '#C9A84C', fill: '#C9A84C' }} />
                  </div>
                </div>
              )}

              {videoLoading[t.id] && activeTestimonial === t.id && (
                <div className="schedule-card-loader">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'rgba(201,161,74,0.7)' }} />
                </div>
              )}

              {activeTestimonial === t.id && (
                <button
                  onClick={(e) => toggleMute(t.id, e)}
                  className="schedule-card-mute"
                >
                  {mutedStates[t.id] === false ? (
                    <Volume2 className="w-3.5 h-3.5" style={{ color: '#F0EDE8' }} />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" style={{ color: '#F0EDE8' }} />
                  )}
                </button>
              )}

              <div className="schedule-card-caption">
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
          object-fit: contain;
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
          color: #F0EDE8;
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
          width: 82vw;
          max-width: 340px;
          aspect-ratio: 4/5;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          background-color: #131316;
          border: 1px solid rgba(255,255,255,0.06);
          scroll-snap-align: start;
          cursor: pointer;
        }
        .schedule-card-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          background-color: #131316;
        }
        .schedule-card-play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.25);
        }
        .schedule-card-play-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(201,161,74,0.12);
          border: 1px solid rgba(201,161,74,0.4);
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
        .schedule-card-mute {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 20;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: none;
          cursor: pointer;
        }
        .schedule-card-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 36px 14px 14px;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
          pointer-events: none;
        }
        .schedule-card-name {
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #FFFFFF;
          margin: 0;
        }
        .schedule-card-designation {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: #8A8680;
          margin: 3px 0 0 0;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
