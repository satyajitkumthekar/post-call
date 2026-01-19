import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import VideoTestimonials from './components/VideoTestimonials';
import MessagesCollage from './components/MessagesCollage';
import TextTestimonials from './components/TextTestimonials';
import Admin from './components/Admin';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    setIsAdmin(path === '/admin');
  }, []);

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <VideoTestimonials />
      <MessagesCollage />
      <TextTestimonials />
    </div>
  );
}

export default App;
