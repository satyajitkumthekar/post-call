import { PlayCircle, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative px-6 pt-16 pb-24 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full mb-6">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-semibold text-sm">Call Confirmed</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
            Thanks for booking your call
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto mb-12">
            <p className="text-blue-900 font-semibold text-sm mb-2">Check your inbox</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Look for a confirmation email with your Zoom link. If you don't see it, check your spam folder and promotions tab.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-gray-300 shadow-xl">
              <img
                src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Coach"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="w-16 h-16 text-blue-500 mx-auto mb-3 opacity-90 hover:opacity-100 transition cursor-pointer drop-shadow-lg" />
                  <p className="text-white text-sm font-medium drop-shadow-lg">What to Expect on Your Call</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <h3 className="text-2xl font-bold text-black mb-6">What to Expect</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <span className="text-gray-700 leading-relaxed">We'll discuss your fitness levels and overall body confidence</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <span className="text-gray-700 leading-relaxed">Assess your goals and what you want to achieve</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <span className="text-gray-700 leading-relaxed">Get clarity on what's holding you back</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <span className="text-gray-700 leading-relaxed">Create an action plan to move forward</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
