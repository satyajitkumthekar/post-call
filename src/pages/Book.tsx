import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BookVideoTestimonials from '../components/BookVideoTestimonials';
import BookMessagesCarousel from '../components/BookMessagesCarousel';

const mirrorPairs = [
  {
    before: "You know exactly what to eat, what to train, what to fix. You just don't have the bandwidth left to actually do it.",
    after: "We do all the thinking for you. The plan, the food, the adjustments. You just show up.",
  },
  {
    before: "You start, it goes well, then one bad week happens and the whole thing falls apart.",
    after: "You stop doing this alone. A dedicated team in your corner, 24/7. We catch the slip before it becomes a fall.",
  },
  {
    before: "Every diet feels like a cage. The moment you slip, you spiral.",
    after: "No diet. You learn how to anchor your day around one meal, and the rest stays free. You keep eating the food you love.",
  },
  {
    before: "You finally find your rhythm, and a trip or a brutal week wipes it out. You're back to zero.",
    after: "The plan bends with your life. Travel, deadlines, weddings, we reshape around it. You never start over.",
  },
  {
    before: 'There\'s a voice in your head every time. "You\'ve had a long day. You deserve this. Start Monday." You listen to it every time.',
    after: "We give you the tools to catch that voice, and beat it. Until fitness isn't willpower anymore. It's just who you are.",
  },
];

