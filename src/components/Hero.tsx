import { PlayCircle, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-white">
      <div className="bg-blue-600 text-white text-center py-3 px-6">
        <p className="text-sm font-medium">Call Confirmed - Check your inbox for your Zoom link</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Coach"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center mx-auto mb-2 cursor-pointer hover:bg-white transition">
                    <PlayCircle className="w-10 h-10 text-blue-600" fill="currentColor" />
                  </div>
                  <p className="text-white text-xs font-medium">1:00</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-8">What to expect on the call</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">We'll discuss your fitness levels and overall body confidence</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">Assess your goals</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">Clarity over what's holding you back</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">Action plan to work on moving forward</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
