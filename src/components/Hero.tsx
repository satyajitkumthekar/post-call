import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Thank you for booking your call</h1>
          <p className="text-gray-600 text-lg">Check your inbox for your Zoom link</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Coach"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/80 text-white text-sm font-medium px-3 py-1.5 rounded">
                1:00
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">What to expect on the call</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-base">We'll discuss your fitness levels and overall body confidence</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-base">Assess your goals</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-base">Clarity over what's holding you back</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-base">Action plan to work on moving forward</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
