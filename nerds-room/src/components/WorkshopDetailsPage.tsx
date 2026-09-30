import { useMemo } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';

const WorkshopDetailsPage = () => {
    const { workshops: dbWorkshops, loading, navigate } = useAppData();

    const slug = useMemo(() => window.location.pathname.split('/').pop() || '', []);

    const workshop = useMemo(() => {
        return dbWorkshops.find(w => w.slug === slug) || null;
    }, [dbWorkshops, slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="h-[400px] bg-slate-50 animate-pulse" />
            </div>
        );
    }

    if (!workshop) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Workshop Not Found</h1>
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
                <h1 className="text-4xl font-black text-slate-900 mb-6">{workshop.title}</h1>
                <p className="text-slate-600 mb-8">{workshop.description}</p>
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

export default WorkshopDetailsPage;
