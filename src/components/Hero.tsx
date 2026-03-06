import { Volume2, VolumeX } from 'lucide-react';
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

export default function Hero() {
  const [mainVideo, setMainVideo] = useState<UploadedFile | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
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

      {/* Video — full width, first */}
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
            {!mainVideo || !videoLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p style={{ color: '#5A5855', fontSize: '0.9375rem', fontFamily: "'DM Sans', sans-serif" }}>
                  Loading video...
                </p>
              </div>
            ) : null}

            {mainVideo && (
              <>
                <video
                  ref={videoRef}
                  id="main-video"
                  src={mainVideo.url}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  autoPlay
                  muted
                  loop
                  preload="auto"
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  onLoadedMetadata={() => setVideoLoaded(true)}
                />

                {videoLoaded && (
                  <button
                    onClick={handleToggleMute}
                    className="absolute bottom-3 right-3 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.55)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(6px)',
                    }}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted
                      ? <VolumeX className="w-4 h-4" style={{ color: '#C9A84C' }} />
                      : <Volume2 className="w-4 h-4" style={{ color: '#C9A84C' }} />
                    }
                  </button>
                )}
              </>
            )}
          </div>

          <p
            className="text-center mt-2"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '0.72rem',
              color: '#5A5855',
              letterSpacing: '0.04em',
            }}
          >
            tap for sound
          </p>
        </div>
      </div>

      {/* Expect items — below video */}
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
