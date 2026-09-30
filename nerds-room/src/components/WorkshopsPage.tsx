import { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { Calendar, MapPin, Users, Ticket, ArrowRight } from 'lucide-react';

const WorkshopsPage = () => {
    const { workshops: dbWorkshops, navigate } = useAppData();
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const workshops = useMemo(() => {
        return dbWorkshops
            .filter(w => w.is_public !== false)
            .sort((a, b) => {
                if (a.is_featured && !b.is_featured) return -1;
                if (!a.is_featured && b.is_featured) return 1;
                return 0;
            });
    }, [dbWorkshops]);

    const [search, setSearch] = useState('');
    const [statusFilters, setStatusFilters] = useState<{ upcoming: boolean; ended: boolean }>({
        upcoming: false,
        ended: false,
    });
    const [locationFilters, setLocationFilters] = useState<{ online: boolean; inPerson: boolean }>({
        online: false,
        inPerson: false,
    });

    const filteredWorkshops = useMemo(() => {
        return workshops.filter((workshop) => {
            const matchesSearch =
                !search ||
                workshop.title.toLowerCase().includes(search.toLowerCase()) ||
                workshop.description.toLowerCase().includes(search.toLowerCase());

            const isUpcoming = new Date(workshop.date) >= new Date();
            const matchesStatus =
                (!statusFilters.upcoming && !statusFilters.ended) ||
                (statusFilters.upcoming && isUpcoming) ||
                (statusFilters.ended && !isUpcoming);

            const isOnline = workshop.location.toLowerCase().includes('online');
            const matchesLocation =
                (!locationFilters.online && !locationFilters.inPerson) ||
                (locationFilters.online && isOnline) ||
                (locationFilters.inPerson && !isOnline);

            return matchesSearch && matchesStatus && matchesLocation;
        });
    }, [workshops, search, statusFilters, locationFilters]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        cardRefs.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => {
            cardRefs.current.forEach((card) => {
                if (card) observer.unobserve(card);
            });
        };
    }, [filteredWorkshops]);

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <Navbar />

            {/* Hero Section */}
            <header
                className="relative pt-32 lg:pt-48 pb-20 lg:pb-32 px-4 sm:px-6 md:px-8 overflow-hidden bg-nerdBlue"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-nerdBlue/80 via-nerdBlue/50 to-white"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-[1.1] drop-shadow-2xl">
                        LEARN. BUILD. <br />
                        <span className="text-nerdLime">MASTER.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-white text-base md:text-lg mb-10 font-bold leading-relaxed drop-shadow-md">
                        Master cutting-edge tech through hands-on workshops led by elite industry experts. From zero to production-ready skills.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-lg mx-auto">
                        <div className="relative flex-1 w-full group">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search workshops, stacks, or topics..."
                                className="w-full px-5 py-4 pl-12 rounded-2xl border-none bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-nerdLime/30 shadow-2xl transition-all font-semibold text-sm placeholder:text-slate-400"
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nerdBlue transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            {/* Action Bar */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-[72px] z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-3">
                    <div className="flex items-center gap-4 justify-between overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setStatusFilters(prev => ({ ...prev, upcoming: !prev.upcoming }))}
                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${statusFilters.upcoming ? 'bg-nerdLime text-nerdBlue border-nerdLime shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100'}`}
                            >
                                ● Upcoming
                            </button>
                            <button
                                onClick={() => setLocationFilters(prev => ({ ...prev, online: !prev.online }))}
                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${locationFilters.online ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100'}`}
                            >
                                🌐 Online
                            </button>
                            <div className="h-6 w-px bg-slate-200"></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tight whitespace-nowrap">
                                <span className="text-slate-900">{filteredWorkshops.length}</span> Sessions FOUND
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workshops Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredWorkshops.map((workshop, index) => {
                        return (
                            <div
                                key={workshop.id}
                                ref={(el) => { cardRefs.current[index] = el; }}
                                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-nerdLime hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col opacity-0 translate-y-10 [&.visible]:opacity-100 [&.visible]:translate-y-0"
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                {/* Cover Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={workshop.image_url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800'}
                                        alt={workshop.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-nerdDark/90 via-nerdDark/20 to-transparent"></div>

                                    {workshop.is_featured && (
                                        <div className="absolute top-6 left-6 flex items-center gap-2 bg-nerdLime text-nerdBlue font-black text-[10px] px-3 py-1.5 rounded-full shadow-xl">
                                            <Trophy size={12} fill="currentColor" />
                                            FEATURED
                                        </div>
                                    )}

                                    <div className="absolute bottom-6 left-6 text-white pr-6">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-nerdLime">
                                            <Calendar size={12} strokeWidth={3} />
                                            {workshop.date}
                                        </div>
                                        <h3 className="text-2xl font-black tracking-normal leading-snug group-hover:text-nerdLime transition-colors">{workshop.title}</h3>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                                        {workshop.description}
                                    </p>

                                    <div className="space-y-4 pt-6 border-t border-slate-50 mt-auto">
                                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <MapPin size={14} className="text-nerdBlue" />
                                                <span>{workshop.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Users size={14} className="text-nerdBlue" />
                                                <span>{workshop.attendees_count || 0}+ Learners</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/workshops/${workshop.slug}`)}
                                            className="w-full bg-nerdBlue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-nerdBlue/20 hover:bg-nerdLime hover:text-nerdBlue transition-all active:scale-[0.98] group/btn"
                                        >
                                            View Details
                                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredWorkshops.length === 0 && (
                    <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Ticket size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No Workshops Found</h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto">Try adjusting your filters or search keywords to find what you're looking for.</p>
                        <button
                            onClick={() => { setSearch(''); setStatusFilters({ upcoming: false, ended: false }); setLocationFilters({ online: false, inPerson: false }); }}
                            className="mt-8 text-nerdBlue font-black uppercase text-xs tracking-widest hover:underline"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </main>

            {/* Newsletter / CTA */}
            <section className="bg-nerdDark py-24 px-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nerdBlue/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-nerdLime/10 rounded-full blur-[120px] -ml-64 -mb-64"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        WANT TO HOST A <span className="text-nerdLime">WORKSHOP?</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 font-medium max-w-2xl mx-auto">
                        Share your expertise with thousands of eager builders. Join our elite circle of mentors and lead the next generation of tech talent.
                    </p>
                    <a
                        href="/partner"
                        onClick={(e) => { e.preventDefault(); navigate('/partner'); }}
                        className="inline-flex items-center gap-3 bg-white text-nerdBlue px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-nerdLime transition-all shadow-2xl active:scale-95"
                    >
                        Apply as Mentor
                        <ArrowRight size={18} />
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

// Placeholder for Trophy icon if not imported from lucide
const Trophy = ({ size, fill, className }: { size?: number, fill?: string, className?: string }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 22V18" />
        <path d="M14 22V18" />
        <path d="M18 4H6v7a6 6 0 0 0 12 0V4Z" />
    </svg>
);

export default WorkshopsPage;
