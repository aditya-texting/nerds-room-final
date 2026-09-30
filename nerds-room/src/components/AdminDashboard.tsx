import { useEffect, useState } from 'react';
import { CalendarDays, FolderKanban, Home, LogOut, Search, Users } from 'lucide-react';
import { api, useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [section, setSection] = useState(window.location.pathname.endsWith('/events') ? 'Events' : 'Home');
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [eventType, setEventType] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [location, setLocation] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('all');
  const [featured, setFeatured] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => { api.get('/events/categories').then(({ data }) => setCategories(data || [])).catch(console.error); }, []);
  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(pageSize), sortBy, includeDrafts: 'true' });
    if (query) params.set('search', query);
    if (status !== 'ALL') params.set('status', status);
    if (eventType !== 'ALL') params.set('eventType', eventType);
    if (category !== 'ALL') params.set('categoryId', category);
    if (location !== 'ALL') params.set('locationType', location);
    if (dateFilter !== 'all') params.set('dateFilter', dateFilter);
    if (featured === 'true') params.set('isFeatured', 'true');
    api.get(`/events?${params}`).then(({ data }) => setEvents((current) => page === 1 ? (data || []) : [...current, ...(data || [])])).catch(console.error);
  }, [page, query, status, eventType, category, location, dateFilter, featured, sortBy]);

  const nav = [{ label: 'Home', icon: Home }, { label: 'Events', icon: CalendarDays }, { label: 'Categories', icon: FolderKanban }, { label: 'Users', icon: Users }];
  const goPublicEvents = () => { window.history.pushState({}, '', '/events'); window.dispatchEvent(new Event('pushstate')); };

  return <div className="min-h-screen bg-slate-50 flex text-slate-900">
    <aside className="w-64 shrink-0 bg-slate-950 text-white p-4 flex flex-col"><div className="px-3 py-4 text-xl font-black text-nerdLime">nerds room.</div><nav className="space-y-1 mt-4">{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => { if (label === 'Events') { window.history.pushState({}, '', '/nerdsroom/admin/dashboard/events'); window.dispatchEvent(new Event('pushstate')); } setSection(label); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-left ${section === label ? 'bg-nerdBlue text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}><Icon size={18} />{label}</button>)}</nav><button onClick={signOut} className="mt-auto flex items-center gap-3 px-3 py-3 text-sm text-slate-400 hover:text-white"><LogOut size={18} />Sign out</button></aside>
    <main className="flex-1 min-w-0 p-6 lg:p-10"><header className="flex flex-wrap items-center justify-between gap-4 mb-8"><div><p className="text-sm text-slate-500">Admin workspace</p><h1 className="text-3xl font-black">{section}</h1></div><p className="text-sm text-slate-500">{user?.email}</p></header>
      {section === 'Events' ? <>
        <div className="flex flex-wrap gap-3 mb-6"><label className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-[220px]"><Search size={16} className="text-slate-400" /><input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search events" className="outline-none w-full text-sm" /></label><select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm"><option value="ALL">All statuses</option><option value="PUBLISH">Published</option><option value="DRAFT">Draft</option></select><select value={eventType} onChange={(e) => { setEventType(e.target.value); setPage(1); }} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm"><option value="ALL">All visibility</option><option value="PUBLIC">Public</option><option value="PRIVATE">Private</option></select><select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm"><option value="ALL">All categories</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm"><option value="ALL">All venues</option><option value="ONLINE">Online</option><option value="OFFLINE">Offline</option><option value="HYBRID">Hybrid</option></select><select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm"><option value="all">All dates</option><option value="upcoming">Upcoming</option><option value="past">Past</option></select><select value={featured} onChange={(e) => { setFeatured(e.target.value); setPage(1); }} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm"><option value="ALL">All programs</option><option value="true">Featured only</option></select><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select><button onClick={() => { window.history.pushState({}, '', '/nerdsroom/admin/dashboard/events/create'); window.dispatchEvent(new Event('pushstate')); }} className="bg-nerdBlue text-white rounded-xl px-4 py-2 text-sm font-bold">Create Event</button><button onClick={goPublicEvents} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold">Open public events</button></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">{events.map((event) => <article key={event.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"><img src={event.imageUrl || `https://picsum.photos/seed/${event.id}/600/320`} alt={event.name} className="w-full aspect-video object-cover" /><div className="p-5"><div className="flex items-center justify-between gap-2"><h2 className="font-bold truncate">{event.name}</h2><span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100">{event.status} / {event.eventType}</span></div><p className="text-sm text-slate-500 mt-2 line-clamp-2">{event.subtitle || event.description}</p><div className="flex gap-3 mt-4"><a href={`/events/${event.slug || event.id}`} className="text-sm font-bold text-nerdBlue">View details</a><button onClick={() => { window.history.pushState({}, "", `/nerdsroom/admin/dashboard/events/edit?id=${event.id}`); window.dispatchEvent(new Event("pushstate")); }} className="text-sm font-bold text-slate-500">Edit</button><button onClick={async () => { if (!window.confirm("Delete this event and all related registrations, teams and content?")) return; await api.delete(`/events/admin/${event.id}`); setEvents((current) => current.filter((item) => item.id !== event.id)); }} className="text-sm font-bold text-red-600">Delete</button></div></div></article>)}</div><div className="flex justify-center mt-8"><button disabled={events.length < page * pageSize} onClick={() => setPage((current) => current + 1)} className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-sm font-bold disabled:opacity-40">{events.length < page * pageSize ? "No more events" : "Load more"}</button></div>
      </> : <div className="bg-white rounded-2xl border border-slate-200 p-10"><h2 className="text-xl font-bold">{section}</h2><p className="text-slate-500 mt-2">This section is ready for the next admin module.</p></div>}
    </main></div>;
}