import { MessageSquare, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { TextTestimonial } from '../lib/supabase';

export default function TextTestimonials() {
  const [textTestimonials, setTextTestimonials] = useState<TextTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    const { data } = await supabase
      .from('text_testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (data) {
      setTextTestimonials(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="relative py-24 px-6 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-semibold text-sm">Written Testimonials</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our Clients <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">Are Saying</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real feedback from real people achieving extraordinary results
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {textTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-blue-500/30 transition-all hover:-translate-y-1 duration-300"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-blue-400 fill-blue-400" />
                  ))}
                </div>
                <blockquote className="text-gray-300 leading-relaxed mb-6">
                  "{testimonial.text}"
                </blockquote>
                <div className="border-t border-gray-800 pt-4">
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-block bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12 border border-gray-800">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Write Your Own Success Story?
            </h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join hundreds of successful clients who have transformed their lives with Superhuman Lab
            </p>
            <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105">
              <span className="relative z-10">Book Your Free Consultation</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-24 pt-12 border-t border-gray-900 text-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent mb-2">
          Superhuman Lab
        </div>
        <p className="text-gray-500 text-sm">
          © 2024 Superhuman Lab. All rights reserved.
        </p>
      </footer>
    </section>
  );
}
