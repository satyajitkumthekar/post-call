import { useEffect } from 'react';
import ClientStories from '../components/site/ClientStories';
import HeroSection from '../components/site/HeroSection';
import MessageWall from '../components/site/MessageWall';
import ProgramSection from '../components/site/ProgramSection';
import SiteFooter from '../components/site/SiteFooter';
import SiteHeader from '../components/site/SiteHeader';

// The homepage people land on after booking a call.
// Order: the video first, then client stories, then the program. It ends there on purpose.
export default function Home() {
  useEffect(() => {
    document.body.classList.add('site-light');
    return () => document.body.classList.remove('site-light');
  }, []);

  return (
    <div id="top" className="min-h-screen bg-canvas font-body text-ink antialiased">
      <SiteHeader />
      <main>
        <HeroSection />
        <ClientStories />
        <MessageWall />
        <ProgramSection />
      </main>
      <SiteFooter />
    </div>
  );
}
