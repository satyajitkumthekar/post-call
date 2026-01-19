import { useState, useEffect } from 'react';
import { PlayCircle, PauseCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  testimonial_name: string | null;
  testimonial_designation: string | null;
  url: string;
  file_name: string;
}

export default function VideoTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('id, testimonial_name, testimonial_designation, url, file_name')
        .eq('bucket_id', 'video-testimonials')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setIsLoading(false);
    }
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
      <section className="relative py-16 px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
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
          {testimonials.map((testimonial) => {
            const isPlaying = playingVideo === testimonial.id;
            return (
              <div key={testimonial.id} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
                <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all">
                  <div
                    className="aspect-video relative overflow-hidden bg-gray-950 cursor-pointer"
                    onClick={() => handleVideoClick(testimonial.id)}
                  >
                    <video
                      id={`video-${testimonial.id}`}
                      src={testimonial.url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      onEnded={() => setPlayingVideo(null)}
                      onPause={() => {
                        if (playingVideo === testimonial.id) {
                          setPlayingVideo(null);
                        }
                      }}
                    />
                    {!isPlaying && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-blue-500/90 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <PlayCircle className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </>
                    )}
                    {isPlaying && (
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                          <PauseCircle className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {testimonial.testimonial_name || 'Anonymous'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {testimonial.testimonial_designation || 'Client'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
