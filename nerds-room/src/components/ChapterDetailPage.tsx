import { useMemo } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { motion } from 'framer-motion';
import { MapPin, Users, ArrowLeft, Calendar, ArrowUpRight } from 'lucide-react';

const ChapterDetailPage = () => {
  const { chapters, subchapters, chapterEvents, chapterContents, loading, navigate, joinCommunityLink, normalizeUrl } = useAppData();

  const name = useMemo(() => decodeURIComponent(window.location.pathname.split('/').pop() || ''), []);

  const chapter = useMemo(() => {
    return (chapters || []).find(c => c.name === name) || null;
  }, [chapters, name]);

  const subs = useMemo(() => {
    if (!chapter) return [];
    return (subchapters || [])
      .filter(s => s.chapter_id === chapter.id)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [subchapters, chapter]);

  const events = useMemo(() => {
    if (!chapter) return [];
    return (chapterEvents || [])
      .filter(e => e.chapter_id === chapter.id)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || (a.date || '').localeCompare(b.date || ''));
  }, [chapterEvents, chapter]);

  const subEvents = (subId: number) => {
    return (chapterEvents || [])
      .filter(e => e.subchapter_id === subId)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || (a.date || '').localeCompare(b.date || ''));
  };

  const content = useMemo(() => {
    if (!chapter) return null;
    return (chapterContents || []).find(c => c.chapter_id === chapter.id) || null;
  }, [chapterContents, chapter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="h-[400px] bg-slate-50 animate-pulse" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Chapter Not Found</h1>
          <button
            onClick={() => navigate('/chapters')}
            className="text-nerdBlue font-bold uppercase tracking-widest text-sm hover:underline"
          >
            Back to Chapters
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── 1. HERO ── */}
      <section className="relative pt-28 md:pt-32 pb-10 md:pb-16 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {chapter.banner_url ? (
            <img src={chapter.banner_url} alt={chapter.name} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-nerdBlue/40 to-nerdLime/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <button
            onClick={() => navigate('/chapters')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold uppercase tracking-widest mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            All Chapters
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-nerdLime/20 border border-nerdLime/30 text-nerdLime text-[11px] font-medium uppercase tracking-[0.2em] mb-4">
              {chapter.chapter_type === 'campus' ? 'Campus Chapter' : 'City Chapter'}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              {chapter.name}
            </h1>
            {chapter.description && (
              <p className="max-w-2xl mt-4 text-gray-200 text-lg md:text-xl font-medium">
                {chapter.description}
              </p>
            )}
            {chapter.location && (
              <p className="inline-flex items-center gap-1.5 text-gray-200 text-lg mt-3">
                <MapPin className="w-5 h-5" />{chapter.location}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-5">
              {chapter.lead && (
                <p className="text-nerdLime font-semibold">Lead: {chapter.lead}</p>
              )}
              <p className="inline-flex items-center gap-1.5 text-gray-200 text-sm">
                <Users className="w-4 h-4" />{chapter.member_count ?? 0} members
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href={normalizeUrl(chapter.join_link || joinCommunityLink || 'https://discord.gg/nerdsroom')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-nerdLime text-nerdBlue font-black px-6 py-3 rounded-xl shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-sm tracking-wide uppercase"
              >
                Join Our Chapter
                <ArrowUpRight size={16} />
              </a>
              {chapter.partner_link && (
                <a
                  href={normalizeUrl(chapter.partner_link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/30 font-black px-6 py-3 rounded-xl hover:bg-white/20 transition-all text-sm tracking-wide uppercase"
                >
                  Partner With Us
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. UPCOMING EVENTS ── */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-nerdGray/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">Upcoming Events</h2>
          {events.length === 0 ? (
            <div className="rounded-[24px] border-2 border-dashed border-gray-200 bg-white py-16 px-6 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-nerdGray flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700">No upcoming events at this time.</h3>
              <p className="text-gray-500 mt-2">Check back soon — we're cooking up something epic.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  className="rounded-[20px] shadow-xl border border-black/5 bg-white overflow-hidden flex flex-col"
                >
                  <div className="relative w-full aspect-[16/9] bg-nerdGray">
                    {ev.banner_url ? (
                      <img src={ev.banner_url} alt={ev.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-nerdBlue/10 to-nerdLime/10">
                        <Calendar className="w-10 h-10 text-nerdBlue/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-black leading-tight">{ev.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 text-sm mt-2">
                      {ev.date && (
                        <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" />{ev.date}</span>
                      )}
                      {ev.location && (
                        <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{ev.location}</span>
                      )}
                    </div>
                    {ev.rsvp_link && (
                      <a
                        href={ev.rsvp_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center justify-center gap-2 bg-nerdBlue text-white font-bold px-5 py-2.5 rounded-xl hover:bg-nerdDark transition-all text-sm w-fit"
                      >
                        RSVP
                        <ArrowUpRight size={16} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. ABOUT US ── */}
      <Section
        title={content?.about_title || 'About Us'}
        text={content?.about_text}
        image={content?.about_image}
      />

      {/* ── 4. HOW WE GATHER ── */}
      <Section
        title={content?.gather_title || 'How We Gather'}
        text={content?.gather_text}
        image={content?.gather_image}
      />

      {/* ── 5. OUR VALUES ── */}
      <Section
        title={content?.values_title || 'Our Values'}
        text={content?.values_text}
        image={content?.values_image}
      />

      {/* ── SUBCHAPTERS ── */}
      {subs.length > 0 && (
        <section className="py-12 md:py-16 px-4 md:px-8 bg-nerdGray/40">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">Subchapters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subs.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  className="rounded-[20px] shadow-xl border border-black/5 bg-white overflow-hidden flex flex-col"
                >
                  <div className="relative w-full aspect-[16/9] bg-nerdGray">
                    {sub.banner_url ? (
                      <img src={sub.banner_url} alt={sub.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-nerdBlue/10 to-nerdLime/10">
                        <MapPin className="w-10 h-10 text-nerdBlue/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-black leading-tight">{sub.name}</h3>
                    {sub.lead && <p className="text-sm text-nerdBlue font-medium mt-0.5">Lead: {sub.lead}</p>}
                    {sub.location && (
                      <p className="inline-flex items-center gap-1.5 text-gray-500 text-sm mt-2">
                        <MapPin className="w-4 h-4" />{sub.location}
                      </p>
                    )}
                    <p className="inline-flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                      <Users className="w-4 h-4" />{sub.member_count ?? 0} members
                    </p>
                    <a
                      href={normalizeUrl(sub.join_link || joinCommunityLink || 'https://discord.gg/nerdsroom')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-2 bg-nerdLime text-nerdBlue font-black px-5 py-2.5 rounded-xl hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-sm w-fit"
                    >
                      Join Our Chapter
                      <ArrowUpRight size={16} />
                    </a>
                    {subEvents(sub.id).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Upcoming Events</p>
                        <div className="space-y-2">
                          {subEvents(sub.id).map((ev: any) => (
                            <div key={ev.id} className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-black truncate">{ev.title}</p>
                                {ev.date && <p className="text-xs text-gray-500 inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{ev.date}</p>}
                              </div>
                              {ev.rsvp_link && (
                                <a href={ev.rsvp_link} target="_blank" rel="noopener noreferrer" className="shrink-0 text-nerdBlue text-xs font-bold hover:underline">RSVP</a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-10 px-4 text-center">
        <button
          onClick={() => navigate('/chapters')}
          className="inline-flex items-center gap-2 bg-nerdBlue text-white font-bold px-6 py-3 rounded-xl hover:bg-nerdDark transition-all text-sm uppercase tracking-wide"
        >
          <ArrowLeft size={16} />
          Back to Chapters
        </button>
      </section>

      <Footer />
    </div>
  );
};

const Section = ({ title, text, image }: { title: string; text?: string; image?: string }) => (
  <section className="py-12 md:py-16 px-4 md:px-8">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true, margin: '-80px' }}
        className="rounded-[24px] shadow-xl border border-black/5 bg-white p-8 md:p-10 flex flex-col gap-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-black">{title}</h2>
        {text && <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">{text}</p>}
        {image && (
          <img src={image} alt={title} className="w-full rounded-2xl object-cover max-h-[420px]" />
        )}
      </motion.div>
    </div>
  </section>
);

export default ChapterDetailPage;
