import { useState, useEffect, useMemo, memo } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';

// --- Types ---
interface Hackathon {
  id?: number;
  title: string;
  slug: string;
  organizer: string;
  organizers?: { name: string; role?: string; logo_url?: string; social_links?: any[] }[];
  timeLeft: string;
  mode: 'Online' | 'In-person';
  prize: string;
  participants: string;
  tags: string[];
  dates: string;
  description: string;
  about?: string;
  prizes: { title: string; amount: string; description: string }[];
  rules: string[];
  resources: { name: string; link: string }[];
  logo?: string;
  banner?: string;
  managed_by_nerds?: boolean;
  registration_type?: 'external' | 'managed';
  registration_link?: string;
  managed_form_id?: string;
  auto_approve?: boolean;
  badge_image_url?: string;
  badge_enabled?: boolean;
  challenges?: { title: string; description: string; icon?: string }[];
  schedule?: { date: string; time: string; title: string; description?: string }[];
  rewards?: { title: string; description: string; image?: string }[];
  partners?: { name: string; logo: string; type: string }[];
  mentors?: { name: string; role?: string; bio?: string; image_url?: string; social_links?: any[] }[];
  jury?: { name: string; role?: string; bio?: string; image_url?: string; social_links?: any[] }[];
  faq?: { question: string; answer: string }[];
}

// --- Specialized Internal Components (Memoized for Production) ---

const LoadingSkeleton = memo(() => (
  <div className="min-h-screen bg-white">
    <Navbar />
    {/* Skeleton Header */}
    <div className="h-[480px] md:h-[650px] bg-slate-50 animate-pulse relative">
      <div className="absolute bottom-36 left-10 space-y-4 max-w-2xl">
        <div className="h-4 w-32 bg-slate-200 rounded-full" />
        <div className="h-16 w-full bg-slate-200 rounded-2xl" />
        <div className="h-16 w-3/4 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  </div>
));

// --- Main Page Component ---

const EventDetailsPage = () => {
  const { hackathons: dbHackathons, loading, navigate } = useAppData();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);

  // Derive registration state from AppData (real-time) with useMemo for performance
  const slug = useMemo(() => window.location.pathname.split('/').pop() || '', []);

  useEffect(() => {
      if (!loading) {
          const found = dbHackathons.find(h => h.slug === slug);
          if (found) {
              setHackathon({
                  ...found,
                  timeLeft: found.time_left || 'TBA',
                  participants: found.participants || '0',
                  logo: found.logo_url,
                  banner: found.banner_url,
                  prizes: found.prizes || [],
                  rules: found.rules || [],
                  resources: found.resources || []
              } as Hackathon);
          }
      }
  }, [dbHackathons, slug, loading]);

  if (loading) return <LoadingSkeleton />;

  if (!hackathon) {
      return (
          <div className="min-h-screen bg-white flex flex-col">
              <Navbar />
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Event Not Found</h1>
                  <button onClick={() => navigate('/events')} className="text-indigo-600 font-bold uppercase tracking-widest text-sm hover:underline">Back to Events</button>
              </div>
              <Footer />
          </div>
      );
  }

  return (
      <div className="min-h-screen bg-white">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
              <h1 className="text-4xl font-black text-slate-900 mb-6">{hackathon.title}</h1>
              <p className="text-slate-600 mb-8">{hackathon.description}</p>
              <button 
                  onClick={() => navigate('/events')}
                  className="bg-nerdBlue text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-nerdDark transition-all"
              >
                  Back to Calendar
              </button>
          </div>
          <Footer />
      </div>
  );
};

export default EventDetailsPage;
