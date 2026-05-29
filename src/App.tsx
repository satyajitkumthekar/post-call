import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProgramSection from './components/ProgramSection';
import VideoTestimonials from './components/VideoTestimonials';
import MessagesCollage from './components/MessagesCollage';
import Admin from './pages/Admin';
import Book from './pages/Book';
import Leads from './pages/Leads';
import Schedule from './pages/Schedule';

const beforeCallItems = [
  {
    icon: '🧠',
    title: 'Be honest',
    description: 'The more openly you share, the more useful this call will be. Nothing is judged. Everything is useful.',
  },
  {
    icon: '📵',
    title: 'Block the time',
    description: 'Treat this like a board meeting. No distractions, no half-attention.',
  },
  {
    icon: '✍️',
    title: 'Know your why',
    description: 'Why does this actually matter to you right now? Have that answer ready before we speak.',
  },
];

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  if (currentPath === '/admin') {
    return <Admin onBackToHome={navigateHome} />;
  }

  if (currentPath === '/leads') {
    return <Leads />;
  }

  if (currentPath === '/schedule') {
    return <Schedule />;
  }

  if (currentPath === '/book') {
    return <Book key="book" />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0B' }}>
      <Header />
      <Hero />
      <ProgramSection />
      <VideoTestimonials />
      <MessagesCollage />

      {/* Before the Call section */}
      <section
        className="relative py-16 md:py-20 px-6"
        style={{ backgroundColor: '#111114' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 flex-shrink-0" style={{ backgroundColor: 'rgba(201,168,76,0.4)' }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase' as const,
              color: '#C9A84C',
            }}>
              Before the Call
            </span>
            <div className="h-px w-12 flex-shrink-0" style={{ backgroundColor: 'rgba(201,168,76,0.4)' }} />
          </div>

          <h2
            className="mb-14"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(1.7rem, 4vw, 2.25rem)',
              color: '#F0EDE8',
              lineHeight: 1.1,
            }}
          >
            Come ready. <em>This is your hour.</em>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {beforeCallItems.map((item, i) => (
              <div
                key={i}
                className="p-7 rounded-xl text-left"
                style={{
                  backgroundColor: '#131316',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="text-2xl mb-4">{item.icon}</div>
                <div
                  className="mb-2"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: '0.95rem',
                    color: '#F0EDE8',
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: '0.9375rem',
                    color: '#8A8680',
                    lineHeight: '1.7',
                  }}
                >
                  {item.description}
                </div>
              </div>
            ))}
          </div>

          <div className="h-px mb-14" style={{ backgroundColor: 'rgba(201,168,76,0.15)' }} />

          <blockquote
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: '#F0EDE8',
              lineHeight: 1.2,
            }}
          >
            "See you on the call."
          </blockquote>
          <p
            className="mt-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '0.82rem',
              color: '#5A5855',
              letterSpacing: '0.04em',
            }}
          >
            — Satyajit
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8"
        style={{
          backgroundColor: '#0A0A0B',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ border: '1px solid rgba(201,168,76,0.5)' }}
            />
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: '0.95rem',
                letterSpacing: '0.15em',
              }}
            >
              <span style={{ color: '#F0EDE8' }}>SUPERHUMAN</span>
              <span style={{ color: '#C9A84C' }}> LAB</span>
            </span>
          </div>

          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '0.8rem',
              color: '#5A5855',
            }}
          >
            © Superhuman Lab
          </span>
        </div>
        <div className="max-w-6xl mx-auto mt-4 text-center">
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: '0.7rem',
              color: '#3A3835',
            }}
          >
            This page is private and intended only for scheduled call participants.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
