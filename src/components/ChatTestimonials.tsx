import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface UploadedFile {
  id: string;
  url: string;
  file_name: string;
}

export default function ChatTestimonials() {
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
    <section
      className="relative py-16 md:py-20"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex flex-col gap-3">
          {testimonialImages.map((image, index) => {
            const isRight = index % 2 === 1;
            return (
              <div
                key={image.id}
                className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="overflow-hidden"
                  style={{
                    maxWidth: '78%',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                    backgroundColor: isRight ? '#1a1f1a' : '#18181b',
                    borderRadius: isRight
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                  }}
                >
                  <img
                    src={image.url}
                    alt="Client message"
                    className="w-full h-auto block select-none"
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
