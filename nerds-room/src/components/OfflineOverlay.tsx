import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineOverlay = () => {
    const [isOffline, setIsOffline] = useState(!window.navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-nerdLime/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <div className="relative w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-100">
                    <WifiOff size={48} className="text-nerdBlue animate-bounce" />
                </div>
            </div>

            <h1 className="text-4xl font-black text-nerdBlue mb-4 tracking-tight">
                CONNECTION LOST
            </h1>

            <p className="max-w-md text-slate-500 font-bold mb-8 leading-relaxed">
                Oops! It looks like you've been disconnected from the grid. check your internet and we'll bring you back as soon as you're online.
            </p>

            <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Waiting for network...
                </span>
            </div>
        </div>
    );
};

export default OfflineOverlay;
