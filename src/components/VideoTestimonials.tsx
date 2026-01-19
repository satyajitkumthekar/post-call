import { PlayCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { VideoTestimonial } from '../lib/supabase';

export default function VideoTestimonials() {
  const [videoTestimonials, setVideoTestimonials] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    const { data } = await supabase
      .from('video_testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (data) {
      setVideoTestimonials(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="relative py-16 px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }
  return (
    <section className="relative py-16 px-6 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Here is what some of our incredible clients have to say
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {videoTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all">
                <div className="aspect-video relative overflow-hidden bg-gray-950">
                  <img
                    src={testimonial.thumbnail_url}
                    alt={testimonial.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all group-hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/90 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform cursor-pointer">
                      <PlayCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{testimonial.role}</p>
                  <p className="text-blue-400 font-semibold">{testimonial.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
