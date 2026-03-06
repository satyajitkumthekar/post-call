import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';

interface UploadedFile {
  id: string;
  url: string;
  file_name: string;
}

interface ImagePosition {
  x: number;
  y: number;
  delay: number;
  rotation: number;
}

export default function MessagesCollage() {
  const [testimonialImages, setTestimonialImages] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const fetchTestimonialImages = async () => {
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('bucket_id', 'text-testimonial-images');

      if (data && !error) {
        setTestimonialImages(data);
      }
    };

    fetchTestimonialImages();
  }, []);

  // Generate stable, evenly distributed positions
  const imagePositions = useMemo(() => {
    if (testimonialImages.length === 0) return [];

    const positions: ImagePosition[] = [];
    const cols = Math.ceil(Math.sqrt(testimonialImages.length));
    const rows = Math.ceil(testimonialImages.length / cols);

    testimonialImages.forEach((_, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      // Base grid position with spacing
      const baseX = (col / (cols - 1 || 1)) * 80 + 10;
      const baseY = (row / (rows - 1 || 1)) * 70 + 15;

      // Add small random offset for natural feel
      const offsetX = (Math.random() - 0.5) * 15;
      const offsetY = (Math.random() - 0.5) * 15;

      positions.push({
        x: Math.max(5, Math.min(85, baseX + offsetX)),
        y: Math.max(10, Math.min(80, baseY + offsetY)),
        delay: index * 2,
        rotation: Math.random() * 15 - 7.5,
      });
    });

    return positions;
  }, [testimonialImages]);

  if (testimonialImages.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden min-h-[700px]"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="relative z-10 pt-20 pb-8 text-center pointer-events-none">
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            color: '#F0EDE8',
            lineHeight: 1.2,
          }}
        >
          Inside the program. Real messages, real clients.
        </h2>
      </div>

      {testimonialImages.map((image, index) => {
        const position = imagePositions[index];
        const cycleDuration = 12;

        return (
          <div
            key={image.id}
            className="absolute pointer-events-none"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              animation: `testimonialCycle ${cycleDuration}s ease-in-out ${position.delay}s infinite`,
              transformOrigin: 'center',
            }}
          >
            <div
              className="relative rounded-2xl shadow-2xl"
              style={{ transform: `rotate(${position.rotation}deg)` }}
            >
              <img
                src={image.url}
                alt="Testimonial"
                className="w-72 h-auto rounded-2xl pointer-events-none select-none"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
                }}
              />
            </div>
          </div>
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

      <style>{`
        @keyframes testimonialCycle {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
            z-index: 1;
          }
          15% {
            opacity: 0.95;
            transform: scale(0.95) translateY(0px);
            z-index: 5;
          }
          35% {
            opacity: 1;
            transform: scale(1.05) translateY(-10px);
            z-index: 10;
            filter: brightness(1.1);
          }
          50% {
            opacity: 1;
            transform: scale(1) translateY(-5px);
            z-index: 10;
          }
          65% {
            opacity: 0.95;
            transform: scale(0.95) translateY(0px);
            z-index: 5;
          }
          85% {
            opacity: 0.4;
            transform: scale(0.85) translateY(15px);
            z-index: 1;
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
            z-index: 1;
          }
        }
      `}</style>
    </section>
  );
}
