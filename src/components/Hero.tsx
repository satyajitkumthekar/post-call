import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
      {/* Header Section */}
      <div className="relative bg-white border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thank you for booking your call
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              We've sent you a confirmation email with your meeting link and all the details you need to join the call
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Video Section */}
            <div className="relative p-8 md:p-12 bg-gradient-to-br from-gray-50 to-white">
              <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5">
                <img
                  src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Coach"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-lg shadow-lg">
                  1:00
                </div>
              </div>
            </div>

            {/* What to Expect Section */}
            <div className="relative flex flex-col justify-center p-8 md:p-12 bg-white border-l border-gray-200/60">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-600 to-blue-400"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 pl-2">What to expect on the call</h2>
              <ul className="space-y-5 pl-2">
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
    </section>
  );
}
