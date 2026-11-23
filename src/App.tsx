import { useEffect, useState } from 'react';
import Admin from './pages/Admin';
import Book from './pages/Book';
import Home from './pages/Home';
import Leads from './pages/Leads';
import MediaLibrary from './pages/MediaLibrary';
import Schedule from './pages/Schedule';
import Schedule1 from './pages/Schedule1';

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

  if (currentPath === '/media') {
    return <MediaLibrary />;
  }

  if (currentPath === '/schedule') {
    return <Schedule />;
  }

  if (currentPath === '/schedule1') {
    return <Schedule1 />;
  }

  if (currentPath === '/book') {
    return <Book key="book" />;
  }

  return <Home />;
}

export default App;
