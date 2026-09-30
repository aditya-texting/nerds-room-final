import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { Calendar } from 'lucide-react';

const HackathonsPage = () => {
  const { navigate } = useAppData();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20 text-center">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-12 h-12 text-slate-200" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Hackathons Page</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">This page has been redirected to the unified events calendar.</p>
        <button 
          onClick={() => navigate('/events')}
          className="bg-nerdBlue text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-nerdDark transition-all"
        >
          View Events Calendar
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default HackathonsPage;
