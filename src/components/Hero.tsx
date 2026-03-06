import { Play } from 'lucide-react';
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
    title: 'Your goals — honestly',
    description: 'Not what you think you should want. What actually matters to you right now.',
  },
  {
    title: "What's been in the way",
    description: 'Clarity on the real patterns — not motivation, not discipline — the actual structural blockers.',
  },
  {
    title: 'A direction forward',
    description: "A clear picture of how a program built for your life would actually work — and what that looks like.",
  },
];

export default function Hero() {
  const [mainVideo, setMainVideo] = useState<UploadedFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const videoElement = document.querySelector('#main-video') as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play().catch(err => console.error('Play failed:', err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen pt-[72px]"
      style={{ backgroundColor: '#0A0A0B' }}
    >
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="fade-up fade-up-1 flex items-center justify-center gap-4 mb-8">
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
          className="fade-up fade-up-2 mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(2.6rem, 6vw, 4.25rem)',
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
            fontSize: '1.05rem',
            color: '#8A8680',
            lineHeight: '1.75',
          }}
        >
          A confirmation email is on its way. Before we speak — spend 10 minutes with this page. It'll make our conversation significantly more valuable.
        </p>

        <div
          className="fade-up fade-up-4 inline-flex items-center gap-2.5 mt-8 px-5 py-2.5 rounded-full"
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

      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
          <div className="reveal">
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
              style={{
                backgroundColor: '#0D0D0F',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              }}
              onClick={handlePlayClick}
            >
              {!mainVideo || !videoLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p style={{ color: '#5A5855', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }}>
                    Loading video...
                  </p>
                </div>
              ) : null}

              {mainVideo && (
                <>
                  <video
                    id="main-video"
                    src={mainVideo.url}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    preload="metadata"
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onLoadedMetadata={(e) => {
                      setVideoLoaded(true);
                      const video = e.target as HTMLVideoElement;
                      video.currentTime = 0.1;
                    }}
                  />

                  {!isPlaying && videoLoaded && (
                    <>
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                          style={{
                            border: '1.5px solid rgba(201,168,76,0.6)',
                            backgroundColor: 'rgba(201,168,76,0.08)',
                            backdropFilter: 'blur(8px)',
                          }}
                        >
                          <Play className="w-8 h-8 ml-0.5" style={{ color: '#C9A84C', fill: '#C9A84C' }} />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: '0.15s' }}>
            <h2
              className="mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                color: '#F0EDE8',
              }}
            >
              What to expect on the call
            </h2>

            <div className="space-y-4">
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
                        fontSize: '0.9rem',
                        color: '#F0EDE8',
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 300,
                        fontSize: '0.84rem',
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
      </div>
    </section>
  );
}
