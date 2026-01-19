import { PlayCircle, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center">
                <PlayCircle className="w-20 h-20 text-blue-500 mx-auto mb-4 opacity-90 hover:opacity-100 transition cursor-pointer" />
                <p className="text-gray-400 text-sm font-medium">What to Expect on Your Call</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold text-sm">Call Confirmed</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
            Thanks for booking your call
          </h1>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
            <p className="text-blue-300 font-semibold text-sm mb-3">Check your inbox</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Look for a confirmation email with your Zoom link and the exact time of your call. If you don't see it, check your spam folder and promotions tab.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">What to Expect</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <span className="text-gray-300">We'll discuss your fitness levels and overall body confidence</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <span className="text-gray-300">Assess your goals and what you want to achieve</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <span className="text-gray-300">Get clarity on what's holding you back</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <span className="text-gray-300">Create an action plan to move forward</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
