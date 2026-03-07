import { Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

interface UploadedFile {
  id: string;
  file_name: string;
  file_path: string;
  bucket_id: string;
  url: string;
}

const expectItems = [
  {
    title: 'Your current reality',
    description: "We'll discuss your fitness levels, energy, confidence, and what your days actually look like.",
  },
  {
    title: 'Your goals, honestly',
    description: 'Not what you think you should want. What actually matters to you right now.',
  },
  {
    title: "What's been in the way",
    description: 'Clarity on the real patterns. Not motivation, not discipline. The actual structural blockers.',
  },
  {
    title: 'A direction forward',
    description: "A clear picture of how a program built for your life would actually work and what that looks like.",
  },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Hero() {
  const [mainVideo, setMainVideo] = useState<UploadedFile | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [videoBuffering, setVideoBuffering] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMainVideo = async () => {
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('bucket_id', 'main-videos')
        .maybeSingle();

      if (data && !error) {
        setMainVideo(data);
      }
    };

    fetchMainVideo();
  }, []);

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
    if (sectionRef.current) observer.observe(sectionRef.current);
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
    } catch {
    }
  };

  const handleCanPlay = () => {
    setVideoBuffering(false);
    if (videoRef.current) {
      if (videoRef.current.duration) setDuration(videoRef.current.duration);
    }
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
    <section
      ref={sectionRef}
      className="relative pt-[72px]"
      style={{ backgroundColor: '#0A0A0B' }}
    >
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-8 text-center">
        <div className="fade-up fade-up-1 flex items-center justify-center gap-4 mb-5">
          <div className="h-px w-12 flex-shrink-0" style={{ backgroundColor: 'rgba(201,168,76,0.4)' }} />
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: '0.65rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase' as const,
            color: '#C9A84C',
          }}>
            You're In
          </span>
          <div className="h-px w-12 flex-shrink-0" style={{ backgroundColor: 'rgba(201,168,76,0.4)' }} />
        </div>

        <h1
          className="fade-up fade-up-2 mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(1.8rem, 4vw, 2.25rem)',
            color: '#F0EDE8',
            lineHeight: 1.1,
          }}
        >
          The call is booked.
          <br />
          <em>Now let's make it count.</em>
        </h1>

        <p
          className="fade-up fade-up-3 max-w-xl mx-auto"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: '0.9375rem',
            color: '#8A8680',
            lineHeight: '1.75',
          }}
        >
          A confirmation email is on its way. Before we speak, spend 10 minutes with this page. It'll make our conversation significantly more valuable.
        </p>

        <div
          className="fade-up fade-up-4 inline-flex items-center gap-2.5 mt-5 px-5 py-2.5 rounded-full"
          style={{
            border: '1px solid rgba(74, 222, 128, 0.25)',
            backgroundColor: 'rgba(74, 222, 128, 0.05)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: '#4ade80' }} />
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            color: '#4ade80',
          }}>
            Call Confirmed
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px" style={{ backgroundColor: 'rgba(201,168,76,0.07)' }} />
      </div>

      {/* Video */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-4">
        <div className="reveal">
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{
              backgroundColor: '#0D0D0F',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              aspectRatio: '16/9',
            }}
          >
            {/* Loading state - no video URL yet */}
            {!mainVideo && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#131316' }}>
                <div className="flex flex-col items-center gap-3">
                  <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(201,168,76,0.2)" strokeWidth="2" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: '0.72rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(201,168,76,0.5)',
                  }}>
                    Loading...
                  </span>
                </div>
              </div>
            )}

            {/* Buffering overlay while playing */}
            {hasStarted && videoBuffering && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none">
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
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  preload="metadata"
                  poster={thumbnail ?? undefined}
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  onLoadedMetadata={handleLoadedMetadata}
                  onSeeked={handleSeeked}
                  onCanPlay={handleCanPlay}
                  onTimeUpdate={handleTimeUpdate}
                  onWaiting={() => setVideoBuffering(true)}
                  onPlaying={() => setVideoBuffering(false)}
                  onEnded={() => setVideoEnded(true)}
                  onError={() => setVideoError(true)}
                />

                {/* Error state */}
                {videoError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(10,10,11,0.85)' }}>
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

                {/* Play button overlay - shown until user taps play */}
                {!hasStarted && !videoError && (
                  <button
                    onClick={handlePlay}
                    className="absolute inset-0 flex flex-col items-center justify-center w-full h-full group"
                    style={{ backgroundColor: 'rgba(10,10,11,0.45)' }}
                    aria-label="Play video"
                  >
                    <div
                      className="flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: 'rgba(201,168,76,0.15)',
                        border: '2px solid rgba(201,168,76,0.6)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Play
                        className="w-8 h-8"
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

                {/* Ended overlay */}
                {videoEnded && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ backgroundColor: 'rgba(10,10,11,0.75)', backdropFilter: 'blur(4px)' }}
                  >
                    <button
                      onClick={handleReplay}
                      className="group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105"
                      aria-label="Replay video"
                    >
                      <div
                        className="flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300"
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

          {/* Progress bar + controls - shown once video has started */}
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
                  letterSpacing: '0.03em',
                }}>
                  {formatTime(currentTime)}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.68rem',
                  color: '#5A5855',
                  letterSpacing: '0.03em',
                }}>
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expect items */}
      <div className="max-w-4xl mx-auto px-6 pb-10 pt-4">
        <div className="reveal" style={{ transitionDelay: '0.1s' }}>
          <h2
            className="mb-6 text-center"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(1.4rem, 3vw, 2.25rem)',
              color: '#F0EDE8',
            }}
          >
            What to expect on the call
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {expectItems.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: '#131316',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                  style={{
                    border: '1px solid rgba(201,168,76,0.35)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.85rem',
                    color: '#C9A84C',
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <div
                    className="mb-1"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: '0.9375rem',
                      color: '#F0EDE8',
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      fontSize: '0.9375rem',
                      color: '#8A8680',
                      lineHeight: '1.65',
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
