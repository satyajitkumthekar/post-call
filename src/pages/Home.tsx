import { useEffect } from 'react';
import BeforeWeTalk from '../components/site/BeforeWeTalk';
import ClarityCall from '../components/site/ClarityCall';
import ClientStories from '../components/site/ClientStories';
import Closer from '../components/site/Closer';
import FitAndPrice from '../components/site/FitAndPrice';
import HeroSection from '../components/site/HeroSection';
import MessageWall from '../components/site/MessageWall';
import ProgramSection from '../components/site/ProgramSection';
import SiteFooter from '../components/site/SiteFooter';
import SiteHeader from '../components/site/SiteHeader';
import WhatYouGet from '../components/site/WhatYouGet';

// The homepage people land on after booking a call.
// Order: the video first, then client stories, then the program, then the offer and the call.
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
        <WhatYouGet />
        <FitAndPrice />
        <ClarityCall />
        <BeforeWeTalk />
        <Closer />
      </main>
      <SiteFooter />
    </div>
  );
}
