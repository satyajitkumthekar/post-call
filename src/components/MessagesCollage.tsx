import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface UploadedFile {
  id: string;
  url: string;
  file_name: string;
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

  if (testimonialImages.length === 0) {
    return null;
  }

  return (
    <section className="relative py-24 bg-black overflow-hidden min-h-[600px]">
      {/* Animated testimonial images collage */}
      {testimonialImages.map((image, index) => {
        const randomX = 10 + Math.random() * 80;
        const randomY = 10 + Math.random() * 80;
        const randomDelay = index * 2;
        const cycleDuration = 12;
        const randomRotation = Math.random() * 15 - 7.5;

        return (
          <div
            key={image.id}
            className="absolute pointer-events-none"
            style={{
              left: `${randomX}%`,
              top: `${randomY}%`,
              animation: `testimonialCycle ${cycleDuration}s ease-in-out ${randomDelay}s infinite`,
              transformOrigin: 'center',
            }}
          >
            <div className="relative rounded-2xl shadow-2xl"
              style={{
                transform: `rotate(${randomRotation}deg)`,
              }}
            >
              <img
                src={image.url}
                alt="Testimonial"
                className="w-72 h-auto rounded-2xl border-2 border-gray-700/50 shadow-2xl pointer-events-none select-none"
              />
            </div>
          </div>
        );
      })}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>

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
