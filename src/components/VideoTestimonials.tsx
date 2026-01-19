import { PlayCircle, Star } from 'lucide-react';

const videoTestimonials = [
  {
    id: 1,
    name: 'Michael Chen',
    role: 'CEO & Entrepreneur',
    thumbnail: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800',
    result: 'Lost 35 lbs in 12 weeks',
  },
  {
    id: 2,
    name: 'Sarah Anderson',
    role: 'Marketing Director',
    thumbnail: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800',
    result: 'Gained 15 lbs of muscle',
  },
  {
    id: 3,
    name: 'David Martinez',
    role: 'Software Engineer',
    thumbnail: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800',
    result: 'Transformed in 90 days',
  },
  {
    id: 4,
    name: 'Emily Thompson',
    role: 'Financial Advisor',
    thumbnail: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=800',
    result: 'Best shape of my life',
  },
];

export default function VideoTestimonials() {
  return (
    <section className="relative py-32 px-6 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
            <span className="text-blue-400 font-semibold text-sm">Real Transformations</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Hear From Our <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">Success Stories</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Watch real people share their incredible journeys with Superhuman Lab
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {videoTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all">
                <div className="aspect-video relative overflow-hidden bg-gray-950">
                  <img
                    src={testimonial.thumbnail}
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
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-blue-400 fill-blue-400" />
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{testimonial.role}</p>
                  <div className="inline-block bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
                    <span className="text-blue-300 text-sm font-medium">{testimonial.result}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
