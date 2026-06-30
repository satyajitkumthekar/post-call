import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, PauseCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  testimonial_name: string | null;
  testimonial_designation: string | null;
  thumbnail_url: string | null;
  url: string;
}

function VideoCard({
  testimonial,
  isPlaying,
  onPlay,
  onPause,
  onEnded,
  onVideoMount,
}: {
  testimonial: Testimonial;
  isPlaying: boolean;
  onPlay: (id: string, el: HTMLVideoElement) => void;
  onPause: (id: string) => void;
  onEnded: (id: string) => void;
  onVideoMount: (el: HTMLVideoElement | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      return;
    }
    try {
      await video.play();
      onPlay(testimonial.id, video);
    } catch { /* blocked */ }
  };

  return (
    <div className="w-full">
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          backgroundColor: '#131316',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="aspect-[9/16] relative overflow-hidden cursor-pointer"
          style={{ backgroundColor: '#0A0A0A' }}
          onClick={handleClick}
        >
          <video
            ref={(el) => { (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el; onVideoMount(el); }}
            src={testimonial.url}
            className="w-full h-full object-cover"
            preload="metadata"
            playsInline
            poster={testimonial.thumbnail_url || undefined}
            onEnded={() => onEnded(testimonial.id)}
            onPause={() => onPause(testimonial.id)}
          />

          {!isPlaying && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    border: '1.5px solid rgba(201,168,76,0.5)',
                    backgroundColor: 'rgba(201,168,76,0.07)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <Play className="w-6 h-6 ml-0.5" style={{ color: '#C9A84C', fill: '#C9A84C' }} />
                </div>
              </div>
            </>
          )}
          {isPlaying && (
            <div className="absolute top-3 right-3 opacity-60">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              >
                <PauseCircle className="w-5 h-5" style={{ color: '#C9A84C' }} />
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4">
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: '1.05rem',
              color: '#F0EDE8',
              marginBottom: '2px',
            }}
          >
            {testimonial.testimonial_name || 'Client'}
          </h3>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '0.78rem',
              color: '#8A8680',
            }}
          >
            {testimonial.testimonial_designation || ''}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BookVideoTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const playingVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoElsRef = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('uploaded_files')
        .select('id, testimonial_name, testimonial_designation, thumbnail_url, url')
        .eq('bucket_id', 'video-testimonials')
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) {
        setTestimonials(data);
        videoElsRef.current = new Array(data.length).fill(null);
      }
      setIsLoading(false);
    };
    fetchTestimonials();
  }, []);

  const pauseCurrentVideo = useCallback(() => {
    if (playingVideoRef.current) {
      playingVideoRef.current.pause();
      playingVideoRef.current = null;
    }
    setPlayingVideo(null);
  }, []);

  // Track active index via scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let timeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const cardWidth = el.scrollWidth / testimonials.length;
        const newIndex = Math.round(el.scrollLeft / cardWidth);
        if (newIndex !== activeIndex) {
          pauseCurrentVideo();
          setActiveIndex(newIndex);
        }
      }, 80);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [testimonials.length, activeIndex, pauseCurrentVideo]);

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    pauseCurrentVideo();
    const cardWidth = el.scrollWidth / testimonials.length;
    el.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    setActiveIndex(index);
  };

  const handlePlay = useCallback((id: string, el: HTMLVideoElement) => {
    if (playingVideoRef.current && playingVideoRef.current !== el) {
      playingVideoRef.current.pause();
    }
    playingVideoRef.current = el;
    setPlayingVideo(id);
  }, []);

  const handlePause = useCallback((id: string) => {
    setPlayingVideo((prev) => (prev === id ? null : prev));
  }, []);

  const handleEnded = useCallback((id: string) => {
    setPlayingVideo((prev) => (prev === id ? null : prev));
  }, []);

  if (isLoading) {
    return (
      <div className="relative overflow-hidden" style={{ margin: '0 -20px' }}>
        <div className="flex gap-4 px-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl animate-pulse flex-shrink-0"
              style={{
                width: '75%',
                backgroundColor: '#131316',
                aspectRatio: '9/16',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <div>
      {/* Carousel track */}
      <div
        ref={scrollRef}
        className="bvt-scroll flex overflow-x-auto"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          gap: '16px',
          paddingLeft: 'calc(12.5% - 8px)',
          paddingRight: 'calc(12.5% - 8px)',
        }}
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            style={{
              flex: '0 0 75%',
              scrollSnapAlign: 'center',
            }}
          >
            <VideoCard
              testimonial={testimonial}
              isPlaying={playingVideo === testimonial.id}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onVideoMount={(el) => { videoElsRef.current[index] = el; }}
            />
          </div>
        ))}
      </div>

      <style>{`.bvt-scroll::-webkit-scrollbar { display: none; }`}</style>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            style={{
              width: i === activeIndex ? '20px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: i === activeIndex ? '#C9A84C' : 'rgba(255,255,255,0.18)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'width 0.25s ease, background-color 0.25s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
