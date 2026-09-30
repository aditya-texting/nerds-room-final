import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';

const OtherEventDetailPage = () => {
    const { otherEvents, navigate, loading: contextLoading } = useAppData();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const slug = decodeURIComponent(window.location.pathname.split('/').pop() || '');

    useEffect(() => {
        if (!contextLoading) {
            const found = otherEvents.find((e: any) =>
                e.slug === slug || e.slug?.toLowerCase() === slug.toLowerCase()
            );
            setEvent(found || null);
            setLoading(false);
        }
    }, [otherEvents, slug, contextLoading]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (event?.title) document.title = `${event.title} | Nerds Room`;
    }, [event]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-[1140px] mx-auto px-4 pt-24 space-y-8">
                    <div className="h-[300px] bg-slate-100 rounded-[3rem] animate-pulse" />
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Event Not Found</h1>
                    <button
                        onClick={() => navigate('/events')}
                        className="px-8 py-3 bg-nerdBlue text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-nerdDark transition-all"
                    >
                        Back to Events
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
                <h1 className="text-4xl font-black text-slate-900 mb-6">{event.title}</h1>
                <p className="text-slate-600 mb-8">{event.description}</p>
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

export default OtherEventDetailPage;
