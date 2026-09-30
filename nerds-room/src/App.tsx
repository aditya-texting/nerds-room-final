import Navbar from './components/Navbar';
import PartnersMarquee from './components/PartnersMarquee';
import PastEvents from './components/PastEvents';
import FlagshipEvents from './components/FlagshipEvents';
import Chapters from './components/Chapters';

import CommunitySays from './components/CommunitySays';
import JoinCommunity from './components/JoinCommunity';
import MissionLetter from './components/MissionLetter';
import PhotoGallery from './components/PhotoGallery';
import Workshops from './components/Workshops';
import Footer from './components/Footer';
import Hero from './components/Hero';
import { useAppData } from './context/AppDataContext';

import { useEffect } from 'react';

function App() {
  const { maintenanceMode } = useAppData();

  useEffect(() => {
    document.title = "Nerds Room | Building the Future";
  }, []);

  // Global Maintenance Mode Screen
  if (maintenanceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          {/* Maintenance Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <svg className="w-32 h-32 text-nerdBlue animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-black text-nerdDark mb-4 tracking-tight">
            UNDER MAINTENANCE
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            We're updating our systems to bring you more epic building opportunities. Join our community for live updates!
          </p>

          {/* CTA Button */}
          <a
            href="https://discord.gg/nerdsroom"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-nerdBlue text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            GO TO COMMUNITY
          </a>

          {/* Footer Note */}
          <p className="mt-12 text-sm text-gray-400">
            Need urgent assistance? Contact us at{' '}
            <a href="mailto:support@nerdsroom.com" className="text-nerdBlue hover:underline">
              support@nerdsroom.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans relative scroll-smooth">
      <Navbar />
      <main id="main-content">
        <Hero />
        <PartnersMarquee />
        <PastEvents />
        <Chapters />
        <FlagshipEvents />
        <Workshops />
        <JoinCommunity />
        <CommunitySays />
        <MissionLetter />
        <PhotoGallery />
      </main>
      <Footer />
    </div>
  );
}

export default App;
