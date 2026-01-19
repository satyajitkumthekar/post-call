import { ArrowRight, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loadMainVideo } from '../utils/mediaLoader';
import VideoModal from './VideoModal';

export default function Hero() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    loadMainVideo().then(setVideoUrl);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-white via-gray-50 to-white pb-12">
      {/* Header Section */}
      <div className="relative bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Thank you for booking your call
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              We've sent you a confirmation email with your meeting link and all the details you need to join the call
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-0">
            {/* Video Section */}
            <div className="relative p-8 md:p-12 bg-gradient-to-br from-gray-50 to-white">
              <div
                className="relative aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5 group cursor-pointer"
                onClick={() => videoUrl && setIsVideoModalOpen(true)}
              >
                {videoUrl ? (
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src={videoUrl}
                    preload="metadata"
                  />
                ) : (
                  <img
                    src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Coach"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110">
                    <Play className="w-8 h-8 text-blue-600 fill-blue-600 ml-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* What to Expect Section */}
            <div className="relative flex flex-col justify-center p-8 md:p-12 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">What to expect on the call</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-base leading-relaxed">We'll discuss your fitness levels and overall body confidence</span>
                </li>
                <li className="flex items-start gap-4">
                  <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-base leading-relaxed">Assess your goals</span>
                </li>
                <li className="flex items-start gap-4">
                  <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-base leading-relaxed">Clarity over what's holding you back</span>
                </li>
                <li className="flex items-start gap-4">
                  <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-base leading-relaxed">Action plan to work on moving forward</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={videoUrl || ''}
      />
    </section>
  );
}
