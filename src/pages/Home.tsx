import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UploadedFile {
  id: string;
  file_name: string;
  file_path: string;
  bucket_id: string;
  url: string;
}

interface Testimonial {
  id: string;
  testimonial_name: string | null;
  testimonial_designation: string | null;
  url: string;
}

const journeySteps = [
  {
    label: 'STEP 01',
    time: 'Before we begin',
    name: 'Assess',
    whatWeDo:
      'Before a single instruction, we learn how your body actually works. How it handles fatigue, how it moves, what your days and your food really look like.',
    whatYouGet:
      'A plan built on your body, not pulled off a shelf. The reason this fits when nothing else did.',
  },
  {
    label: 'PHASE 01',
    time: 'Month 1',
    name: 'Simplify',
    whatWeDo:
      'We take fitness off your plate. A training plan and a way of eating built around your real life, plus a team in your corner so you stop guessing.',
    whatYouGet:
      'The noise stops. Belly fat starts moving, energy comes back, and the first results land fast.',
  },
  {
    label: 'PHASE 02',
    time: 'Months 2 to 4',
    name: 'Master',
    whatWeDo:
      'We go after the real reason it never stuck, the voice that talks you out of it on hard days. You learn to quiet it, while we dial in your sleep, recovery, stress, and lifestyle.',
    whatYouGet:
      'Fitness starts to feel effortless. The change in your body gets undeniable, and showing up stops taking willpower.',
  },
  {
    label: 'PHASE 03',
    time: 'Months 5 to 6',
    name: 'Own',
    whatWeDo:
      'We hand you the wheel. We pull back the support on purpose, so the habits run on their own and bend around any week life throws at you.',
    whatYouGet:
      'It is automatic. You do not need us anymore, and that is the point. You walk in needing the system. You walk out being it.',
  },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Home() {
  const [mainVideo, setMainVideo] = useState<UploadedFile | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [videoBuffering, setVideoBuffering] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [activeSteps, setActiveSteps] = useState<boolean[]>([false, false, false, false]);
  const [activeTestimonial, setActiveTestimonial] = useState<string | null>(null);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});
  const [tVideoLoading, setTVideoLoading] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const testimonialVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    const fetchMainVideo = async () => {
      const { data } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('bucket_id', 'main-videos')
        .maybeSingle();
      if (data) setMainVideo(data);
    };
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('uploaded_files')
        .select('id, testimonial_name, testimonial_designation, url')
        .eq('bucket_id', 'video-testimonials')
        .order('created_at', { ascending: false });
      if (data) setTestimonials(data);
    };
    fetchMainVideo();
    fetchTestimonials();
  }, []);

  // Intersection Observer for journey steps
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setActiveSteps([true, true, true, true]);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-step-index'));
            if (!isNaN(index)) {
              setActiveSteps((prev) => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }
          }
        });
      },
      { rootMargin: '-30% 0px -30% 0px' }
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handlePlay = async () => {
    if (!videoRef.current) return;
    setHasStarted(true);
    try {
      videoRef.current.muted = true;
      await videoRef.current.play();
      videoRef.current.muted = false;
    } catch {
      setVideoError(true);
      setHasStarted(false);
    }
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.muted = false;
    videoRef.current.play().catch(() => {});
    setVideoEnded(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isScrubbing) {
      const vid = videoRef.current;
      setCurrentTime(vid.currentTime);
      if (vid.duration) setProgress((vid.currentTime / vid.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    if (!thumbnail) video.currentTime = 0.1;
  };

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video || thumbnail || hasStarted) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      if (dataUrl && dataUrl !== 'data:,') setThumbnail(dataUrl);
    } catch {}
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = ratio * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(ratio * 100);
  };

  const playTestimonial = useCallback((id: string) => {
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
  }, [activeTestimonial]);

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = testimonialVideoRefs.current[id];
    if (!video) return;
    const newMuted = !video.muted;
    video.muted = newMuted;
    setMutedStates((prev) => ({ ...prev, [id]: newMuted }));
  };

  return (
    <div className="home-page">
      <div className="home-column">

        {/* === SECTION 1: HEADER === */}
        <section className="home-header">
          <span className="home-eyebrow">YOU'RE IN</span>
          <h1 className="home-headline">
            Your call is booked. Here's exactly what we do.
          </h1>
          <p className="home-subheader">
            Take five minutes with this before we talk. It will make our conversation far more valuable.
          </p>
        </section>

        {/* === SECTION 2: VIDEO === */}
        <section className="home-video-section">
          <div className="home-video-wrap">
            {!mainVideo && (
              <div className="home-video-loading">
                <svg className="w-7 h-7 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(201,168,76,0.2)" strokeWidth="2" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}

            {hasStarted && videoBuffering && (
              <div className="home-video-buffering">
                <svg className="w-7 h-7 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(201,168,76,0.2)" strokeWidth="2" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}

            {mainVideo && (
              <>
                <video
                  ref={videoRef}
                  src={mainVideo.url}
                  className="home-video-el"
                  playsInline
                  preload="metadata"
                  poster={thumbnail ?? undefined}
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  onLoadedMetadata={handleLoadedMetadata}
                  onSeeked={handleSeeked}
                  onCanPlay={() => setVideoBuffering(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onWaiting={() => setVideoBuffering(true)}
                  onPlaying={() => setVideoBuffering(false)}
                  onEnded={() => setVideoEnded(true)}
                  onError={() => setVideoError(true)}
                />

                {videoError && (
                  <div className="home-video-error">
                    <span>Video unavailable. Please try again later.</span>
                  </div>
                )}

                {!hasStarted && !videoError && (
                  <button onClick={handlePlay} className="home-video-play-overlay" aria-label="Play video">
                    <div className="home-video-play-circle">
                      <Play className="w-7 h-7 ml-0.5" style={{ color: '#C9A84C' }} fill="currentColor" />
                    </div>
                    <span className="home-video-tap-label">Tap to watch</span>
                  </button>
                )}

                {videoEnded && (
                  <div className="home-video-ended">
                    <button onClick={handleReplay} className="home-video-replay-btn" aria-label="Replay video">
                      <div className="home-video-replay-circle">
                        <RotateCcw className="w-5 h-5" style={{ color: '#C9A84C' }} />
                      </div>
                      <span className="home-video-tap-label">Replay</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {hasStarted && (
            <div className="home-progress-wrap">
              <div
                ref={progressBarRef}
                className="home-progress-bar group"
                onClick={seekTo}
                onMouseDown={() => setIsScrubbing(true)}
                onMouseMove={(e) => { if (isScrubbing) seekTo(e); }}
                onMouseUp={() => setIsScrubbing(false)}
                onMouseLeave={() => setIsScrubbing(false)}
                onTouchStart={() => setIsScrubbing(true)}
                onTouchMove={seekTo}
                onTouchEnd={() => setIsScrubbing(false)}
              >
                <div className="home-progress-fill" style={{ width: `${progress}%` }} />
                <div
                  className="home-progress-thumb opacity-0 group-hover:opacity-100"
                  style={{ left: `${progress}%` }}
                />
              </div>
              <div className="home-progress-times">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          <p className="home-video-caption">Watch this first.</p>
        </section>

        {/* === SECTION 3: THE JOURNEY === */}
        <section className="home-journey">
          <span className="home-eyebrow">THE PROGRAM</span>
          <h2 className="home-journey-heading">Six months. One clear path.</h2>
          <p className="home-journey-intro">
            We take down every barrier between you and your body, in order. First we understand you. Then we clear what is outside you, what is inside you, and finally your need for us at all.
          </p>

          <div className="home-roadmap">
            {journeySteps.map((step, i) => {
              const isActive = activeSteps[i];
              const segmentActive = i === 0 ? isActive : activeSteps[i];
              return (
                <div
                  key={i}
                  className="home-roadmap-step"
                  data-step-index={i}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  style={{
                    opacity: isActive ? 1 : 0.25,
                    transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                    transition: 'opacity 500ms ease-out, transform 500ms ease-out',
                  }}
                >
                  {/* Line segment */}
                  <div className="home-roadmap-rail">
                    {i > 0 && (
                      <div
                        className="home-roadmap-segment"
                        style={{ backgroundColor: segmentActive ? '#C9A84C' : 'rgba(201,168,76,0.15)' }}
                      />
                    )}
                    <div
                      className="home-roadmap-node"
                      style={{
                        borderColor: isActive ? '#C9A84C' : 'rgba(201,168,76,0.3)',
                        backgroundColor: isActive ? '#C9A84C' : 'transparent',
                        transform: isActive ? 'scale(1)' : 'scale(0.8)',
                        transition: 'all 500ms ease-out',
                      }}
                    />
                    {i < journeySteps.length - 1 && (
                      <div className="home-roadmap-segment-below" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="home-roadmap-content">
                    <div className="home-roadmap-label-row">
                      <span className="home-roadmap-label">{step.label}</span>
                      <span className="home-roadmap-time">{step.time}</span>
                    </div>
                    <h3 className="home-roadmap-name">{step.name}</h3>
                    <div className="home-roadmap-block">
                      <span className="home-roadmap-block-label">WHAT WE DO</span>
                      <p className="home-roadmap-block-text">{step.whatWeDo}</p>
                    </div>
                    <div className="home-roadmap-block">
                      <span className="home-roadmap-block-label home-roadmap-block-label--gold">WHAT YOU GET</span>
                      <p className="home-roadmap-block-text home-roadmap-block-text--bright">{step.whatYouGet}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* === SECTION 4: TESTIMONIALS INTRO === */}
        {testimonials.length > 0 && (
          <section className="home-proof">
            <span className="home-eyebrow">THE PROOF</span>
            <h2 className="home-proof-heading">
              Building a new generation of Indians. Weapons of intellect and physicality.
            </h2>
          </section>
        )}
      </div>

      {/* Carousel (breaks out of column for edge-to-edge scroll) */}
      {testimonials.length > 0 && (
        <div className="home-carousel">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="home-carousel-card"
              onClick={() => playTestimonial(t.id)}
            >
              <video
                ref={(el) => { testimonialVideoRefs.current[t.id] = el; }}
                src={t.url}
                className="home-carousel-video"
                playsInline
                muted
                loop
                preload="metadata"
                onWaiting={() => setTVideoLoading((prev) => ({ ...prev, [t.id]: true }))}
                onPlaying={() => setTVideoLoading((prev) => ({ ...prev, [t.id]: false }))}
              />

              {activeTestimonial !== t.id && (
                <div className="home-carousel-play-overlay">
                  <div className="home-carousel-play-circle">
                    <Play className="w-4 h-4 ml-0.5" style={{ color: '#C9A84C', fill: '#C9A84C' }} />
                  </div>
                </div>
              )}

              {tVideoLoading[t.id] && activeTestimonial === t.id && (
                <div className="home-carousel-loader">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'rgba(201,161,74,0.7)' }} />
                </div>
              )}

              {activeTestimonial === t.id && (
                <button onClick={(e) => toggleMute(t.id, e)} className="home-carousel-mute">
                  {mutedStates[t.id] === false ? (
                    <Volume2 className="w-3.5 h-3.5" style={{ color: '#F0EDE8' }} />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" style={{ color: '#F0EDE8' }} />
                  )}
                </button>
              )}

              <div className="home-carousel-caption">
                <p className="home-carousel-name">{t.testimonial_name || 'Client'}</p>
                {t.testimonial_designation && (
                  <p className="home-carousel-designation">{t.testimonial_designation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === SECTION 5: CLOSING === */}
      <div className="home-column">
        <section className="home-closing">
          <h2 className="home-closing-heading">See you on the call.</h2>
          <p className="home-closing-sub">
            Check your email for the confirmation, and add it to your calendar.
          </p>
        </section>
      </div>

      <style>{`
        .home-page {
          min-height: 100vh;
          min-height: 100svh;
          background-color: #0A0A0A;
        }
        .home-column {
          max-width: 480px;
          margin: 0 auto;
          padding-left: 20px;
          padding-right: 20px;
        }

        /* === HEADER === */
        .home-header {
          padding-top: 72px;
          padding-bottom: 48px;
          text-align: center;
        }
        .home-eyebrow {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: #C9A14A;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .home-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: 28px;
          line-height: 1.15;
          color: #F0EDE8;
          margin: 0 0 16px 0;
        }
        @media (min-width: 640px) {
          .home-headline { font-size: 34px; }
        }
        .home-subheader {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.6;
          color: #8A8680;
          margin: 0;
          max-width: 380px;
          margin-left: auto;
          margin-right: auto;
        }

        /* === VIDEO === */
        .home-video-section {
          padding-bottom: 80px;
        }
        .home-video-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 16px;
          overflow: hidden;
          background-color: #131316;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .home-video-el {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .home-video-loading,
        .home-video-buffering {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #131316;
          z-index: 5;
        }
        .home-video-buffering {
          background-color: rgba(0,0,0,0.4);
          pointer-events: none;
          z-index: 10;
        }
        .home-video-error {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(10,10,10,0.85);
        }
        .home-video-error span {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: rgba(201,168,76,0.6);
          text-align: center;
          padding: 0 24px;
        }
        .home-video-play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(10,10,10,0.4);
          border: none;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }
        .home-video-play-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(201,168,76,0.6);
          background-color: rgba(201,168,76,0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: transform 200ms ease;
        }
        .home-video-play-overlay:hover .home-video-play-circle {
          transform: scale(1.08);
        }
        .home-video-tap-label {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(201,168,76,0.7);
          margin-top: 14px;
        }
        .home-video-ended {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(10,10,10,0.75);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .home-video-replay-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          border: none;
          background: none;
          cursor: pointer;
          transition: transform 200ms ease;
        }
        .home-video-replay-btn:hover {
          transform: scale(1.05);
        }
        .home-video-replay-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(201,168,76,0.5);
          background-color: rgba(201,168,76,0.08);
        }
        .home-progress-wrap {
          margin-top: 10px;
          padding: 0 2px;
        }
        .home-progress-bar {
          position: relative;
          height: 4px;
          border-radius: 4px;
          background-color: rgba(255,255,255,0.08);
          cursor: pointer;
        }
        .home-progress-fill {
          height: 100%;
          border-radius: 4px;
          background-color: #C9A84C;
          transition: width 100ms linear;
        }
        .home-progress-thumb {
          position: absolute;
          top: 50%;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #C9A84C;
          box-shadow: 0 0 0 2px rgba(201,168,76,0.3);
          transform: translate(-50%, -50%);
          transition: opacity 200ms;
        }
        .home-progress-times {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
        }
        .home-progress-times span {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 11px;
          color: #5A5855;
        }
        .home-video-caption {
          text-align: center;
          margin-top: 16px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: #5A5855;
          letter-spacing: 0.04em;
        }

        /* === JOURNEY === */
        .home-journey {
          padding-bottom: 64px;
        }
        .home-journey-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: 24px;
          line-height: 1.2;
          color: #F0EDE8;
          margin: 0 0 12px 0;
        }
        .home-journey-intro {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.6;
          color: #8A8680;
          margin: 0 0 48px 0;
        }

        /* Roadmap */
        .home-roadmap {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .home-roadmap-step {
          display: flex;
          gap: 20px;
          position: relative;
          padding-bottom: 56px;
        }
        .home-roadmap-step:last-child {
          padding-bottom: 0;
        }
        .home-roadmap-rail {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 14px;
          flex-shrink: 0;
          position: relative;
        }
        .home-roadmap-segment {
          width: 1.5px;
          flex: 1;
          min-height: 24px;
          background-color: rgba(201,168,76,0.15);
          transition: background-color 500ms ease-out;
          margin-bottom: 6px;
        }
        .home-roadmap-segment-below {
          width: 1.5px;
          flex: 1;
          background-color: rgba(201,168,76,0.15);
          margin-top: 6px;
        }
        .home-roadmap-node {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(201,168,76,0.3);
          flex-shrink: 0;
        }
        .home-roadmap-content {
          flex: 1;
          padding-top: 0;
        }
        .home-roadmap-label-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 6px;
        }
        .home-roadmap-label {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: #C9A14A;
          text-transform: uppercase;
        }
        .home-roadmap-time {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 12px;
          color: #5A5855;
        }
        .home-roadmap-name {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: 22px;
          color: #C9A14A;
          margin: 0 0 20px 0;
          line-height: 1.2;
        }
        .home-roadmap-block {
          margin-bottom: 16px;
        }
        .home-roadmap-block:last-child {
          margin-bottom: 0;
        }
        .home-roadmap-block-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #5A5855;
          margin-bottom: 6px;
        }
        .home-roadmap-block-label--gold {
          color: #C9A14A;
        }
        .home-roadmap-block-text {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.6;
          color: #C8C4BE;
          margin: 0;
        }
        .home-roadmap-block-text--bright {
          color: #F0EDE8;
          font-weight: 400;
        }

        /* === PROOF / TESTIMONIALS === */
        .home-proof {
          padding-top: 16px;
          padding-bottom: 20px;
        }
        .home-proof-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: 22px;
          line-height: 1.3;
          color: #F0EDE8;
          margin: 0;
        }

        /* Carousel */
        .home-carousel {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 0 20px 24px;
          scrollbar-width: none;
        }
        .home-carousel::-webkit-scrollbar { display: none; }
        .home-carousel-card {
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
        .home-carousel-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          background-color: #131316;
        }
        .home-carousel-play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.25);
        }
        .home-carousel-play-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(201,161,74,0.12);
          border: 1px solid rgba(201,161,74,0.4);
        }
        .home-carousel-loader {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
        }
        .home-carousel-mute {
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
        .home-carousel-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 36px 14px 14px;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
          pointer-events: none;
        }
        .home-carousel-name {
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #FFFFFF;
          margin: 0;
        }
        .home-carousel-designation {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: #8A8680;
          margin: 3px 0 0 0;
        }

        /* === CLOSING === */
        .home-closing {
          padding-top: 64px;
          padding-bottom: 80px;
          padding-bottom: calc(80px + env(safe-area-inset-bottom));
          text-align: center;
        }
        .home-closing-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: 22px;
          line-height: 1.3;
          color: #F0EDE8;
          margin: 0 0 10px 0;
        }
        .home-closing-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 14px;
          line-height: 1.5;
          color: #5A5855;
          margin: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .home-roadmap-step {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .home-roadmap-node {
            border-color: #C9A84C !important;
            background-color: #C9A84C !important;
            transform: none !important;
            transition: none !important;
          }
          .home-roadmap-segment {
            background-color: #C9A84C !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