const expectItems = [
  {
    title: 'Your current reality',
    description: "We'll talk about your fitness, your energy, your confidence, and what your actual days look like right now.",
  },
  {
    title: 'Your goals, honestly',
    description: "Not what you think you should want. What actually matters to you. The body you actually want. The life you actually want to be living.",
  },
  {
    title: "What's been in the way",
    description: "A clear look at the real patterns holding you back. Not motivation, not discipline. The actual structural blockers.",
  },
  {
    title: 'A direction forward',
    description: "A clear picture of how a program built for your life would work, and exactly what it would take to finally fix this.",
  },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Book() {
  const [vslUrl, setVslUrl] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [videoBuffering, setVideoBuffering] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVslUrl = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'vsl_video_url')
        .maybeSingle();
      if (data && data.value) setVslUrl(data.value);
    };
    fetchVslUrl();
  }, []);

  const openBookingModal = useCallback(() => {
    setScrollPosition(window.scrollY);
    setShowBookingModal(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeBookingModal = useCallback(() => {
    setShowBookingModal(false);
    document.body.style.overflow = '';
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
  }, [scrollPosition]);

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
      if (vid.duration) {
        setProgress((vid.currentTime / vid.duration) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    if (!thumbnail) {
      video.currentTime = 0.1;
    }
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
    } catch { /* cross-origin */ }
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Sticky Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14 md:h-[72px] flex items-center px-5 md:px-10"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(10, 10, 10, 0.9)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex flex-col leading-tight">
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: '1rem',
                letterSpacing: '0.18em',
                lineHeight: 1.1,
              }}
            >
              <span style={{ color: '#F0EDE8' }}>SUPERHUMAN</span>
              <span style={{ color: '#C9A84C' }}> LAB</span>
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: '0.55rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                lineHeight: 1,
                marginTop: '3px',
              }}
            >
              Application Accepted
            </span>
          </div>

          <button
            onClick={openBookingModal}
            className="hidden md:block px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: '#C9A84C',
              color: '#0A0A0A',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: '0.8rem',
              letterSpacing: '0.03em',
            }}
          >
            Book Your Call
          </button>
        </div>
      </header>

      {/* Section 1: Hero */}
      <section className="pt-20 md:pt-28 pb-12 px-5 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="fade-up fade-up-1 mb-5">
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#C9A84C',
              }}
            >
              For Invited Applicants Only
            </span>
          </div>

          <h1
            className="fade-up fade-up-2 mb-5"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(1.9rem, 5vw, 2.75rem)',
              color: '#F0EDE8',
              lineHeight: 1.15,
            }}
          >
            The last piece of the puzzle,{' '}
            <em style={{ fontWeight: 400 }}>finally handled.</em>
          </h1>

          <p
            className="fade-up fade-up-3 max-w-lg mx-auto mb-8"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '1rem',
              color: '#8A8680',
              lineHeight: 1.7,
            }}
          >
            You've made it through. Spend the next few minutes with this video
            before our call. It'll make our conversation a lot more useful.
          </p>
        </div>

        {/* VSL Video */}
        <div className="max-w-4xl mx-auto">
          <div className="fade-up fade-up-4">
            <div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{
                backgroundColor: '#0D0D0F',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
                aspectRatio: '16/9',
              }}
            >
              {!vslUrl && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#131316' }}>
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(201,168,76,0.2)" strokeWidth="2" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              )}

              {hasStarted && videoBuffering && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                  <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(201,168,76,0.2)" strokeWidth="2" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              {vslUrl && (
                <>
                  <video
                    ref={videoRef}
                    src={vslUrl}
                    className="absolute inset-0 w-full h-full object-cover"
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(10,10,10,0.85)' }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 300,
                        fontSize: '0.8rem',
                        letterSpacing: '0.08em',
                        color: 'rgba(201,168,76,0.6)',
                        textAlign: 'center',
                        padding: '0 1.5rem',
                      }}>
                        Video unavailable. Please try again later.
                      </span>
                    </div>
                  )}

                  {!hasStarted && !videoError && (
                    <button
                      onClick={handlePlay}
                      className="absolute inset-0 flex flex-col items-center justify-center w-full h-full group"
                      style={{ backgroundColor: 'rgba(10,10,10,0.45)' }}
                      aria-label="Play video"
                    >
                      <div
                        className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: 'rgba(201,168,76,0.15)',
                          border: '2px solid rgba(201,168,76,0.6)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <Play
                          className="w-8 h-8 md:w-10 md:h-10"
                          style={{ color: '#C9A84C', marginLeft: '3px' }}
                          fill="currentColor"
                        />
                      </div>
                      <span
                        className="mt-4"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 300,
                          fontSize: '0.72rem',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: 'rgba(201,168,76,0.7)',
                        }}
                      >
                        Tap to watch
                      </span>
                    </button>
                  )}

                  {videoEnded && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center"
                      style={{ backgroundColor: 'rgba(10,10,10,0.75)', backdropFilter: 'blur(4px)' }}
                    >
                      <button
                        onClick={handleReplay}
                        className="group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105"
                        aria-label="Replay video"
                      >
                        <div
                          className="flex items-center justify-center w-14 h-14 rounded-full"
                          style={{
                            border: '1.5px solid rgba(201,168,76,0.5)',
                            backgroundColor: 'rgba(201,168,76,0.08)',
                          }}
                        >
                          <RotateCcw className="w-5 h-5 transition-transform duration-500 group-hover:-rotate-180" style={{ color: '#C9A84C' }} />
                        </div>
                        <span style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 300,
                          fontSize: '0.68rem',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: 'rgba(201,168,76,0.7)',
                        }}>
                          Replay
                        </span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {hasStarted && (
              <div className="mt-2.5 px-1">
                <div
                  ref={progressBarRef}
                  className="relative h-1 rounded-full cursor-pointer group"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                  onClick={seekTo}
                  onMouseDown={() => setIsScrubbing(true)}
                  onMouseMove={(e) => { if (isScrubbing) seekTo(e); }}
                  onMouseUp={() => setIsScrubbing(false)}
                  onMouseLeave={() => setIsScrubbing(false)}
                  onTouchStart={() => setIsScrubbing(true)}
                  onTouchMove={seekTo}
                  onTouchEnd={() => setIsScrubbing(false)}
                >
                  <div
                    className="h-full rounded-full transition-all duration-100"
                    style={{ width: `${progress}%`, backgroundColor: '#C9A84C' }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      left: `${progress}%`,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: '#C9A84C',
                      boxShadow: '0 0 0 2px rgba(201,168,76,0.3)',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: '0.68rem',
                    color: '#5A5855',
                  }}>
                    {formatTime(currentTime)}
                  </span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: '0.68rem',
                    color: '#5A5855',
                  }}>
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA below video */}
          <button
            onClick={openBookingModal}
            className="w-full mt-8 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              height: '56px',
              backgroundColor: '#C9A84C',
              color: '#0A0A0A',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: '1rem',
              letterSpacing: '0.02em',
            }}
          >
            Book Your Diagnostic Call
          </button>
          <p
            className="text-center mt-3"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '0.8rem',
              color: '#5A5855',
            }}
          >
            30 minutes. No pitch. Clarity either way.
          </p>
        </div>
      </section>

      {/* Section 2: The Mirror */}
      <section className="py-16 md:py-24 px-5 md:px-6" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="mb-2"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 'clamp(1.7rem, 4vw, 2.5rem)',
                color: '#F0EDE8',
                lineHeight: 1.15,
              }}
            >
              You already know what to do.
            </h2>
            <p
              className="mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                color: '#5A5855',
              }}
            >
              That was never the problem.
            </p>
            <p
              className="max-w-lg mx-auto"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: '1rem',
                color: '#8A8680',
                lineHeight: 1.7,
              }}
            >
              Everyone who lands here has been doing the work of trying. Here's
              what's actually been happening, and what changes when you work with
              us.
            </p>
          </div>

          <div className="space-y-5">
            {mirrorPairs.map((pair, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: '#111114',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Before half */}
                <div className="px-6 pt-6 pb-5">
                  <span
                    className="block mb-3"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 300,
                      fontStyle: 'italic',
                      fontSize: '0.85rem',
                      color: '#5A5855',
                    }}
                  >
                    What's been happening
                  </span>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      fontSize: '1rem',
                      color: '#8A8680',
                      lineHeight: 1.7,
                    }}
                  >
                    {pair.before}
                  </p>
                </div>

                {/* Divider */}
                <div className="mx-6 h-px" style={{ backgroundColor: 'rgba(201,168,76,0.15)' }} />

                {/* After half */}
                <div className="px-6 pt-5 pb-6">
                  <span
                    className="block mb-3"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 400,
                      fontStyle: 'italic',
                      fontSize: '0.85rem',
                      color: '#C9A84C',
                    }}
                  >
                    What changes
                  </span>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      fontSize: '1rem',
                      color: '#F0EDE8',
                      lineHeight: 1.7,
                    }}
                  >
                    {pair.after}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Proof */}
      <section className="py-16 md:py-24 px-5 md:px-6" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-center mb-12"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              color: '#F0EDE8',
              lineHeight: 1.15,
            }}
          >
            Here's what some of our clients have to say
          </h2>

          <BookVideoTestimonials />

          <div className="my-14 h-px" style={{ backgroundColor: 'rgba(201,168,76,0.12)' }} />

          <h2
            className="text-center mb-10"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              color: '#F0EDE8',
              lineHeight: 1.15,
            }}
          >
            Real messages. Real clients.
          </h2>

          <BookMessagesCarousel />

          {/* Mid-page CTA */}
          <button
            onClick={openBookingModal}
            className="w-full mt-14 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              height: '56px',
              backgroundColor: 'transparent',
              border: '1.5px solid #C9A84C',
              color: '#C9A84C',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: '1rem',
              letterSpacing: '0.02em',
            }}
          >
            Book Your Diagnostic Call
          </button>
        </div>
      </section>

      {/* Section 4: What to Expect */}
      <section className="py-16 md:py-24 px-5 md:px-6" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-center mb-10"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              color: '#F0EDE8',
              lineHeight: 1.15,
            }}
          >
            What to expect on the call
          </h2>

          <div className="space-y-4">
            {expectItems.map((item, i) => (
              <div
                key={i}
                className="flex gap-5 p-6 rounded-xl"
                style={{
                  backgroundColor: '#111114',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    border: '1px solid rgba(201,168,76,0.4)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.95rem',
                    fontWeight: 400,
                    color: '#C9A84C',
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <h3
                    className="mb-1.5"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: '1rem',
                      color: '#F0EDE8',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      fontSize: '1rem',
                      color: '#8A8680',
                      lineHeight: 1.7,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p
            className="text-center mt-8"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '0.9rem',
              color: '#5A5855',
              lineHeight: 1.7,
            }}
          >
            This is a diagnostic call, not a sales call. By the end, you'll know
            exactly what it would take to fix this, whether you work with us or
            not.
          </p>
        </div>
      </section>

      {/* Section 5: Final CTA */}
      <section className="py-20 md:py-28 px-5 md:px-6" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="mb-5"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
              color: '#F0EDE8',
              lineHeight: 1.2,
            }}
          >
            If everything in the video sounded like your life, let's get the
            last piece handled.
          </h2>
          <p
            className="mb-8"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '1rem',
              color: '#5A5855',
              lineHeight: 1.7,
            }}
          >
            30 minutes. No pitch. You'll walk away with clarity, either way.
          </p>
          <button
            onClick={openBookingModal}
            className="w-full max-w-md mx-auto block rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              height: '56px',
              backgroundColor: '#C9A84C',
              color: '#0A0A0A',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: '1rem',
              letterSpacing: '0.02em',
            }}
          >
            Book Your Diagnostic Call
          </button>
          <p
            className="mt-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '0.78rem',
              color: '#5A5855',
            }}
          >
            We take on a small number of new clients each week.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-5 py-10"
        style={{
          backgroundColor: '#0A0A0A',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: '0.95rem',
              letterSpacing: '0.15em',
            }}
          >
            <span style={{ color: '#F0EDE8' }}>SUPERHUMAN</span>
            <span style={{ color: '#C9A84C' }}> LAB</span>
          </span>
          <p
            className="mt-3"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '0.78rem',
              color: '#5A5855',
            }}
          >
            &copy; Superhuman Lab
          </p>
        </div>
      </footer>

      {/* Sticky Bottom CTA Bar - mobile only */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-center justify-between px-5"
        style={{
          height: '64px',
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          borderTop: '1px solid rgba(201,168,76,0.3)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: '0.85rem',
            color: '#8A8680',
          }}
        >
          Ready when you are.
        </span>
        <button
          onClick={openBookingModal}
          className="h-10 px-5 rounded-full transition-all duration-200 active:scale-95"
          style={{
            backgroundColor: '#C9A84C',
            color: '#0A0A0A',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: '0.82rem',
            letterSpacing: '0.02em',
          }}
        >
          Book Your Call
        </button>
      </div>

      {/* Bottom padding spacer for mobile sticky bar */}
      <div className="h-16 md:hidden" style={{ backgroundColor: '#0A0A0A' }} />

      {/* Booking Modal */}
      {showBookingModal && (
        <div
          className="fixed inset-0 z-[100] flex flex-col"
          style={{ backgroundColor: '#0A0A0A' }}
        >
          <div
            className="flex items-center justify-between px-5 h-14 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: '0.85rem',
                color: '#F0EDE8',
              }}
            >
              Book Your Diagnostic Call
            </span>
            <button
              onClick={closeBookingModal}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
              aria-label="Close booking"
            >
              <X className="w-5 h-5" style={{ color: '#F0EDE8' }} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: '1rem',
                  color: '#8A8680',
                  lineHeight: 1.7,
                }}
              >
                Booking widget will appear here.
                <br />
                Configure your Cal.com or Calendly embed URL.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
