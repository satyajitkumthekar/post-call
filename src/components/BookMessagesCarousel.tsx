import { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabase';

interface MessageImage {
  id: string;
  url: string;
}

export default function BookMessagesCarousel() {
  const [images, setImages] = useState<MessageImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await supabase
        .from('uploaded_files')
        .select('id, url')
        .eq('bucket_id', 'text-testimonial-images')
        .order('created_at', { ascending: false });
      if (data) setImages(data);
    };
    fetchImages();
  }, []);

  const rotations = useMemo(() => {
    return images.map(() => (Math.random() * 4 - 2));
  }, [images]);

  const totalDots = Math.max(1, Math.ceil(images.length / 2));

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const scrollPercent = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    const newIndex = Math.round(scrollPercent * (totalDots - 1));
    setCurrentIndex(Math.max(0, Math.min(totalDots - 1, newIndex)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  if (images.length === 0) return null;

  return (
    <div>
      <div
        ref={scrollRef}
        className="carousel-hide-scrollbar flex gap-4 overflow-x-auto pb-4 scroll-smooth cursor-grab active:cursor-grabbing"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {images.map((image, i) => (
          <div
            key={image.id}
            className="flex-shrink-0 scroll-snap-start"
            style={{
              width: 'calc(42vw - 8px)',
              maxWidth: '220px',
              minWidth: '160px',
              scrollSnapAlign: 'start',
            }}
          >
            <div
              className="rounded-xl overflow-hidden shadow-lg"
              style={{
                transform: `rotate(${rotations[i]}deg)`,
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={image.url}
                alt="Client message"
                className="w-full h-auto block"
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {totalDots > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {[...Array(Math.min(totalDots, 12))].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === currentIndex ? '#C9A84C' : 'rgba(255,255,255,0.15)',
                transform: i === currentIndex ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
          {totalDots > 12 && (
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.6rem',
              color: '#5A5855',
              marginLeft: '4px',
            }}>
              +{totalDots - 12}
            </span>
          )}
        </div>
      )}

      <style>{`
        .scroll-snap-start { scroll-snap-align: start; }
        .carousel-hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
