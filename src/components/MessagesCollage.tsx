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
    <section className="relative py-24 px-6 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative h-[600px] rounded-3xl overflow-hidden bg-gradient-to-b from-gray-900 to-black border border-gray-800 backdrop-blur">
          {/* Animated testimonial images collage */}
          <div className="absolute inset-0 overflow-hidden">
            {testimonialImages.map((image, index) => {
              const randomX = Math.random() * 70;
              const randomY = Math.random() * 70;
              const randomDelay = index * 0.3;
              const randomDuration = 20 + Math.random() * 10;
              const randomRotation = Math.random() * 20 - 10;

              return (
                <div
                  key={image.id}
                  className="absolute animate-float"
                  style={{
                    left: `${randomX}%`,
                    top: `${randomY}%`,
                    animation: `float ${randomDuration}s ease-in-out ${randomDelay}s infinite`,
                  }}
                >
                  <div className="relative rounded-2xl shadow-2xl hover:shadow-blue-500/20 transition-all hover:scale-105 duration-300"
                    style={{
                      transform: `rotate(${randomRotation}deg)`,
                    }}
                  >
                    <img
                      src={image.url}
                      alt="Testimonial"
                      className="w-64 h-auto rounded-2xl border-2 border-gray-700"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-20px) rotate(1deg);
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
