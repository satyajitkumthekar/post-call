import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UploadedFile {
  id: string;
  file_name: string;
  file_path: string;
  bucket_id: string;
  public_url: string;
  testimonial_name?: string;
  testimonial_designation?: string;
}

export default function ImageTestimonials() {
  const [testimonialImages, setTestimonialImages] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const fetchTestimonialImages = async () => {
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('bucket_id', 'text-testimonial-images')
        .order('created_at', { ascending: false });

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
    <section className="relative py-24 px-6 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-semibold text-sm">Testimonial Screenshots</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Real Messages from <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">Real Clients</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Authentic conversations and transformations shared by our community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonialImages.map((image) => (
            <div
              key={image.id}
              className="group relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/30 transition-all hover:-translate-y-1 duration-300"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden bg-gray-950">
                  <img
                    src={image.public_url}
                    alt={image.testimonial_name || 'Testimonial'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {(image.testimonial_name || image.testimonial_designation) && (
                  <div className="p-4 border-t border-gray-800">
                    {image.testimonial_name && (
                      <div className="font-semibold text-white">{image.testimonial_name}</div>
                    )}
                    {image.testimonial_designation && (
                      <div className="text-sm text-gray-400">{image.testimonial_designation}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
