import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loadTestimonialVideos, VideoTestimonial } from '../utils/mediaLoader';
import VideoModal from './VideoModal';

export default function VideoTestimonials() {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null);

  useEffect(() => {
    const videos = loadTestimonialVideos();
    setTestimonials(videos);
  }, []);

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
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.filename}
              className="group relative cursor-pointer"
              onClick={() => setSelectedVideo(testimonial)}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all">
                <div className="aspect-video relative overflow-hidden bg-gray-950">
                  <video
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all group-hover:scale-105 duration-500"
                    src={testimonial.videoUrl}
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform shadow-2xl">
                      <Play className="w-8 h-8 text-blue-600 fill-blue-600 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm">{testimonial.designation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.videoUrl}
          title={`${selectedVideo.name} - ${selectedVideo.designation}`}
        />
      )}
    </section>
  );
}
