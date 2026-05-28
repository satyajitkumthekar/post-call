import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, PauseCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  testimonial_name: string | null;
  testimonial_designation: string | null;
  url: string;
}

function VideoCard({
  testimonial,
  shouldLoad,
  isPlaying,
  onPlay,
  onPause,
  onEnded,
}: {
  testimonial: Testimonial;
  shouldLoad: boolean;
  isPlaying: boolean;
  onPlay: (id: string, el: HTMLVideoElement) => void;
  onPause: (id: string) => void;
  onEnded: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || thumbnail) return;
    video.currentTime = 0.1;
  };

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video || thumbnail) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 360;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      if (dataUrl && dataUrl !== 'data:,') setThumbnail(dataUrl);
    } catch { /* cross-origin */ }
  };

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
          {shouldLoad ? (
            <video
              ref={videoRef}
              src={testimonial.url}
              className="w-full h-full object-contain"
              preload="metadata"
              playsInline
              poster={thumbnail ?? undefined}
              onLoadedMetadata={handleLoadedMetadata}
              onSeeked={handleSeeked}
              onEnded={() => onEnded(testimonial.id)}
              onPause={() => onPause(testimonial.id)}
            />
          ) : (
            <div className="w-full h-full animate-pulse" style={{ backgroundColor: '#1a1a1f' }} />
          )}

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
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const playingVideoRef = useRef<HTMLVideoElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const markLoaded = useCallback((videoId: string) => {
    setLoadedVideos((prev) => {
      if (prev.has(videoId)) return prev;
      const next = new Set(prev);
      next.add(videoId);
      return next;
    });
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const videoId = entry.target.getAttribute('data-video-id');
            if (videoId) {
              markLoaded(videoId);
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      { rootMargin: '300px' }
    );
    return () => { observerRef.current?.disconnect(); };
  }, [markLoaded]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('uploaded_files')
        .select('id, testimonial_name, testimonial_designation, url')
        .eq('bucket_id', 'video-testimonials')
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setTestimonials(data);
      setIsLoading(false);
    };
    fetchTestimonials();
  }, []);

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
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl animate-pulse"
            style={{ backgroundColor: '#131316', height: '480px' }}
          />
        ))}
      </div>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <div className="space-y-6">
      {testimonials.map((testimonial, index) => {
        const shouldLoad = loadedVideos.has(testimonial.id) || index < 2;
        return (
          <div
            key={testimonial.id}
            ref={(el) => {
              if (el && !shouldLoad) {
                el.setAttribute('data-video-id', testimonial.id);
                observerRef.current?.observe(el);
              }
            }}
          >
            <VideoCard
              testimonial={testimonial}
              shouldLoad={shouldLoad}
              isPlaying={playingVideo === testimonial.id}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
            />
          </div>
        );
      })}
    </div>
  );
}
