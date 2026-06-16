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

interface BodyLine {
  gold: string;
  white: string;
}

interface JourneyStep {
  label: string;
  time: string;
  name: string;
  painQuote: string | null;
  intro: string | null;
  lines: BodyLine[] | null;
  body: string | null;
  endState: string | null;
}

const journeySteps: JourneyStep[] = [
  {
    label: 'ASSESS',
    time: 'before we begin',
    name: 'Assess',
    painQuote: null,
    intro: null,
    lines: null,
    body: "Before anything else, we get to know your body. How it handles a hard day, how it moves, how much you're really moving, what you actually eat on a normal day. Everything we build comes from that. A plan made for your body, not pulled off a shelf. It's why this works when nothing else has.",
    endState: null,
  },
  {
    label: 'PHASE 01',
    time: 'month 1',
    name: 'Simplify',
    painQuote:
      "There's too much noise. I'm never sure I'm on the right path, or which of the hundred things I could be doing is the right one. I can't hold myself accountable on my own, my training falls apart the second life gets in the way, and every plan I've tried felt like a restrictive diet I couldn't keep up.",
    intro: "So the first thing we do is take all of it off your plate.",
    lines: [
      { gold: "One clear plan.", white: "You stop wondering if you're doing the right thing." },
      { gold: "We make the calls.", white: "You stop weighing a hundred options and just follow the path." },
      { gold: "A real team in your corner.", white: "You're held to it, so it's not all on you anymore." },
      { gold: "Training that bends.", white: "A work trip or a hard week can't break it." },
      { gold: "Eating you don't fight.", white: "Built around your real life, not a strict diet you force." },
    ],
    body: null,
    endState:
      "The noise goes quiet, and you start moving fast. The belly fat starts coming off, you get stronger, your energy comes back, and seeing it work is what makes you want to keep going.",
  },
  {
    label: 'PHASE 02',
    time: 'months 2 to 4',
    name: 'Master',
    painQuote:
      "I know exactly what to do. I just don't do it on the hard days. It would be going well, then one bad day would turn into a bad week, and I couldn't even explain why. And every time I slipped, I'd feel guilty, and the guilt made the next day worse.",
    intro: "That was never about willpower.",
    lines: [
      { gold: "We expose the voice.", white: "You learn to catch it the moment it shows up, and step back instead of obeying it." },
      { gold: "A bad day stays a bad day.", white: "One slip stops turning into a lost week." },
      { gold: "We fix what's underneath.", white: "Your sleep, your stress, your recovery, how much you move in a day." },
    ],
    body: null,
    endState:
      "This is when it clicks. Showing up stops taking willpower. The change in your body gets big enough that people stop you to ask what you're doing. And your head feels clearer than it has in years.",
  },
  {
    label: 'PHASE 03',
    time: 'months 5 to 6',
    name: 'Own',
    painQuote:
      "I've been consistent before. I know I can do it. That's what's so frustrating about being here again. Every program worked right up until it stopped, and the second the support was gone, so was I. I don't want to need a coach for the rest of my life.",
    intro: "That's the right fear, and it's the one nobody else solves.",
    lines: [
      { gold: "We hand you the wheel.", white: "Slowly, on purpose, the opposite of what most coaches do." },
      { gold: "We pull back the support.", white: "The check-ins and tracking ease off as you take over." },
      { gold: "The habits run on their own.", white: "You keep them going through any week, without us." },
    ],
    body: null,
    endState:
      "You don't need us anymore. That is the whole point. You walked in needing the system. You walk out being it.",
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
      { rootMargin: '-35% 0px -35% 0px' }
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
    <div className="hp">
      <div className="hp-col">

        {/* === 1. HEADER === */}
        <section className="hp-header">
          <span className="hp-eyebrow">YOU'RE IN</span>
          <h1 className="hp-headline">
            Your call is booked. Here's exactly what we do.
          </h1>
          <p className="hp-sub">
            Take five minutes with this before we talk. It will make our conversation far more valuable.
          </p>
        </section>

        {/* === 2. VIDEO === */}
        <section className="hp-video-section">
          <div className="hp-video-wrap">
            {!mainVideo && (
              <div className="hp-video-loading">
                <svg className="w-7 h-7 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(201,168,76,0.2)" strokeWidth="2" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}

            {hasStarted && videoBuffering && (
              <div className="hp-video-buffering">
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
                  className="hp-video-el"
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
                  <div className="hp-video-error">
                    <span>Video unavailable. Please try again later.</span>
                  </div>
                )}

                {!hasStarted && !videoError && (
                  <button onClick={handlePlay} className="hp-video-play-overlay" aria-label="Play video">
                    <div className="hp-video-play-circle">
                      <Play className="w-7 h-7 ml-0.5" style={{ color: '#C9A84C' }} fill="currentColor" />
                    </div>
                    <span className="hp-tap-label">Tap to watch</span>
                  </button>
                )}

                {videoEnded && (
                  <div className="hp-video-ended">
                    <button onClick={handleReplay} className="hp-video-replay-btn" aria-label="Replay video">
                      <div className="hp-video-replay-circle">
                        <RotateCcw className="w-5 h-5" style={{ color: '#C9A84C' }} />
                      </div>
                      <span className="hp-tap-label">Replay</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {hasStarted && (
            <div className="hp-progress-wrap">
              <div
                ref={progressBarRef}
                className="hp-progress-bar group"
                onClick={seekTo}
                onMouseDown={() => setIsScrubbing(true)}
                onMouseMove={(e) => { if (isScrubbing) seekTo(e); }}
                onMouseUp={() => setIsScrubbing(false)}
                onMouseLeave={() => setIsScrubbing(false)}
                onTouchStart={() => setIsScrubbing(true)}
                onTouchMove={seekTo}
                onTouchEnd={() => setIsScrubbing(false)}
              >
                <div className="hp-progress-fill" style={{ width: `${progress}%` }} />
                <div
                  className="hp-progress-thumb opacity-0 group-hover:opacity-100"
                  style={{ left: `${progress}%` }}
                />
              </div>
              <div className="hp-progress-times">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          <p className="hp-video-caption">Watch this first.</p>
        </section>

        {/* === 3. THE JOURNEY === */}
        <section className="hp-journey">
          <span className="hp-eyebrow">THE PROGRAM</span>
          <h2 className="hp-journey-heading">Six months. One clear path.</h2>
          <p className="hp-journey-hook">
            It was never that you didn't care. You care a lot. That's almost the problem.
          </p>

          <div className="hp-roadmap">
            {journeySteps.map((step, i) => {
              const isActive = activeSteps[i];
              return (
                <div
                  key={i}
                  className="hp-step"
                  data-step-index={i}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  style={{
                    opacity: isActive ? 1 : 0.2,
                    transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                    transition: 'opacity 500ms ease-out, transform 500ms ease-out',
                  }}
                >
                  <div className="hp-rail">
                    {i > 0 && (
                      <div
                        className="hp-segment"
                        style={{
                          backgroundColor: isActive ? '#C9A84C' : 'rgba(201,168,76,0.12)',
                          transition: 'background-color 500ms ease-out',
                        }}
                      />
                    )}
                    <div
                      className="hp-node"
                      style={{
                        borderColor: isActive ? '#C9A84C' : 'rgba(201,168,76,0.25)',
                        backgroundColor: isActive ? '#C9A84C' : 'transparent',
                        transform: isActive ? 'scale(1)' : 'scale(0.8)',
                        transition: 'all 500ms ease-out',
                      }}
                    />
                    {i < journeySteps.length - 1 && (
                      <div className="hp-tail" />
                    )}
                  </div>

                  <div className="hp-step-content">
                    <span className="hp-step-label">
                      {step.label} <span className="hp-step-time">&middot; {step.time}</span>
                    </span>
                    <h3 className="hp-step-name">{step.name}</h3>
                    {step.painQuote && (
                      <p className="hp-pain">"{step.painQuote}"</p>
                    )}
                    {step.intro && (
                      <p className="hp-intro">{step.intro}</p>
                    )}
                    {step.lines && (
                      <div className="hp-lines">
                        {step.lines.map((line, li) => (
                          <p key={li} className="hp-line">
                            <span className="hp-line-gold">{line.gold}</span>{' '}
                            <span className="hp-line-white">{line.white}</span>
                          </p>
                        ))}
                      </div>
                    )}
                    {step.body && (
                      <p className="hp-body">{step.body}</p>
                    )}
                    {step.endState && (
                      <div className="hp-end-state">
                        <span className="hp-end-dot" />
                        <p className="hp-end-text">{step.endState}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* === 4. TESTIMONIALS INTRO === */}
        {testimonials.length > 0 && (
          <section className="hp-proof">
            <span className="hp-eyebrow">THE PROOF</span>
            <h2 className="hp-proof-heading">
              Building a new generation of Indians. Weapons of intellect and physicality.
            </h2>
          </section>
        )}
      </div>

      {/* Carousel (edge-to-edge scroll) */}
      {testimonials.length > 0 && (
        <div className="hp-carousel">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="hp-card"
              onClick={() => playTestimonial(t.id)}
            >
              <div className="hp-card-media">
                <video
                  ref={(el) => { testimonialVideoRefs.current[t.id] = el; }}
                  src={t.url}
                  className="hp-card-video"
                  playsInline
                  muted
                  loop
                  preload="metadata"
                  onWaiting={() => setTVideoLoading((prev) => ({ ...prev, [t.id]: true }))}
                  onPlaying={() => setTVideoLoading((prev) => ({ ...prev, [t.id]: false }))}
                />

                {activeTestimonial !== t.id && (
                  <div className="hp-card-overlay">
                    <div className="hp-card-play">
                      <Play className="w-5 h-5 ml-0.5" style={{ color: '#C9A84C', fill: '#C9A84C' }} />
                    </div>
                  </div>
                )}

                {tVideoLoading[t.id] && activeTestimonial === t.id && (
                  <div className="hp-card-loader">
                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'rgba(201,168,76,0.7)' }} />
                  </div>
                )}

                {activeTestimonial === t.id && (
                  <button onClick={(e) => toggleMute(t.id, e)} className="hp-card-mute">
                    {mutedStates[t.id] === false ? (
                      <Volume2 className="w-3.5 h-3.5" style={{ color: '#F0EDE8' }} />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" style={{ color: '#F0EDE8' }} />
                    )}
                  </button>
                )}
              </div>

              <div className="hp-card-info">
                <p className="hp-card-name">{t.testimonial_name || 'Client'}</p>
                {t.testimonial_designation && (
                  <p className="hp-card-role">{t.testimonial_designation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === 5. CLOSING === */}
      <div className="hp-col">
        <section className="hp-closing">
          <h2 className="hp-closing-heading">See you on the call.</h2>
          <p className="hp-closing-sub">
            Check your email for the confirmation, and add it to your calendar.
          </p>
        </section>
      </div>

      <style>{`
        .hp {
          min-height: 100vh;
          min-height: 100svh;
          background-color: #0A0A0A;
        }
        .hp-col {
          max-width: 480px;
          margin: 0 auto;
          padding-left: 20px;
          padding-right: 20px;
        }

        /* Eyebrow */
        .hp-eyebrow {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: #C9A84C;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        /* === 1. HEADER === */
        .hp-header {
          padding-top: 72px;
          padding-bottom: 56px;
          text-align: center;
        }
        .hp-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: 28px;
          line-height: 1.15;
          color: #F0EDE8;
          margin: 0 0 16px 0;
        }
        @media (min-width: 640px) {
          .hp-headline { font-size: 34px; }
        }
        .hp-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.6;
          color: #8A8680;
          margin: 0 auto;
          max-width: 360px;
        }

        /* === 2. VIDEO === */
        .hp-video-section { padding-bottom: 80px; }
        .hp-video-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 16px;
          overflow: hidden;
          background-color: #131316;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .hp-video-el {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hp-video-loading,
        .hp-video-buffering {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #131316;
          z-index: 5;
        }
        .hp-video-buffering {
          background-color: rgba(0,0,0,0.4);
          pointer-events: none;
          z-index: 10;
        }
        .hp-video-error {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(10,10,10,0.85);
        }
        .hp-video-error span {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: rgba(201,168,76,0.6);
          text-align: center;
          padding: 0 24px;
        }
        .hp-video-play-overlay {
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
        .hp-video-play-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(201,168,76,0.6);
          background-color: rgba(201,168,76,0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: transform 200ms ease;
        }
        .hp-video-play-overlay:hover .hp-video-play-circle {
          transform: scale(1.08);
        }
        .hp-tap-label {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(201,168,76,0.7);
          margin-top: 14px;
        }
        .hp-video-ended {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(10,10,10,0.75);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .hp-video-replay-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          border: none;
          background: none;
          cursor: pointer;
          transition: transform 200ms ease;
        }
        .hp-video-replay-btn:hover { transform: scale(1.05); }
        .hp-video-replay-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(201,168,76,0.5);
          background-color: rgba(201,168,76,0.08);
        }
        .hp-progress-wrap { margin-top: 10px; padding: 0 2px; }
        .hp-progress-bar {
          position: relative;
          height: 4px;
          border-radius: 4px;
          background-color: rgba(255,255,255,0.08);
          cursor: pointer;
        }
        .hp-progress-fill {
          height: 100%;
          border-radius: 4px;
          background-color: #C9A84C;
          transition: width 100ms linear;
        }
        .hp-progress-thumb {
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
        .hp-progress-times {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
        }
        .hp-progress-times span {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 11px;
          color: #5A5855;
        }
        .hp-video-caption {
          text-align: center;
          margin-top: 16px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: #5A5855;
          letter-spacing: 0.03em;
        }

        /* === 3. JOURNEY === */
        .hp-journey { padding-bottom: 72px; }
        .hp-journey-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: 24px;
          line-height: 1.2;
          color: #F0EDE8;
          margin: 0 0 20px 0;
        }
        .hp-journey-hook {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-style: italic;
          font-size: 17px;
          line-height: 1.5;
          color: #B0ACA6;
          margin: 0 0 56px 0;
        }

        /* Roadmap */
        .hp-roadmap {
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .hp-step {
          display: flex;
          gap: 20px;
          position: relative;
          padding-bottom: 64px;
        }
        .hp-step:last-child { padding-bottom: 0; }
        .hp-rail {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 14px;
          flex-shrink: 0;
        }
        .hp-segment {
          width: 1.5px;
          flex: 1;
          min-height: 20px;
          margin-bottom: 6px;
        }
        .hp-tail {
          width: 1.5px;
          flex: 1;
          background-color: rgba(201,168,76,0.12);
          margin-top: 6px;
        }
        .hp-node {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(201,168,76,0.25);
          flex-shrink: 0;
        }
        .hp-step-content {
          flex: 1;
          min-width: 0;
        }
        .hp-step-label {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: #C9A84C;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }
        .hp-step-time {
          font-weight: 300;
          color: #5A5855;
          letter-spacing: 0.06em;
        }
        .hp-step-name {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: 22px;
          color: #C9A84C;
          margin: 0 0 12px 0;
          line-height: 1.2;
        }
        .hp-pain {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-style: italic;
          font-size: 15px;
          line-height: 1.45;
          color: #A8A4A0;
          margin: 0 0 14px 0;
          padding-left: 14px;
          border-left: 2px solid rgba(201,168,76,0.35);
        }
        .hp-intro {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.5;
          color: #D8D4CE;
          margin: 0 0 14px 0;
        }
        .hp-lines {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 0;
        }
        .hp-line {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.5;
          color: #D8D4CE;
          margin: 0;
        }
        .hp-line-gold {
          font-weight: 500;
          color: #C9A84C;
        }
        .hp-line-white {
          color: #D8D4CE;
        }
        .hp-body {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.5;
          color: #D8D4CE;
          margin: 0;
        }
        .hp-end-state {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(201,168,76,0.2);
        }
        .hp-end-dot {
          flex-shrink: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #C9A84C;
          margin-top: 5px;
        }
        .hp-end-text {
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 14px;
          line-height: 1.5;
          color: #C9A84C;
          margin: 0;
        }

        /* === 4. PROOF === */
        .hp-proof {
          padding-top: 16px;
          padding-bottom: 24px;
        }
        .hp-proof-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: 22px;
          line-height: 1.3;
          color: #F0EDE8;
          margin: 0;
        }

        /* Carousel */
        .hp-carousel {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 0 20px 32px;
          scrollbar-width: none;
        }
        .hp-carousel::-webkit-scrollbar { display: none; }
        .hp-card {
          flex-shrink: 0;
          width: 80vw;
          max-width: 340px;
          border-radius: 16px;
          overflow: hidden;
          background-color: #131316;
          border: 1px solid rgba(255,255,255,0.06);
          scroll-snap-align: start;
          cursor: pointer;
        }
        .hp-card-media {
          position: relative;
          width: 100%;
          background-color: #0A0A0A;
        }
        .hp-card-video {
          display: block;
          width: 100%;
          height: auto;
          background-color: #0A0A0A;
        }
        .hp-card-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.25);
        }
        .hp-card-play {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(201,168,76,0.1);
          border: 1.5px solid rgba(201,168,76,0.45);
        }
        .hp-card-loader {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
        }
        .hp-card-mute {
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
          background-color: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: none;
          cursor: pointer;
        }
        .hp-card-info { padding: 14px 16px 16px; }
        .hp-card-name {
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #FFFFFF;
          margin: 0;
        }
        .hp-card-role {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: #8A8680;
          margin: 3px 0 0 0;
        }

        /* === 5. CLOSING === */
        .hp-closing {
          padding-top: 64px;
          padding-bottom: 80px;
          padding-bottom: calc(80px + env(safe-area-inset-bottom));
          text-align: center;
        }
        .hp-closing-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: 22px;
          line-height: 1.3;
          color: #F0EDE8;
          margin: 0 0 10px 0;
        }
        .hp-closing-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 14px;
          line-height: 1.5;
          color: #5A5855;
          margin: 0;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .hp-step {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .hp-node {
            border-color: #C9A84C !important;
            background-color: #C9A84C !important;
            transform: none !important;
            transition: none !important;
          }
          .hp-segment,
          .hp-tail {
            background-color: #C9A84C !important;
          }
        }
      `}</style>
    </div>
  );
}
