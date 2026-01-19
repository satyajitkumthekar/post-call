import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { MessageTestimonial } from '../lib/supabase';

export default function MessagesCollage() {
  const [messages, setMessages] = useState<MessageTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('message_testimonials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const shuffledMessages = [...messages].sort(() => Math.random() - 0.5);

  if (loading) {
    return (
      <section className="relative py-24 px-6 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-6 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative h-[600px] rounded-3xl overflow-hidden bg-gradient-to-b from-gray-900 to-black border border-gray-800 backdrop-blur">
          {/* Animated messages collage */}
          <div className="absolute inset-0 overflow-hidden">
            {shuffledMessages.map((message, index) => {
              const randomX = Math.random() * 80;
              const randomY = Math.random() * 80;
              const randomDelay = index * 0.05;
              const randomDuration = 15 + Math.random() * 10;

              return (
                <div
                  key={index}
                  className="absolute animate-float"
                  style={{
                    left: `${randomX}%`,
                    top: `${randomY}%`,
                    animation: `float ${randomDuration}s ease-in-out ${randomDelay}s infinite`,
                  }}
                >
                  <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl px-4 py-3 shadow-lg hover:shadow-2xl transition-shadow max-w-xs">
                    <p className="text-white text-sm font-medium mb-2">"{message.text}"</p>
                    <p className="text-blue-200 text-xs font-semibold">— {message.name}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-20px) rotate(1deg);
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
