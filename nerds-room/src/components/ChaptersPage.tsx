import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { motion } from 'framer-motion';
import { MapPin, Users, ArrowUpRight, Search } from 'lucide-react';

const ChaptersPage = () => {
  const {
    chapters,
    navigate,
    chaptersHeaderBanner,
    chaptersHeaderBannerOpacity,
  } = useAppData();

  const [query, setQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // City chapters: always public. Campus chapters: only when is_live (Live).
  const publicChapters = (chapters || []).filter(c => {
    if (c.chapter_type === 'campus') return c.is_live !== false;
    return true; // city chapters always live
  });

  const cityChapters = [...publicChapters]
    .filter(c => c.chapter_type !== 'campus')
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .filter(c => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.location || '').toLowerCase().includes(q) ||
        (c.lead || '').toLowerCase().includes(q)
      );
    });

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── SEARCH HEADER ── */}
      <section className="relative pt-32 md:pt-40 pb-10 md:pb-14 px-4 md:px-8 overflow-hidden">
        {chaptersHeaderBanner ? (
          <div className="absolute inset-0 z-0">
            <img src={chaptersHeaderBanner} alt="" className="w-full h-full object-cover" style={{ opacity: chaptersHeaderBannerOpacity }} />
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/90" />
          </div>
        ) : null}
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-black tracking-tight">
              City <span className="text-nerdBlue">Chapters</span>
            </h1>
            <p className="text-base md:text-xl text-gray-600 mt-3">
              Growing stronger in cities near you.
            </p>
          </div>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search chapters by name, city or lead..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white/90 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-nerdBlue/40 focus:border-nerdBlue"
            />
          </div>
        </div>
      </section>

      {/* ── CITY CHAPTERS ── */}
      <section className="pb-16 md:pb-24 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          {cityChapters.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              {query ? 'No chapters match your search.' : 'No city chapters yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {cityChapters.map((chapter, i) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  index={i}
                  onClick={() => navigate(`/chapters/${encodeURIComponent(chapter.name)}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const ChapterCard = ({ chapter, index, onClick }: { chapter: any; index: number; onClick: () => void }) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay: (index % 3) * 0.1 }}
    viewport={{ once: true, margin: '-80px' }}
    className="text-left rounded-[20px] shadow-xl border border-black/5 bg-white overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer"
  >
    <div className="relative w-full aspect-[16/9] bg-nerdGray">
      {chapter.banner_url ? (
        <img src={chapter.banner_url} alt={chapter.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-nerdBlue/10 to-nerdLime/10">
          <MapPin className="w-10 h-10 text-nerdBlue/40" />
        </div>
      )}
      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 text-nerdBlue text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
        View
        <ArrowUpRight size={14} />
      </span>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-lg md:text-xl font-bold text-black leading-tight">{chapter.name}</h3>
      {chapter.lead && (
        <p className="text-sm text-nerdBlue font-medium mt-0.5">Lead: {chapter.lead}</p>
      )}
      {chapter.location && (
        <p className="inline-flex items-center gap-1.5 text-gray-500 text-sm mt-2">
          <MapPin className="w-4 h-4" />{chapter.location}
        </p>
      )}
      <p className="inline-flex items-center gap-1.5 text-gray-500 text-sm mt-1">
        <Users className="w-4 h-4" />{chapter.member_count ?? 0} members
      </p>
    </div>
  </motion.button>
);

export default ChaptersPage;
