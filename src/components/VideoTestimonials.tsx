import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, PauseCircle, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  testimonial_name: string | null;
  testimonial_designation: string | null;
  url: string;
  file_name: string;
}

const PAGE_SIZE = 6;

function VideoCardSkeleton() {
  return (
    <div className="w-full max-w-sm">
      <div
        className="relative overflow-hidden animate-pulse"
        style={{
          backgroundColor: '#131316',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="aspect-[9/16]" style={{ backgroundColor: '#1a1a1f' }} />
        <div className="px-5 py-4">
          <div className="h-4 rounded mb-2" style={{ backgroundColor: '#1e1e24', width: '60%' }} />
          <div className="h-3 rounded" style={{ backgroundColor: '#1a1a1f', width: '40%' }} />
        </div>
      </div>
    </div>
  );
}

export default function VideoTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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

    return () => {
      observerRef.current?.disconnect();
    };
  }, [markLoaded]);

  const observeCard = useCallback((el: HTMLDivElement | null, id: string) => {
    if (!el) return;
    cardRefs.current.set(id, el);
    el.setAttribute('data-video-id', id);
    if (observerRef.current) {
      observerRef.current.observe(el);
    }
  }, []);

  const fetchTestimonials = async (offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('id, testimonial_name, testimonial_designation, url, file_name')
        .eq('bucket_id', 'video-testimonials')
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;

      const results = data || [];
      setHasMore(results.length === PAGE_SIZE);
      return results;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  };

  useEffect(() => {
    const init = async () => {
      const results = await fetchTestimonials(0);
      setTestimonials(results);
      setIsLoading(false);
    };
    init();
  }, []);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const results = await fetchTestimonials(testimonials.length);
    setTestimonials((prev) => [...prev, ...results]);
    setIsLoadingMore(false);
  };

  const handleVideoClick = (testimonialId: string) => {
    const videoElement = document.querySelector(`#video-${testimonialId}`) as HTMLVideoElement;
    if (videoElement) {
      if (playingVideo === testimonialId) {
        videoElement.pause();
        setPlayingVideo(null);
      } else {
        if (playingVideo) {
          const currentPlaying = document.querySelector(`#video-${playingVideo}`) as HTMLVideoElement;
          if (currentPlaying) {
            currentPlaying.pause();
          }
        }
        videoElement.play();
        setPlayingVideo(testimonialId);
      }
    }
  };

  if (isLoading) {
    return (
      <section className="relative py-16 md:py-20 px-6" style={{ backgroundColor: '#0A0A0B' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="h-8 rounded mx-auto animate-pulse"
              style={{ backgroundColor: '#131316', width: '40%', maxWidth: '360px' }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {[...Array(3)].map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 md:py-20 px-6" style={{ backgroundColor: '#0A0A0B' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: '#F0EDE8',
              lineHeight: 1.15,
            }}
          >
            Here's what some of our clients have to say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {testimonials.map((testimonial, index) => {
            const isPlaying = playingVideo === testimonial.id;
            const shouldLoad = loadedVideos.has(testimonial.id) || index < 3;
            return (
              <div
                key={testimonial.id}
                className="group relative w-full max-w-sm"
                ref={(el) => {
                  if (el && !shouldLoad) {
                    observeCard(el, testimonial.id);
                  }
                }}
              >
                <div
                  className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: '#131316',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(201,168,76,0.3)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  <div
                    className="aspect-[9/16] relative overflow-hidden cursor-pointer"
                    style={{ backgroundColor: '#0A0A0B' }}
                    onClick={() => handleVideoClick(testimonial.id)}
                  >
                    {shouldLoad ? (
                      <video
                        id={`video-${testimonial.id}`}
                        src={testimonial.url}
                        className="w-full h-full object-contain"
                        preload="metadata"
                        playsInline
                        onEnded={() => setPlayingVideo(null)}
                        onPause={() => {
                          if (playingVideo === testimonial.id) {
                            setPlayingVideo(null);
                          }
                        }}
                        onLoadedMetadata={(e) => {
                          const video = e.target as HTMLVideoElement;
                          video.currentTime = 0.1;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full animate-pulse" style={{ backgroundColor: '#1a1a1f' }} />
                    )}
                    {!isPlaying && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
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
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
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
                        fontSize: '1.1rem',
                        color: '#F0EDE8',
                        marginBottom: '2px',
                      }}
                    >
                      {testimonial.testimonial_name || 'Anonymous'}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 300,
                        fontSize: '0.78rem',
                        color: '#8A8680',
                      }}
                    >
                      {testimonial.testimonial_designation || 'Client'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoadingMore && (
            <>
              {[...Array(3)].map((_, i) => (
                <VideoCardSkeleton key={`skeleton-${i}`} />
              ))}
            </>
          )}
        </div>

        {hasMore && !isLoadingMore && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5"
              style={{
                border: '1px solid rgba(201,168,76,0.3)',
                backgroundColor: 'rgba(201,168,76,0.05)',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: '0.82rem',
                letterSpacing: '0.06em',
                color: '#C9A84C',
              }}
            >
              Load more
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
