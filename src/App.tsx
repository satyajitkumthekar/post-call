import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import VideoTestimonials from './components/VideoTestimonials';
import MessagesCollage from './components/MessagesCollage';
import ImageTestimonials from './components/ImageTestimonials';
import Admin from './pages/Admin';

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

  return (
    <div className="min-h-screen">
      <Hero />
      <VideoTestimonials />
      <MessagesCollage />
      <ImageTestimonials />
    </div>
  );
}

export default App;
