const messages = [
  { text: "That last workout was INSANE", name: "Alex" },
  { text: "I've never felt better", name: "Jordan" },
  { text: "Down 20lbs in 6 weeks!", name: "Sam" },
  { text: "This program changed everything", name: "Casey" },
  { text: "My confidence is through the roof", name: "Morgan" },
  { text: "Finally seeing real results", name: "Taylor" },
  { text: "You're the best coach ever 🙌", name: "Riley" },
  { text: "Can't believe the transformation", name: "Jamie" },
  { text: "This is next level", name: "Blake" },
  { text: "Best investment I've made", name: "Drew" },
  { text: "The structure is perfect", name: "Cameron" },
  { text: "Already feeling stronger", name: "Quinn" },
  { text: "This actually works", name: "Avery" },
  { text: "I'm addicted to this program", name: "Skylar" },
  { text: "Life changing experience", name: "River" },
  { text: "Never stopping this", name: "Phoenix" },
  { text: "Best purchase ever", name: "Sage" },
  { text: "How are you so good at this?", name: "Justice" },
  { text: "Complete game changer", name: "Emerson" },
  { text: "I recommend you to everyone", name: "Parker" },
];

export default function MessagesCollage() {
  const shuffledMessages = [...messages].sort(() => Math.random() - 0.5);

  return (
    <section className="relative py-24 px-6 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Join Our <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">Community</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See what our clients are saying in real-time
          </p>
        </div>

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
