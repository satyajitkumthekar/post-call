import { useEffect, useState } from 'react';
import Admin from './pages/Admin';
import Book from './pages/Book';
import Home from './pages/Home';
import Leads from './pages/Leads';
import Schedule from './pages/Schedule';

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

  return <Home />;
}

export default App;
