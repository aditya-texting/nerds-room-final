import { useState, useEffect } from 'react';
import App from './App';
import NotFound from './NotFound';
import AdminPanel from './components/AdminPanel';
import AdminDashboard from './components/AdminDashboard';
import AdminEventForm from './components/AdminEventForm';
import EventsPage from './components/EventsPage';
import EventDetailPage from './components/EventDetailPage.tsx';
import ChaptersPage from './components/ChaptersPage';
import ChapterDetailPage from './components/ChapterDetailPage';
import LoginPage from './components/LoginPage';
import { useAppData } from './context/AppDataContext';
import GlobalLoadingScreen from './components/GlobalLoadingScreen';
import OfflineOverlay from './components/OfflineOverlay';
import OnboardingModal from './components/OnboardingModal';
import { useAuth } from './context/AuthContext';

const MainContent = () => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const { loading } = useAppData();
    const { user, loading: authLoading } = useAuth();
    const [bootTimeout, setBootTimeout] = useState(false);

    useEffect(() => {
        console.log('[NerdsRoom] App Initialized. Path:', window.location.pathname);
        console.log('[NerdsRoom] Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'MISSING');

        // Safety timeout for the loader
        const timer = setTimeout(() => {
            setBootTimeout(true);
        }, 10000);

        const handleLocationChange = () => {
            setCurrentPath(window.location.pathname);

            if (window.location.hash) {
                setTimeout(() => {
                    const id = window.location.hash.substring(1);
                    const element = document.getElementById(id);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 400);
            } else {
                window.scrollTo(0, 0);
            }
        };

        window.addEventListener('popstate', handleLocationChange);
        window.addEventListener('pushstate', handleLocationChange);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('popstate', handleLocationChange);
            window.removeEventListener('pushstate', handleLocationChange);
        };
    }, []);

    if (currentPath === '/login') return <LoginPage />;
    if (currentPath === '/partner') return <NotFound />;
    if (currentPath === '/admin_aditya004') return <AdminPanel />;
    if (currentPath === '/nerdsroom/admin/dashboard/events/create' || currentPath === '/nerdsroom/admin/dashboard/events/edit') {
        if (authLoading) return <GlobalLoadingScreen />;
        if (!user) return <LoginPage />;
        if (user.role !== 'ADMIN') return <NotFound />;
        return <AdminEventForm />;
    }
    if (currentPath === '/nerdsroom/admin/dashboard/events' || currentPath === '/nerdsroom/admin/dashboard') {
        if (authLoading) return <GlobalLoadingScreen />;
        if (!user) return <LoginPage />;
        if (user.role !== 'ADMIN') return <NotFound />;
        return <AdminDashboard />;
    }
    if (currentPath === '/chapters') return <ChaptersPage />;
    if (currentPath.startsWith('/chapters/')) return <ChapterDetailPage />;
    if (currentPath.startsWith('/events/') && currentPath.split('/').length === 3) return <EventDetailPage />;
    if (currentPath === '/hackathons' || currentPath === '/workshops' || currentPath === '/events' || currentPath.startsWith('/hackathons/') || currentPath.startsWith('/workshops/') || currentPath.startsWith('/other-events/')) return <EventsPage />;

    return (
        <>
            <OfflineOverlay />
            <OnboardingModal />
            {loading && !bootTimeout && (
                <div className="fixed inset-0 z-[50]">
                    <GlobalLoadingScreen />
                </div>
            )}
            <App />
        </>
    );
};

export default MainContent;
