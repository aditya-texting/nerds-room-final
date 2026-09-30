import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Clock, ExternalLink, ChevronDown, ChevronUp, Award, Layers, Link2, ArrowLeft } from 'lucide-react';
import { api, useAuth } from '../context/AuthContext';
import DOMPurify from 'dompurify';
import { format, formatDistanceToNow } from 'date-fns';

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('pushstate'));
}

function getSlug() {
  const parts = window.location.pathname.split('/');
  return parts[parts.length - 1];
}

function StatusBadge({ startDate, endDate }: { startDate: string; endDate: string }) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now >= start && now <= end) return (
    <span className="flex items-center gap-1.5 bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      Live Now
    </span>
  );
  if (now > end) return (
    <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-sm font-semibold px-3 py-1 rounded-full">
      Closed
    </span>
  );
  return (
    <span className="flex items-center gap-1.5 bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full">
      <Clock className="w-3.5 h-3.5" />
      {formatDistanceToNow(start, { addSuffix: true })}
    </span>
  );
}

function getTimelineState(startDate: string, endDate: string) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return 'upcoming';
  if (now <= end) return 'active';
  return 'completed';
}

export default function EventDetailPage() {
  const slug = getSlug();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [registrationState, setRegistrationState] = useState<'idle' | 'registered'>('idle');
  const [teamInfo, setTeamInfo] = useState<any>(null);
  const [teamDetails, setTeamDetails] = useState<any>(null);
  const [teamMode, setTeamMode] = useState<'create' | 'join' | null>(null);
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<any>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { user } = useAuth();

  const loadTeam = async () => { if (!user) return; try { const { data } = await api.get('/events/' + slug + '/team'); if (data.team) { setTeamInfo(data.team); setTeamDetails(data); } } catch {} };
  const confirmRemoveMember = async () => { if (!teamInfo?.id || !removeTarget) return; await api.post('/events/' + slug + '/team/' + teamInfo.id + '/remove/' + removeTarget.userId); setRemoveTarget(null); await loadTeam(); };

  const submitTeam = () => { if (teamInfo?.id) setShowSubmitConfirm(true); };
  const confirmSubmitTeam = async () => { if (!teamInfo?.id) return; setShowSubmitConfirm(false); setSubmitLoading(true); try { const { data } = await api.post('/events/' + slug + '/team/' + teamInfo.id + '/submit', {}); setTeamDetails((current: any) => ({ ...current, submission: data.submission })); } finally { setSubmitLoading(false); } };

  const loadRegistration = async () => {
    if (!user) return;
    try {
      const { data } = await api.get(`/events/${slug}/registration`);
      if (data?.id || data?.registration || data?.registered) {
        setRegistrationState('registered');
        if (data.teamId) setTeamInfo(data);
      }
    } catch {
      // The event can still be viewed when registration lookup is unavailable.
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return setActionError('Enter a team name.');
    setActionLoading(true); setActionError('');
    try {
      const { data } = await api.post(`/events/${slug}/teams`, { name: teamName.trim() });
      setTeamInfo(data.team); setTeamMode(null); setTeamName(''); await loadTeam();
    } catch (error: any) { setActionError(error.response?.data?.message || 'Could not create team.'); }
    finally { setActionLoading(false); }
  };

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) return setActionError('Enter an invite code.');
    setActionLoading(true); setActionError('');
    try {
      const { data } = await api.post(`/events/${slug}/teams/join`, { inviteCode: inviteCode.trim() });
      setTeamInfo(data.team); setTeamMode(null); setInviteCode(''); await loadTeam();
    } catch (error: any) { setActionError(error.response?.data?.message || 'Could not join team.'); }
    finally { setActionLoading(false); }
  };
  const handleRegister = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (event.lumaUrl) {
      window.open(event.lumaUrl, '_blank', 'noopener,noreferrer');
      setRegistrationState('registered');
      return;
    }    setShowRegisterConfirm(true);
  };

  const confirmRegistration = async () => {
    setShowRegisterConfirm(false);
    try {
      await api.post(`/events/${slug}/register`);
      setRegistrationState('registered');
      await loadRegistration();
    } catch (error) {
      console.error('Registration failed', error);
    }
  };
  useEffect(() => {
    if (user && event) { loadRegistration(); loadTeam(); }
  }, [user, event, slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetch = async () => {
      try {
        const res = await api.get(`/events/${slug}`);
        setEvent(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-nerdBlue/20 border-t-nerdBlue rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading event details...</p>
        </div>
      </div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/events')} className="px-6 py-2.5 bg-nerdBlue text-white font-semibold rounded-xl hover:bg-nerdBlue/90 transition">
            Browse Events
          </button>
        </div>
      </div>
    </div>
  );

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isMultiDay = format(startDate, 'yyyy-MM-dd') !== format(endDate, 'yyyy-MM-dd');
  const isRegistrationClosed = new Date() > endDate;

  const sections = ['overview', 'timeline', 'prizes', 'tracks', 'faqs'];
  const safeDescription = DOMPurify.sanitize(event.description || '');
  const eventProgress = Math.min(100, Math.max(0, ((Date.now() - startDate.getTime()) / Math.max(1, endDate.getTime() - startDate.getTime())) * 100));
  const timelineProgress = event.timelines?.length
    ? (event.timelines.reduce((total: number, timeline: any) => total + (getTimelineState(timeline.startDate, timeline.endDate) === 'completed' ? 1 : getTimelineState(timeline.startDate, timeline.endDate) === 'active' ? 0.5 : 0), 0) / event.timelines.length) * 100
    : eventProgress;
  const hasSections = {
    overview: true,
    timeline: event.timelines?.length > 0,
    prizes: event.prizes?.length > 0,
    tracks: event.tracks?.length > 0,
    faqs: event.faqs?.length > 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-20 pb-0 bg-black overflow-hidden">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center opacity-45 blur-sm"
          style={{ backgroundImage: `url(${event.imageUrl || `https://picsum.photos/seed/${event.id}/1400/800`})` }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 opacity-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-nerdBlue/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-700/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 relative z-10">
          {/* Back button */}
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left - Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {event.isFeatured && (
                  <span className="bg-nerdBlue text-white text-xs font-bold px-2.5 py-1 rounded-md">Featured</span>
                )}
                <StatusBadge startDate={event.startDate} endDate={event.endDate} />
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                  event.locationType === 'ONLINE' ? 'bg-blue-100 text-blue-800' :
                  event.locationType === 'OFFLINE' ? 'bg-orange-100 text-orange-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {event.locationType}
                </span>
                {event.categories?.map((cat: any) => (
                  <span key={cat.id} className="bg-white/10 text-white/80 text-xs font-medium px-2.5 py-1 rounded-md">{cat.name}</span>
                ))}
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight"
              >
                {event.name}
              </motion.h1>

              {event.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-white/70 text-lg mb-6 max-w-2xl"
                >
                  {event.subtitle}
                </motion.p>
              )}

              {/* Key details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-1"><Calendar className="w-3.5 h-3.5" /> Date</div>
                  <p className="text-white text-sm font-semibold">
                    {format(startDate, 'MMM d')}{isMultiDay ? ` - ${format(endDate, 'MMM d, yyyy')}` : `, ${format(startDate, 'yyyy')}`}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-1"><MapPin className="w-3.5 h-3.5" /> Venue</div>
                  {event.locationUrl ? <a href={event.locationUrl} target="_blank" rel="noopener noreferrer" className="text-white text-sm font-semibold hover:text-nerdLime transition-colors underline decoration-white/30 underline-offset-2">{event.locationType === 'ONLINE' ? 'Virtual' : (event.location || 'TBD')}</a> : <p className="text-white text-sm font-semibold">{event.locationType === 'ONLINE' ? 'Virtual' : (event.location || 'TBD')}</p>}
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-1"><Users className="w-3.5 h-3.5" /> Team</div>
                  <p className="text-white text-sm font-semibold">
                    {event.teamType === 'INDIVIDUAL' ? 'Individual' : `${event.minTeamSize}–${event.maxTeamSize} members`}
                  </p>
                </div>
                {event.registrationCount !== undefined && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 text-white/50 text-xs mb-1"><Users className="w-3.5 h-3.5" /> Registered</div>
                    <p className="text-white text-sm font-semibold">{event.registrationCount} participants</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Image */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl border border-white/10">
                <img
                  src={event.imageUrl || `https://picsum.photos/seed/${event.id}/600/450`}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky nav tabs */}
        <div className="relative z-10 border-t border-white/10 mt-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex gap-0 overflow-x-auto scrollbar-hide">
              {sections.filter(s => hasSections[s as keyof typeof hasSections]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setActiveSection(s);
                    document.getElementById(`section-${s}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-5 py-4 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors ${
                    activeSection === s
                      ? 'border-nerdBlue text-white'
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-8 order-2 lg:order-1">

          {/* Overview */}
          <section id="section-overview" className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About the Event</h2>
            <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: safeDescription }} />
          </section>

          {/* Timeline */}
          {event.timelines?.length > 0 && (
            <section id="section-timeline" className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-nerdBlue" />
                Timeline
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-1.5 bg-gray-200 rounded-full z-0"><div className="w-full bg-gradient-to-b from-nerdBlue via-blue-500 to-nerdLime rounded-full shadow-[0_0_12px_rgba(155,230,0,0.9)] transition-all duration-700 relative z-0" style={{ height: `${timelineProgress}%` }} /></div>
                <div className="flex flex-col gap-14">
                  {event.timelines.map((t: any, i: number) => {
                  const timelineState = getTimelineState(t.startDate, t.endDate);
                  return (
                    <div key={t.id || i} className="flex gap-4 pl-4 relative">
                      <div className="absolute left-0 top-4 z-20 w-8 h-8 bg-nerdBlue/10 border-2 border-nerdBlue/30 rounded-full flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-nerdBlue" />
                      </div>
                      <div className={`pl-12 pr-5 py-4 rounded-2xl border transition-all relative z-10 ${timelineState === 'active' ? 'bg-gradient-to-r from-nerdBlue/10 via-nerdLime/10 to-transparent border-nerdLime/70 shadow-[0_0_24px_rgba(155,230,0,0.28)] ring-1 ring-nerdLime/30' : 'bg-white border-gray-200 shadow-sm'}`}>
                        {t.title && <div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-gray-900">{t.title}</h3><span className="text-xs font-bold text-nerdBlue">{timelineState === 'active' ? 'Live now' : timelineState === 'completed' ? 'Completed' : 'Upcoming'}</span></div>}
                        <div className="prose prose-sm prose-slate max-w-none text-gray-600 mb-1.5" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t.description || "") }} />
                        <p className="text-xs text-gray-400 font-medium">
                          {format(new Date(t.startDate), 'MMM d, yyyy')}
                          {t.endDate && t.endDate !== t.startDate ? ` – ${format(new Date(t.endDate), 'MMM d, yyyy')}` : ''}
                        </p>
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            </section>
          )}

          {/* Prizes */}
          {event.prizes?.length > 0 && (
            <section id="section-prizes" className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Prizes & Rewards
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {event.prizes.map((p: any, i: number) => (
                  <div key={p.id || i} className={`rounded-xl p-5 border-2 text-center ${
                    i === 0 ? 'border-yellow-300 bg-yellow-50' :
                    i === 1 ? 'border-gray-300 bg-gray-50' :
                    i === 2 ? 'border-orange-300 bg-orange-50' :
                    'border-gray-100 bg-white'
                  }`}>
                    <div className="text-3xl mb-2">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏆'}</div>
                    <h3 className="font-bold text-gray-900 text-lg">{p.title}</h3>
                    {p.amount && <p className="text-nerdBlue font-bold text-xl mt-1">{p.amount}</p>}
                    {p.description && <div className="prose prose-sm prose-slate max-w-none text-gray-500 mt-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(p.description || "") }} />}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tracks */}
          {event.tracks?.length > 0 && (
            <section id="section-tracks" className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-500" />
                Tracks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.tracks.map((t: any, i: number) => (
                  <div key={t.id || i} className="group rounded-2xl p-5 bg-white border border-gray-200 shadow-sm hover:border-nerdBlue/50 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3"><span className="flex items-center justify-center w-9 h-9 rounded-xl bg-nerdBlue/10 text-nerdBlue font-bold text-sm shrink-0">{String(i + 1).padStart(2, "0")}</span><div className="min-w-0"><h3 className="font-bold text-gray-900 mb-2">{t.title}</h3>
                    {t.description && <div className="prose prose-sm prose-slate max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t.description || "") }} />}</div></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {event.faqs?.length > 0 && (
            <section id="section-faqs" className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">FAQs</h2>
              <div className="flex flex-col divide-y divide-gray-100">
                {event.faqs.map((f: any, i: number) => (
                  <div key={f.id || i}>
                    <button
                      className="w-full flex items-center justify-between py-4 text-left gap-4"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-semibold text-gray-900">{f.question}</span>
                      {openFaq === i ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className="prose prose-sm prose-slate max-w-none text-gray-600 pb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(f.answer || "") }} />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-5 order-1 lg:order-2">

          {/* Register CTA */}
          <div className="bg-nerdBlue rounded-2xl p-6 text-white shadow-lg shadow-nerdBlue/20">
            <h3 className="font-bold text-xl mb-1">Join This Event</h3>
            <p className="text-white/70 text-sm mb-5">Register now to secure your spot!</p>
            <button onClick={handleRegister} disabled={isRegistrationClosed || registrationState === 'registered'} className={`w-full py-3.5 font-bold rounded-xl transition-colors ${isRegistrationClosed || registrationState === 'registered' ? 'bg-white text-nerdBlue/70 cursor-not-allowed' : 'bg-nerdLime text-nerdBlue hover:bg-white'}`}>
              {isRegistrationClosed ? 'Registration Closed' : registrationState === 'registered' ? 'Registered' : 'Register Now'}
            </button>
          </div>

          {(event.teamType === 'TEAM' || event.teamType === 'BOTH') && registrationState === 'registered' && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-1">Team registration</h3>
              {teamInfo ? (
                <div className="rounded-xl bg-nerdBlue/5 border border-nerdBlue/15 p-3">
                  <p className="font-bold text-nerdBlue">Team Created Successfully</p>
                  <p className="text-sm text-gray-700 mt-2"><span className="font-semibold text-gray-500">Team Name:</span> {teamInfo.name}</p>{teamDetails?.members?.length > 0 && <div className="mt-3 space-y-1.5">{teamDetails.members.map((member: any) => <div key={member.userId} className="flex items-center justify-between text-xs text-gray-700"><span>{member.name} <span className="text-gray-400">({member.isLeader ? 'Leader' : 'Member'})</span></span>{teamDetails.members.some((m: any) => m.userId === user?.id && m.isLeader) && !member.isLeader && <button onClick={() => setRemoveTarget(member)} className="text-red-600 font-bold">Remove</button>}</div>)}</div>}
                  {teamDetails?.submission ? <p className="mt-3 rounded-xl bg-nerdLime/20 text-nerdBlue text-center py-2.5 text-sm font-bold">Team Registered Successfully</p> : teamDetails?.members?.some((m: any) => m.userId === user?.id && m.isLeader) && <button onClick={submitTeam} disabled={submitLoading} className="w-full mt-3 rounded-xl bg-nerdBlue text-white py-2.5 text-xs font-bold disabled:opacity-70">{submitLoading ? "Submitting..." : "Submit Team"}</button>}
                </div>
              ) : teamMode ? (
                <div className="space-y-3">
                  <input value={teamMode === 'create' ? teamName : inviteCode} onChange={(e) => teamMode === 'create' ? setTeamName(e.target.value) : setInviteCode(e.target.value)} placeholder={teamMode === 'create' ? 'Team name' : 'Invite code'} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-nerdBlue" />
                  {actionError && <p className="text-xs text-red-600">{actionError}</p>}
                  <div className="flex gap-2"><button onClick={teamMode === 'create' ? handleCreateTeam : handleJoinTeam} disabled={actionLoading} className="flex-1 rounded-xl bg-nerdBlue text-white py-2.5 text-sm font-bold disabled:opacity-60">{actionLoading ? 'Saving...' : teamMode === 'create' ? 'Create Team' : 'Join Team'}</button><button onClick={() => setTeamMode(null)} className="px-3 rounded-xl border border-gray-200 text-sm">Cancel</button></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-3"><button onClick={() => setTeamMode('create')} className="rounded-xl bg-nerdBlue text-white py-2.5 text-sm font-bold">Create Team</button><button onClick={() => setTeamMode('join')} className="rounded-xl border border-gray-200 text-gray-700 py-2.5 text-sm font-bold">Join Team</button></div>
              )}
            </div>
          )}
          {/* Event Details card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Event Details</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs">Start Date</p>
                  <p className="text-gray-800 font-medium">{format(startDate, 'PPP')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs">End Date</p>
                  <p className="text-gray-800 font-medium">{format(endDate, 'PPP')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs">Location</p>
                  {event.locationUrl ? <a href={event.locationUrl} target="_blank" rel="noopener noreferrer" className="text-nerdBlue font-medium hover:underline">{event.locationType === 'ONLINE' ? 'Virtual / Online' : (event.location || 'TBD')}</a> : <p className="text-gray-800 font-medium">{event.locationType === 'ONLINE' ? 'Virtual / Online' : (event.location || 'TBD')}</p>}
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Users className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs">Team Size</p>
                  <p className="text-gray-800 font-medium">
                    {event.teamType === 'INDIVIDUAL' ? 'Individual' : `${event.minTeamSize} – ${event.maxTeamSize} members`}
                  </p>
                </div>
              </li>
              {event.categoryName && (
                <li className="flex items-start gap-3 text-sm">
                  <Layers className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">Category</p>
                    <p className="text-gray-800 font-medium">{event.categoryName}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Important Links */}
          {event.importantLinks?.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-nerdBlue" />
                Important Links
              </h3>
              <ul className="flex flex-col gap-2">
                {event.importantLinks.map((link: any, i: number) => (
                  <li key={link.id || i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-nerdBlue text-sm hover:underline font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {showSubmitConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-nerdBlue/10 flex items-center justify-center text-nerdBlue text-xl font-black mb-4">✓</div>
            <h2 className="text-xl font-bold text-gray-900">Submit team details?</h2>
            <p className="text-gray-500 text-sm mt-2">Are you sure you want to submit these team details?</p>
            <div className="flex gap-3 justify-end mt-6"><button onClick={() => setShowSubmitConfirm(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold">Cancel</button><button onClick={confirmSubmitTeam} className="px-5 py-2.5 rounded-xl bg-nerdBlue text-white font-bold hover:bg-blue-700">Submit Team</button></div>
          </div>
        </div>
      )}
      {removeTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 text-xl font-black mb-4">!</div>
            <h2 className="text-xl font-bold text-gray-900">Remove team member?</h2>
            <p className="text-gray-500 text-sm mt-2">Remove {removeTarget.name || 'this member'} from your team?</p>
            <div className="flex gap-3 justify-end mt-6"><button onClick={() => setRemoveTarget(null)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold">Cancel</button><button onClick={confirmRemoveMember} className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700">Remove</button></div>
          </div>
        </div>
      )}
      {showRegisterConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" role="dialog" aria-modal="true" aria-labelledby="register-confirm-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-nerdBlue/10 flex items-center justify-center text-nerdBlue text-xl font-black mb-4">?</div>
            <h2 id="register-confirm-title" className="text-xl font-bold text-gray-900">Confirm registration</h2>
            <p className="text-gray-500 text-sm mt-2">Are you sure you want to register for this event?</p>
            <div className="flex gap-3 justify-end mt-6"><button onClick={() => setShowRegisterConfirm(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold">Cancel</button><button onClick={confirmRegistration} className="px-5 py-2.5 rounded-xl bg-nerdBlue text-white font-bold hover:bg-blue-700">Continue</button></div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
