import { useEffect, useRef, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';

const Workshops = () => {
    const { workshops, loading, navigate } = useAppData();
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const publicWorkshops = workshops.filter(w => w.is_public !== false);

    if (loading) {
        return (
            <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <Skeleton className="h-6 w-32 mx-auto mb-4" />
                        <Skeleton className="h-12 w-96 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-[450px] w-full rounded-[32px]" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (publicWorkshops.length === 0) return null;

    return (
        <section ref={sectionRef} id="workshops" className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <span className="text-nerdLime font-black tracking-widest text-xs uppercase mb-3 block">SKILL UP</span>
                    <h2 className="text-4xl md:text-6xl font-black text-nerdBlue tracking-tight">
                        UPCOMING <span className="text-black">WORKSHOPS</span>
                    </h2>
                    <p className="text-gray-500 font-medium mt-4 max-w-2xl mx-auto">
                        Hands-on learning sessions led by industry experts to help you master the latest tech stacks.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {publicWorkshops.map((workshop, idx) => (
                        <div
                            key={workshop.id}
                            className={`group bg-white rounded-[32px] overflow-hidden border-2 border-gray-100 hover:border-nerdLime/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                            style={{ transitionDelay: `${idx * 150}ms` }}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={workshop.image_url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800'}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={workshop.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                {workshop.is_featured && (
                                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-yellow-400 text-black font-black text-[10px] px-3 py-1.5 rounded-full shadow-lg">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        FEATURED
                                    </div>
                                )}

                                <div className="absolute bottom-6 left-6 text-white">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-nerdLime">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {workshop.date}
                                    </div>
                                    <h3 className="text-xl font-black tracking-normal leading-snug">{workshop.title}</h3>
                                </div>
                            </div>

                            <div className="p-8">
                                <p className="text-gray-600 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                                    {workshop.description}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</span>
                                        <span className="text-sm font-bold text-nerdBlue">{workshop.location}</span>
                                    </div>

                                    {workshop.registration_link ? (
                                        <a
                                            href={workshop.registration_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-nerdBlue text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-black transition-all shadow-lg active:scale-95"
                                        >
                                            REGISTER
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-xs font-bold italic tracking-tighter">Registration Closed</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <button
                        onClick={() => navigate('/workshops')}
                        className="inline-flex items-center gap-2 bg-white text-nerdBlue border-2 border-nerdBlue px-8 py-4 rounded-2xl font-black text-sm hover:bg-nerdBlue hover:text-white transition-all shadow-xl active:scale-95 group"
                    >
                        VIEW ALL WORKSHOPS
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Workshops;
