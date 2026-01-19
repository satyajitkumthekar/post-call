import { useState } from 'react';
import { Settings } from 'lucide-react';
import Hero from './components/Hero';
import VideoTestimonials from './components/VideoTestimonials';
import MessagesCollage from './components/MessagesCollage';
import Admin from './pages/Admin';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'admin'>('home');

  if (currentPage === 'admin') {
    return <Admin onBackToHome={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen">
      <button
        onClick={() => setCurrentPage('admin')}
        className="fixed bottom-6 right-6 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-full shadow-lg transition-colors z-50"
        title="Admin Panel"
      >
        <Settings className="h-6 w-6" />
      </button>

      <Hero />
      <VideoTestimonials />
      <MessagesCollage />
    </div>
  );
}

export default App;
