import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Search, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../context/AuthContext';

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isFeatured, setIsFeatured] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [locationType, setLocationType] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('all');

    // Hero bg cycling
    const heroBgs = ['/hackathon.png', '/hackathon-hero.jpg'];
    const [heroBgIdx, setHeroBgIdx] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setHeroBgIdx(i => (i + 1) % heroBgs.length), 5000);
        return () => clearInterval(t);
    }, []);
    
    // Pagination
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Featured slider
    const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
    const [sliderIndex, setSliderIndex] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchCategories = async () => {
            try {
                const resCats = await api.get('/events/categories');
                if (resCats.data) setCategories(resCats.data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/events/featured');
                if (res.data) setFeaturedEvents(res.data);
            } catch (err) {
                console.error("Failed to fetch featured events", err);
            }
        };
        fetchCategories();
        fetchFeatured();

        // Auto-advance slider
        const interval = setInterval(() => {
            setSliderIndex(prev => (featuredEvents.length > 0 ? (prev + 1) % featuredEvents.length : 0));
        }, 4000);
        return () => clearInterval(interval);
    }, [featuredEvents.length]);

    // Reset page to 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [search, selectedCategory, isFeatured, sortBy, locationType, dateFilter]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (page === 1) setLoading(true);
            else setIsLoadingMore(true);

            try {
                const limit = 10;
                const params = new URLSearchParams({
                    status: 'PUBLISH',
                    eventType: 'PUBLIC',
                    page: page.toString(),
                    limit: limit.toString()
                });
                if (search) params.append('search', search);
                if (selectedCategory) params.append('categoryId', selectedCategory);
                if (isFeatured) params.append('isFeatured', 'true');
                if (sortBy) params.append('sortBy', sortBy);
                if (locationType && locationType !== 'ALL') params.append('locationType', locationType);
                if (dateFilter !== 'all') params.append('dateFilter', dateFilter);
                
                const resEvents = await api.get(`/events?${params.toString()}`);
                if (resEvents.data) {
                    if (page === 1) {
                        setEvents(resEvents.data);
                    } else {
                        setEvents(prev => [...prev, ...resEvents.data]);
                    }
                    setHasMore(resEvents.data.length === limit);
                }
            } catch (err) {
                console.error("Failed to fetch events", err);
            } finally {
                setLoading(false);
                setIsLoadingMore(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, selectedCategory, isFeatured, sortBy, locationType, dateFilter, page]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-28 pb-16 overflow-hidden z-0" style={{ minHeight: '420px' }}>
                {/* Cycling background images */}
                {heroBgs.map((bg, i) => (
                    <div
                        key={bg}
                        className="absolute inset-0 w-full h-full transition-opacity duration-1000 scale-105 blur-sm"
                        style={{
                            opacity: i === heroBgIdx ? 1 : 0,
                            backgroundImage: `url(${bg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            zIndex: 0,
                        }}
                    />
                ))}
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/75 z-[1]" />
                {/* Subtle grid on top */}
                <div className="absolute inset-0 opacity-0 z-[2] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 pt-8">
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            Live Events &amp; Opportunities
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight"
                        >
                            Build. Compete.
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">Break Limits.</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/75 text-base mb-8 max-w-lg mx-auto lg:mx-0"
                        >
                            Hackathons, startup challenges, workshops &amp; more — curated for the builders, dreamers and doers of tomorrow.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 max-w-xl mx-auto lg:mx-0"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search programs, hackathons..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 rounded-xl border-0 shadow-md focus:ring-2 focus:ring-white/70 outline-none text-sm text-gray-900 bg-white"
                                />
                            </div>
                        </motion.div>
                    </div>

                    <div className="hidden lg:block w-full lg:w-1/2">
                        {featuredEvents.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-full max-w-lg ml-auto relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/9]"
                            >
                                {featuredEvents.map((fe, idx) => (
                                    <div
                                        key={fe.id}
                                        className={`absolute inset-0 transition-opacity duration-700 cursor-pointer ${idx === sliderIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} onClick={() => { window.history.pushState({}, '', `/events/${fe.slug || fe.id}`); window.dispatchEvent(new Event('pushstate')); }} role="link" tabIndex={idx === sliderIndex ? 0 : -1}
                                    >
                                        <img
                                            src={fe.imageUrl || `https://picsum.photos/seed/${fe.id}/800/450`}
                                            alt={fe.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-5">
                                            <span className="inline-block bg-nerdBlue text-white text-xs font-bold px-2.5 py-1 rounded-md mb-2">Featured</span>
                                            <h3 className="text-white font-bold text-lg leading-tight mb-1">{fe.name}</h3>
                                            <div className="flex items-center gap-4 text-white/75 text-xs">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{fe.location || 'Virtual'}</span>
                                                <span>{new Date(fe.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* Slider controls */}
                                <button onClick={() => setSliderIndex(p => (p - 1 + featuredEvents.length) % featuredEvents.length)} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-1.5 transition-all">
                                    <ChevronLeft className="w-4 h-4 text-white" />
                                </button>
                                <button onClick={() => setSliderIndex(p => (p + 1) % featuredEvents.length)} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-1.5 transition-all">
                                    <ChevronRight className="w-4 h-4 text-white" />
                                </button>
                                {/* Dots */}
                                <div className="absolute bottom-14 right-4 z-20 flex gap-1.5">
                                    {featuredEvents.map((_, idx) => (
                                        <button key={idx} onClick={() => setSliderIndex(idx)} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === sliderIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-full max-w-lg ml-auto rounded-2xl shadow-md aspect-[16/9] bg-white/10 border border-white/10 overflow-hidden flex items-center justify-center"
                            >
                                <div className="flex flex-col items-center gap-3 text-white/40">
                                    <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
                                    <span className="text-sm">Loading featured events...</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* PROGRAMS SECTION */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10 -mt-8 relative z-20">
                <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 gap-4 overflow-hidden">
                    {/* Categories Scrollable Row */}
                    <div className="w-full sm:flex-1 flex flex-wrap gap-2 items-center min-w-0">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                                selectedCategory === null
                                ? 'bg-nerdBlue text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                                    selectedCategory === cat.id
                                    ? 'bg-nerdBlue text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Right side controls: Featured & Sort */}
                    <div className="w-full sm:w-auto flex flex-wrap gap-2 items-center shrink-0 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4">
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className='bg-white text-gray-700 text-sm font-medium border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-nerdBlue/20'
                        >
                            <option value='all'>All Events</option>
                            <option value='upcoming'>Upcoming Events</option>
                            <option value='past'>Past Events</option>
                        </select>
                        <button 
                            onClick={() => setIsFeatured(!isFeatured)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                                isFeatured 
                                ? 'bg-nerdBlue text-white' 
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            Featured Programs
                        </button>
                        <select 
                            value={locationType}
                            onChange={(e) => { setLocationType(e.target.value); setPage(1); }}
                            className="flex-1 min-w-[130px] bg-white text-gray-700 text-sm font-medium border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-nerdBlue/20"
                        >
                            <option value="ALL">All Venues</option>
                            <option value="ONLINE">Online</option>
                            <option value="OFFLINE">Offline</option>
                            <option value="HYBRID">Hybrid</option>
                        </select>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 min-w-[130px] bg-white text-gray-700 text-sm font-medium border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-nerdBlue/20"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
                                <div className="aspect-[16/9] bg-gray-200 animate-pulse"></div>
                                <div className="p-4 flex-1 flex flex-col gap-3">
                                    <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {events.map((event) => {
                            const now = new Date();
                            const startDate = new Date(event.startDate);
                            const endDate = new Date(event.endDate);
                            
                            let eventStatus = 'Upcoming';
                            let statusColor = 'bg-yellow-100 text-yellow-800';
                            
                            if (now >= startDate && now <= endDate) {
                                eventStatus = 'Live';
                                statusColor = 'bg-green-100 text-green-800';
                            } else if (now > endDate) {
                                eventStatus = 'Closed';
                                statusColor = 'bg-gray-100 text-gray-800';
                            }

                            // Mock registrations based on id length or name hash for consistency
                            const registeredCount = (event.name.length * 13 + 42) % 300;

                            return (
                            <div key={event.id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col hover:shadow-xl hover:border-gray-300 transition-all">
                                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                                        {event.isFeatured && (
                                            <span className="bg-nerdBlue text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                                                Featured
                                            </span>
                                        )}
                                        <span className={`${statusColor} text-xs font-bold px-2.5 py-1 rounded-md shadow-sm`}>
                                            {eventStatus}
                                        </span>
                                    </div>
                                    {/* Location type badge - top right */}
                                    <div className="absolute top-3 right-3 z-10">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md shadow-sm ${
                                            event.locationType === 'ONLINE' ? 'bg-blue-100 text-blue-800' :
                                            event.locationType === 'OFFLINE' ? 'bg-orange-100 text-orange-800' :
                                            'bg-purple-100 text-purple-800'
                                        }`}>
                                            {event.locationType || 'Online'}
                                        </span>
                                    </div>
                                    <img 
                                        src={event.imageUrl || `https://picsum.photos/seed/${event.id}/600/400`} 
                                        alt={event.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-nerdBlue transition-colors">
                                        {event.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                                        {event.subtitle || event.description}
                                    </p>
                                    
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                                            <span className="truncate">
                                                {event.locationType === 'ONLINE' ? 'Virtual / Online' : `Venue: ${event.location || 'TBD'}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                            <Users className="w-4 h-4 text-gray-400 shrink-0" />
                                            <span>{registeredCount} Registrations</span>
                                            {/* Team badge */}
                                            <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                                                event.teamType === 'INDIVIDUAL'
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : event.teamType === 'BOTH'
                                                    ? 'bg-purple-50 text-purple-700'
                                                    : 'bg-green-50 text-green-700'
                                            }`}>
                                                {event.teamType === 'INDIVIDUAL'
                                                    ? 'Individual'
                                                    : event.teamType === 'BOTH'
                                                    ? `Team (${event.minTeamSize}–${event.maxTeamSize})`
                                                    : `Team ${event.minTeamSize}–${event.maxTeamSize}`}
                                            </span>
                                        </div>
                                        
                                        <a href={`/events/${event.slug || event.id}`} className="mt-2 block w-full text-center bg-gray-50 hover:bg-nerdBlue hover:text-white text-nerdBlue border border-gray-100 py-2 rounded-xl font-semibold transition-colors text-sm">
                                            View Details
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )})}
                        {events.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No programs found</h3>
                                <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                        )}
                    </div>
                )}

                {!loading && events.length > 0 && hasMore && (
                    <div className="flex justify-center mt-12 mb-4">
                        <button 
                            onClick={() => setPage(p => p + 1)}
                            disabled={isLoadingMore}
                            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
                        >
                            {isLoadingMore ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    Loading...
                                </>
                            ) : 'Load More Events'}
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
