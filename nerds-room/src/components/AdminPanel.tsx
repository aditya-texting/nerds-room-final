import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import { supabase } from '../supabaseClient';
import Skeleton from './Skeleton';
import GrowthChart from './GrowthChart';
import { Github, Linkedin } from 'lucide-react';
import {
  Registration,
  FlagshipEvent,
  WhatWeDoCard,
  PhotoGalleryItem,
  Chapter,
  PastEvent,
  SocialLinks
} from '../types/index';






// Tab Types
type TabType = 'analytics' | 'content_engine' | 'strategic_programs' | 'core_systems' | 'media_gallery' | 'success_stories' | 'chapters' | 'past_events' | 'mission_letter' | 'community' | 'chapter_management';



// Icons Component
const Icons = {
  Home: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Users: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Content: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Calendar: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Image: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Message: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  MapPin: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Settings: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Logout: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Search: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Clock: ({ className }: { className?: string }) => <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Check: ({ className }: { className?: string }) => <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Layers: ({ className }: { className?: string }) => <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Trash: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Edit: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Alert: ({ className }: { className?: string }) => <svg className={className || "w-8 h-8"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Menu: ({ className }: { className?: string }) => <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  X: ({ className }: { className?: string }) => <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Code: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  Info: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,

  ChevronDown: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>,
  Trophy: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v2M19 3v2M5 10c0 1.657 1.343 3 3 3h8c1.657 0 3-1.343 3-3V7H5v3zM12 13v4m-4 4h8" /></svg>,
  Gift: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0H5v13h14V8h-7z" /></svg>,
  Heart: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  List: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  Twitter: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>,
  Linkedin: ({ className }: { className?: string }) => <Linkedin className={className || "w-4 h-4"} />,
  Github: ({ className }: { className?: string }) => <Github className={className || "w-4 h-4"} />,
  Instagram: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  Globe: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  ArrowLeft: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
};

const AdminPanel = () => {
  const {
    session,
    signIn,
    signOut,
    registrations,
    whatWeDoCards,
    addWhatWeDoCard,
    updateWhatWeDoCard,
    deleteWhatWeDoCard,
    flagshipEvents,
    addFlagshipEvent,
    updateFlagshipEvent,
    deleteFlagshipEvent,
    photoGallery,
    addPhotoGalleryItem,
    updatePhotoGalleryItem,
    deletePhotoGalleryItem,
    successStories,
    addSuccessStory,
    updateSuccessStory,
    deleteSuccessStory,
    chapters,
    addChapter,
    updateChapter,
    deleteChapter,
    reorderChapter,
    communityLeads,
    addCommunityLead,
    updateCommunityLead,
    deleteCommunityLead,
    addChapterEvent,
    updateChapterEvent,
    deleteChapterEvent,
    reorderChapterEvent,
    chapterEvents,
    subchapters,
    addSubchapter,
    updateSubchapter,
    deleteSubchapter,
    reorderSubchapter,
    chapterContents,
    upsertChapterContent,
    userRoles,
    isSuperAdmin,
    adminChapterId,
    joinCommunityLink,
    setJoinCommunityLink,
    chaptersHeaderBanner,
    setChaptersHeaderBanner,
    chaptersHeaderBannerOpacity,
    setChaptersHeaderBannerOpacity,

    pastEvents,
    addPastEvent,
    updatePastEvent,
    deletePastEvent,
    partners,
    setPartners,
    supportedByText,
    setSupportedByText,
    heroContent,
    updateHeroContent,
    socialLinks,
    updateSocialLinks,
    footerDescription,
    setFooterDescription,
    registrationsOpen,
    setRegistrationsOpen,
    emailNotifications,
    setEmailNotifications,
    autoApprove,
    setAutoApprove,
    maintenanceMode,
    setMaintenanceMode,
    showToast,
    uploadFile,
    convertGoogleDriveUrl,


    missionLetter,
    updateMissionLetter,

    getGrowthData,
    totalRegs,
    totalApprovedRegs,
    whoWeAreContent,
    updateWhoWeAreContent,
  } = useAppData();


  const [activeTab, setActiveTabState] = useState<TabType>(() => {
    return (localStorage.getItem('admin_active_tab') as TabType) || 'analytics';
  });

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    localStorage.setItem('admin_active_tab', tab);
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Local state for Who We Are (Past Events Tab)
  const [localWhoWeAre, setLocalWhoWeAre] = useState(whoWeAreContent);

  useEffect(() => {
    if (whoWeAreContent) {
      setLocalWhoWeAre(whoWeAreContent);
    }
  }, [whoWeAreContent]);



  // Helper for UI Feedback

  const handleAction = async (action: () => Promise<void>, successMsg: string) => {
    try {
      await action();
      showToast(successMsg, 'success');
    } catch (error: any) {
      showToast(error.message || 'Action failed', 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, bucket: string, inputId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = await uploadFile(file, bucket);
    setIsUploading(false);

    if (url) {
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) {
        input.value = url;
      }
      showToast('Image uploaded successfully', 'success');
    }

  };

  const [authError, setAuthError] = useState('');

  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // CRUD Modal States
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddStory, setShowAddStory] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showAddPastEvent, setShowAddPastEvent] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showAddChapterEvent, setShowAddChapterEvent] = useState(false);
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [editingChapterEvent, setEditingChapterEvent] = useState<any | null>(null);
  const [showAddSubchapter, setShowAddSubchapter] = useState(false);
  const [editingSubchapter, setEditingSubchapter] = useState<any | null>(null);
  const [editingChapterContent, setEditingChapterContent] = useState<any | null>(null);




  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [editingCard, setEditingCard] = useState<any | null>(null);
  const [editingStory, setEditingStory] = useState<any | null>(null);
  const [editingChapter, setEditingChapter] = useState<any | null>(null);
  const [editingPastEvent, setEditingPastEvent] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: string } | null>(null);
  const [modalEventStats, setModalEventStats] = useState<any[]>([]);
  const [joinLinkInput, setJoinLinkInput] = useState(joinCommunityLink);

  useEffect(() => {
    setJoinLinkInput(joinCommunityLink);
  }, [joinCommunityLink]);



  useEffect(() => {
    const timer = setTimeout(() => setIsCheckingSession(false), 1000);
    return () => clearTimeout(timer);
  }, [session]);


  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await signIn(email, password);
    if (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const downloadCSV = async () => {
    // Fetch ALL registrations from DB (not just the 50 in state)
    const { data: allRegs, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast('Failed to fetch all registrations: ' + error.message, 'error');
      return;
    }

    const csvContent = [
      ['Dossier ID', 'Full Name', 'Professional Role', 'Email Address', 'Clearance Status', 'Timestamp'],
      ...(allRegs || []).map((reg: any) => [
        reg.id,
        reg.name,
        reg.role,
        reg.email,
        reg.status,
        new Date(reg.created_at).toISOString(),
      ]),
    ].map((row: any[]) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nerds_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };


  if (isCheckingSession) {
    return (
      <div className="flex h-screen bg-[#f3f4f6]">
        {/* Sidebar Skeleton */}
        <aside className="w-64 bg-[#1a1c23] shrink-0 p-6 space-y-8">
          <Skeleton className="h-8 w-32 bg-gray-800" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-10 w-full bg-gray-800/50" />)}
          </div>
        </aside>
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
            <Skeleton className="h-4 w-48" />
          </header>
          <main className="flex-1 p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-48 bg-[#5f33e1]/10"></div>
            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full shadow-sm" />)}
              </div>
              <Skeleton className="h-96 w-full shadow-sm" />
            </div>
          </main>
        </div>
      </div>
    );
  }


  if (!session) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-2">Enter credentials to access dashboard</p>
          </div>
          <form onSubmit={handleUnlock} className="space-y-6">
            {authError && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">{authError}</div>}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#5f33e1] transition-colors" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#5f33e1] transition-colors" required />
            </div>
            <button type="submit" className="w-full bg-[#5f33e1] text-white font-bold py-3 rounded-lg hover:bg-[#4c28b5] transition-colors shadow-lg shadow-indigo-200">LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'analytics', label: 'Dashboard', icon: <Icons.Home /> },
    { id: 'content_engine', label: 'Content', icon: <Icons.Content /> },
    { id: 'strategic_programs', label: 'Events', icon: <Icons.Calendar /> },
    { id: 'media_gallery', label: 'Gallery', icon: <Icons.Image /> },
    { id: 'success_stories', label: 'Stories', icon: <Icons.Message /> },
    { id: 'chapters', label: 'Chapters', icon: <Icons.MapPin /> },
    { id: 'chapter_management', label: 'Chapter Mgmt', icon: <Icons.Layers /> },
    { id: 'past_events', label: 'Who We Are', icon: <Icons.Calendar /> },
    { id: 'mission_letter', label: 'Mission Letter', icon: <Icons.Content /> },
    { id: 'core_systems', label: 'Settings', icon: <Icons.Settings /> },

  ];

  const getPageTitle = () => {
    return menuItems.find(m => m.id === activeTab)?.label || 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans text-gray-800">
      {/* Sidebar - Responsive Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#1a1c23] text-white flex flex-col shrink-0 z-40 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <span className="font-black text-2xl tracking-tight text-[#9BE600]">nerds.</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <Icons.X />
          </button>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as TabType);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                ? 'bg-[#5f33e1] text-white shadow-md'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <span className="opacity-70">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold uppercase w-full">
            <Icons.Logout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-20 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icons.Menu />
            </button>
            <div className="flex items-center gap-2 md:gap-4 w-full max-w-md">
              <span className="text-gray-400"><Icons.Search /></span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-600"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#5f33e1] text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable View */}
        <main className="flex-1 overflow-y-auto relative bg-[#f3f4f6]">
          {/* Purple Banner */}
          <div className="bg-[#5f33e1] h-48 w-full absolute top-0 left-0"></div>

          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 pb-20">
            {/* Page Title */}
            <div className="flex justify-between items-center mb-8 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold">{getPageTitle()}</h1>
              {activeTab === 'analytics' && (
                <button onClick={downloadCSV} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                  EXPORT REPORT
                </button>
              )}
            </div>

            {/* Dashboard Stats Row (Only on Analytics) */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Registrations', value: totalRegs, icon: <Icons.Users />, sub: 'Real-time database count' },
                  { label: 'Pending Reviews', value: Math.max(0, totalRegs - totalApprovedRegs), icon: <Icons.Clock />, sub: 'Awaiting decision' },
                  { label: 'Approved Members', value: totalApprovedRegs, icon: <Icons.Check />, sub: 'Verified across system' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</h3>
                        <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                          {stat.value >= 1000 ? `${(stat.value / 1000).toFixed(1)}k` : stat.value}
                        </div>
                      </div>
                      <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.sub}</div>
                  </div>
                ))}
              </div>
            )}



            {/* Main Content Card Container */}
            <div className="mt-6 space-y-6">

              {/* ANALYTICS / DASHBOARD CONTENT */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Growth Overview Chart */}
                  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-indigo-100/50" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Registration Growth</h3>
                          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full tracking-widest uppercase">
                            Trending +24% ↑
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-400 mt-1">User expansion analytics for the last 7 months</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                              {i % 2 === 0 ? 'AD' : 'JK'}
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                            +12
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">New Members Today</span>
                      </div>
                    </div>

                    <div className="h-[280px]">
                      <GrowthChart
                        data={getGrowthData().data}
                        labels={getGrowthData().labels}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">Recent Registrations</h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <th className="px-6 py-4 font-bold">User</th>
                            <th className="px-6 py-4 font-bold">Role</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold">Ticket</th>
                            <th className="px-6 py-4 font-bold text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {registrations
                            .filter(reg => {
                              if (!searchQuery.trim()) return true;
                              const q = searchQuery.toLowerCase();
                              return reg.name.toLowerCase().includes(q) ||
                                     reg.email.toLowerCase().includes(q) ||
                                     (reg.role || '').toLowerCase().includes(q);
                            })
                            .slice(0, 10).map((reg: Registration) => (

                            <tr key={reg.id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                    {reg.name[0]}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-gray-800">{reg.name}</div>
                                    <div className="text-xs text-gray-400">{reg.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{reg.role}</td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${reg.status === 'approved' ? 'bg-green-100 text-green-600' :
                                  reg.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                  }`}>
                                  {reg.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                              </td>

                              <td className="px-6 py-4 text-xs text-gray-400 text-right">
                                {new Date(reg.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* STRATEGIC PROGRAMS (Events & cards) */}
              {activeTab === 'strategic_programs' && (
                <div className="grid grid-cols-1 gap-16">
                  {/* Flagship Events */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-800 text-lg">Flagship Events</h3>
                      <button onClick={() => setShowAddEvent(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD</button>
                    </div>
                    <div className="space-y-4">
                      {flagshipEvents.map((event: FlagshipEvent) => (

                        <div key={event.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all">
                          <img src={event.image} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{event.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button onClick={() => { setEditingEvent(event); setModalEventStats(Array.isArray(event.stats) ? event.stats : []); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-800"><Icons.Edit /></button>
                            <button onClick={() => setDeleteConfirm({ id: String(event.id), type: 'event' })} className="text-xs font-bold text-red-400 hover:text-red-600"><Icons.Trash /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What We Do Cards */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-800 text-lg">Service Cards</h3>
                      <button onClick={() => setShowAddCard(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD</button>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {whatWeDoCards.map((card: WhatWeDoCard) => (

                        <div key={card.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all">
                          <div className="flex justify-between items-start">
                            <span className="text-2xl">{card.icon}</span>
                            <div className="flex gap-2">
                              <button onClick={() => setEditingCard(card)} className="text-gray-400 hover:text-indigo-600 text-xs"><Icons.Edit /></button>
                              <button onClick={() => setDeleteConfirm({ id: String(card.id), type: 'card' })} className="text-gray-400 hover:text-red-600 text-xs"><Icons.Trash /></button>
                            </div>
                          </div>
                          <h4 className="font-bold text-gray-800 text-sm mt-3">{card.title}</h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{card.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MEDIA GALLERY */}
              {activeTab === 'media_gallery' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 text-lg">Photo Gallery</h3>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        if (confirm('Auto-balance gallery to 2-3-4-3-2 layout? This will rearrange images.')) {
                          handleAction(async () => {
                            // 1. Get all photos and sort by ID or creation to maintain relative order
                            const allPhotos = [...photoGallery].sort((a, b) => a.id - b.id);

                            // 2. Define ideal distribution
                            const distribution = [
                              { cat: 'col1', count: 2 },
                              { cat: 'col2', count: 3 },
                              { cat: 'center', count: 4 },
                              { cat: 'col3', count: 3 },
                              { cat: 'col4', count: 2 }
                            ];

                            let currentIndex = 0;
                            const updates = [];

                            // 3. Assign categories
                            for (const dist of distribution) {
                              for (let i = 0; i < dist.count; i++) {
                                if (currentIndex < allPhotos.length) {
                                  const photo = allPhotos[currentIndex];
                                  if (photo.category !== dist.cat) {
                                    updates.push(updatePhotoGalleryItem(photo.id, { category: dist.cat }));
                                  }
                                  currentIndex++;
                                }
                              }
                            }

                            // Handle overflow (append to last column or distribute?)
                            // For now, leave remaining in their current or move to col4/center?
                            // Let's dump rest in col4 for now if any
                            while (currentIndex < allPhotos.length) {
                              const photo = allPhotos[currentIndex];
                              if (photo.category !== 'col4') {
                                updates.push(updatePhotoGalleryItem(photo.id, { category: 'col4' }));
                              }
                              currentIndex++;
                            }

                            await Promise.all(updates);
                          }, 'Gallery Auto-Balanced');
                        }
                      }} className="bg-orange-50 text-orange-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors">
                        AUTO BALANCE LAYOUT
                      </button>
                      <button onClick={() => setShowAddPhoto(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ UPLOAD</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photoGallery.map((photo: PhotoGalleryItem) => (

                      <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square">
                        <img src={photo.image_url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => {
                            const newUrl = prompt('Enter new image URL:', photo.image_url);
                            if (newUrl && newUrl !== photo.image_url) {
                              handleAction(() => updatePhotoGalleryItem(photo.id, { image_url: newUrl }), 'Photo updated');
                            }
                          }} className="bg-indigo-500 text-white p-2 rounded text-xs font-bold hover:bg-indigo-600"><Icons.Edit /></button>
                          <button onClick={() => setDeleteConfirm({ id: String(photo.id), type: 'photo' })} className="bg-red-500 text-white p-2 rounded text-xs font-bold hover:bg-red-600"><Icons.Trash /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUCCESS STORIES */}
              {activeTab === 'success_stories' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 text-lg">Success Stories</h3>
                    <button onClick={() => setShowAddStory(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {successStories.map(story => (
                      <div key={story.id} className={`${story.bg_color || 'bg-gray-50'} p-6 rounded-2xl relative group`}>
                        <div className="flex items-center gap-3 mb-4">
                          <img src={story.image_url} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <div className="font-bold text-sm text-gray-800">{story.name}</div>
                            <div className="text-xs text-gray-500">{story.role}</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-3">{(story.content && story.content[0] && (typeof story.content[0] === 'string' ? story.content[0] : story.content[0].text)) || ''}</p>
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingStory(story)} className="bg-white p-1.5 rounded-full shadow-sm text-xs text-gray-400 hover:text-indigo-600"><Icons.Edit /></button>
                          <button onClick={() => setDeleteConfirm({ id: String(story.id), type: 'story' })} className="bg-white p-1.5 rounded-full shadow-sm text-xs text-red-500 hover:text-red-700"><Icons.Trash /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CHAPTERS */}
              {activeTab === 'chapters' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 text-lg">Chapters</h3>
                    <button onClick={() => setShowAddChapter(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chapters.map((chapter: Chapter) => (

                      <div key={chapter.id} className="p-6 border border-gray-100 rounded-xl flex items-center justify-between hover:shadow-md transition-all bg-gray-50/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl"><Icons.MapPin /></div>
                          <div>
                            <div className="font-bold text-gray-800">{chapter.name}</div>
                            <div className="text-xs text-gray-500">{chapter.location}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingChapter(chapter)} className="text-indigo-600 font-bold text-xs p-2"><Icons.Edit /></button>
                          <button onClick={() => setDeleteConfirm({ id: String(chapter.id), type: 'chapter' })} className="text-red-500 font-bold text-xs p-2"><Icons.Trash /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}



              {/* CHAPTER MGMT — Chapters CRUD + Join link + Roles */}
              {activeTab === 'chapter_management' && (
                <div className="space-y-6">
                  {/* Join Community Link */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800 text-lg">Join Community Link</h3>
                      <button
                        onClick={() => handleAction(() => setJoinCommunityLink(joinLinkInput.trim()), 'Join link updated')}
                        className="bg-[#9BE600] text-[#00308F] px-6 py-2 rounded-lg text-xs font-black shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                      >SAVE</button>
                    </div>
                    <input
                      id="join-link"
                      value={joinLinkInput}
                      onChange={(e) => setJoinLinkInput(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-gray-400 mt-2">This link powers the "Join the Community" button on the Chapters page. No redeploy needed.</p>
                  </div>

                  {/* All Chapters Header Banner */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800 text-lg">All Chapters Header Banner</h3>
                      <button
                        onClick={() => {
                          const raw = (document.getElementById('chapters-banner') as HTMLInputElement).value;
                          handleAction(() => setChaptersHeaderBanner(convertGoogleDriveUrl(raw)), 'Header banner updated');
                        }}
                        className="bg-[#9BE600] text-[#00308F] px-6 py-2 rounded-lg text-xs font-black shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                      >SAVE</button>
                    </div>
                    <input id="chapters-banner" defaultValue={chaptersHeaderBanner} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold" placeholder="Image URL (background of All Chapters list header)" />
                    <label className={`flex items-center justify-center gap-2 mt-3 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'chapters', 'chapters-banner')} />
                      {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                    </label>
                    {/* Banner opacity */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-gray-600">Banner Opacity</label>
                        <span className="text-xs font-bold text-gray-500">{Math.round(chaptersHeaderBannerOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={chaptersHeaderBannerOpacity}
                        onChange={(e) => setChaptersHeaderBannerOpacity(Number(e.target.value))}
                        className="w-full accent-[#9BE600]"
                      />
                    </div>
                    {/* Live preview */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 mb-2">Preview (how it looks on /chapters):</p>
                      <div className="relative h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        {chaptersHeaderBanner ? (
                          <img src={convertGoogleDriveUrl(chaptersHeaderBanner)} alt="" className="w-full h-full object-cover" style={{ opacity: chaptersHeaderBannerOpacity }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No banner set</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/90" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Shows as a faded background behind the search header on the /chapters page. Google Drive links are auto-converted.</p>
                  </div>

                  {/* Chapters CRUD */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-800 text-lg">Chapters</h3>
                      <button onClick={() => setShowAddChapter(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {chapters.map((chapter: any) => (
                        <div key={chapter.id} className="p-4 border border-gray-100 rounded-xl flex items-center justify-between bg-gray-50/50">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
                              {chapter.banner_url ? <img src={chapter.banner_url} alt={chapter.name} className="w-full h-full object-cover" /> : <Icons.MapPin />}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-gray-800 truncate">{chapter.name}</div>
                              <div className="text-xs text-gray-500 truncate">{chapter.chapter_type === 'campus' ? 'Campus' : 'City'}{chapter.chapter_type === 'campus' ? (chapter.is_live === false ? ' · Private' : ' · Live') : ' · Live'}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <div className="flex flex-col gap-0.5 mr-1">
                              <button onClick={() => reorderChapter(chapter.id, 'up')} className="text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 hover:bg-indigo-100 rounded leading-none" title="Move up">▲</button>
                              <button onClick={() => reorderChapter(chapter.id, 'down')} className="text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 hover:bg-indigo-100 rounded leading-none" title="Move down">▼</button>
                            </div>
                            <button onClick={() => setEditingChapterContent(chapter)} className="text-nerdBlue font-bold text-[10px] px-1.5 py-1 rounded hover:bg-nerdBlue/10" title="Edit page content">PAGE</button>
                            <button onClick={() => setEditingChapter(chapter)} className="text-indigo-600 font-bold text-xs p-1"><Icons.Edit /></button>
                            <button onClick={() => setDeleteConfirm({ id: String(chapter.id), type: 'chapter' })} className="text-red-500 font-bold text-xs p-1"><Icons.Trash /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subchapters CRUD */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-800 text-lg">Subchapters</h3>
                      <button onClick={() => setShowAddSubchapter(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subchapters.length === 0 && <div className="text-gray-400 text-sm col-span-full">No subchapters yet.</div>}
                      {subchapters.map((sub: any) => {
                        const parent = chapters.find((c: any) => c.id === sub.chapter_id);
                        return (
                          <div key={sub.id} className="p-4 border border-gray-100 rounded-xl flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
                                {sub.banner_url ? <img src={sub.banner_url} alt={sub.name} className="w-full h-full object-cover" /> : <Icons.MapPin />}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-gray-800 truncate">{sub.name}</div>
                                <div className="text-xs text-gray-500 truncate">{parent ? parent.name : '—'}</div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <div className="flex flex-col gap-0.5 mr-1">
                                <button onClick={() => reorderSubchapter(sub.id, 'up')} className="text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 hover:bg-indigo-100 rounded leading-none" title="Move up">▲</button>
                                <button onClick={() => reorderSubchapter(sub.id, 'down')} className="text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 hover:bg-indigo-100 rounded leading-none" title="Move down">▼</button>
                              </div>
                              <button onClick={() => setEditingSubchapter(sub)} className="text-indigo-600 font-bold text-xs p-1"><Icons.Edit /></button>
                              <button onClick={() => setDeleteConfirm({ id: String(sub.id), type: 'subchapter' })} className="text-red-500 font-bold text-xs p-1"><Icons.Trash /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upcoming Events (chapter-scoped) */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-800 text-lg">Upcoming Events</h3>
                      <button onClick={() => setShowAddChapterEvent(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD EVENT</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {chapterEvents.length === 0 && <div className="text-gray-400 text-sm col-span-full">No events yet.</div>}
                      {chapterEvents.map((ev: any) => {
                        const parent = chapters.find((c: any) => c.id === ev.chapter_id);
                        return (
                          <div key={ev.id} className="p-4 border border-gray-100 rounded-xl flex items-center gap-3 bg-gray-50/50">
                            <div className="flex flex-col gap-0.5 shrink-0">
                              <button onClick={() => reorderChapterEvent(ev.id, 'up')} className="text-indigo-600 text-[10px] font-bold px-1 hover:bg-indigo-100 rounded leading-none" title="Move up">▲</button>
                              <button onClick={() => reorderChapterEvent(ev.id, 'down')} className="text-indigo-600 text-[10px] font-bold px-1 hover:bg-indigo-100 rounded leading-none" title="Move down">▼</button>
                            </div>
                            <div className="w-14 h-10 rounded-lg bg-nerdGray overflow-hidden shrink-0 flex items-center justify-center">
                              {ev.banner_url ? <img src={ev.banner_url} alt={ev.title} className="w-full h-full object-cover" /> : <Icons.Image />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-gray-800 truncate">{ev.title}</div>
                              <div className="text-xs text-gray-500 truncate">{ev.date}{ev.location ? ` · ${ev.location}` : ''}{parent ? ` · ${parent.name}` : ''}</div>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => setEditingChapterEvent(ev)} className="text-indigo-600 font-bold text-xs p-1"><Icons.Edit /></button>
                              <button onClick={() => setDeleteConfirm({ id: String(ev.id), type: 'chapterEvent' })} className="text-red-500 font-bold text-xs p-1"><Icons.Trash /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Roles */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 text-lg mb-2">Admin Roles</h3>
                    <p className="text-xs text-gray-400 mb-4">SuperAdmin manages everything. Chapter Admin is scoped to one chapter. (Assign roles via Supabase: insert into <code>user_roles</code>.)</p>
                    <div className="space-y-2">
                      {userRoles.length === 0 && <div className="text-gray-400 text-sm">No roles assigned yet.</div>}
                      {userRoles.map((r: any) => (
                        <div key={r.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${r.role === 'superadmin' ? 'bg-nerdLime/20 text-nerdBlue' : 'bg-indigo-50 text-indigo-600'}`}>{r.role}</span>
                          <span className="text-sm text-gray-600 font-mono truncate">{r.user_id}</span>
                          {r.chapter_id && <span className="text-xs text-gray-400">· Chapter #{r.chapter_id}</span>}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-400">
                      Current session: {isSuperAdmin ? <span className="text-nerdBlue font-bold">SuperAdmin</span> : adminChapterId ? <span className="text-indigo-600 font-bold">Chapter Admin (#{adminChapterId})</span> : <span>Viewer</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* WHO WE ARE */}
              {activeTab === 'past_events' && (
                <div className="space-y-6">
                  {/* Content Editor */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-800 text-lg">Header Content</h3>
                      <button
                        onClick={() => handleAction(() => updateWhoWeAreContent(localWhoWeAre), 'Content Updated Successfully')}
                        className="bg-[#9BE600] text-[#00308F] px-6 py-2 rounded-lg text-xs font-black shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                      >
                        SAVE CHANGES
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Heading Line 1</label>
                        <input
                          type="text"
                          value={localWhoWeAre.headingLine1 || ''}
                          onChange={e => setLocalWhoWeAre({ ...localWhoWeAre, headingLine1: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold"
                          placeholder="Line 1 (e.g. WHO WE)"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Heading Line 2</label>
                        <input
                          type="text"
                          value={localWhoWeAre.headingLine2 || ''}
                          onChange={e => setLocalWhoWeAre({ ...localWhoWeAre, headingLine2: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold"
                          placeholder="Line 2 (e.g. ARE)"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Main Description (Bold)</label>
                      <textarea
                        value={localWhoWeAre.description || ''}
                        onChange={e => setLocalWhoWeAre({ ...localWhoWeAre, description: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm h-24"
                        placeholder="Main Description"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Secondary Description</label>
                      <textarea
                        value={localWhoWeAre.description2 || ''}
                        onChange={e => setLocalWhoWeAre({ ...localWhoWeAre, description2: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm h-24"
                        placeholder="Secondary Description"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Builders Count Override (Optional)</label>
                      <input
                        type="number"
                        value={localWhoWeAre.buildersOverride || ''}
                        onChange={e => setLocalWhoWeAre({ ...localWhoWeAre, buildersOverride: parseInt(e.target.value) || undefined })}
                        className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
                        placeholder="Enter manual count (leave blank to use sum of past events)"
                      />
                      <p className="text-[10px] text-gray-400 mt-1 italic">If left empty, the system will automatically sum the attendees of all past events.</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-800 text-lg">Past Events List ({pastEvents.length})</h3>
                      <button onClick={() => setShowAddPastEvent(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD PAST EVENT</button>
                    </div>

                    {pastEvents.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icons.Calendar className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-sm font-medium">No past events found in database.</p>
                        <button
                          onClick={() => setShowAddPastEvent(true)}
                          className="mt-4 text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline"
                        >+ Add Your First Event</button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Event</th>
                              <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                              <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                              <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Attendees</th>
                              <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pastEvents.map((event: PastEvent) => (

                              <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3">
                                    {event.image_url && <img src={event.image_url} alt="" className="w-10 h-10 rounded object-cover" />}
                                    <div>
                                      <div className="font-bold text-gray-800">{event.title}</div>
                                      <div className="text-xs text-gray-500">{event.date}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-600">{event.location}</td>
                                <td className="py-4 px-4">
                                  <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider">
                                    {event.event_type}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-sm font-bold text-gray-700">{event.attendees_count}</td>
                                <td className="py-4 px-4">
                                  <div className="flex gap-2">
                                    <button onClick={() => setEditingPastEvent(event)} className="text-indigo-600 font-bold text-xs p-2 hover:bg-indigo-50 rounded"><Icons.Edit /></button>
                                    <button
                                      onClick={() => setDeleteConfirm({ id: String(event.id), type: 'past_event' })}
                                      className="text-red-500 font-bold text-xs p-2 hover:bg-red-50 rounded"
                                    >
                                      <Icons.Trash />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}











              {/* SETTINGS / CORE SYSTEMS */}
              {
                activeTab === 'core_systems' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
                    <div className="max-w-3xl">
                      <h3 className="font-bold text-gray-800 text-lg mb-6 pt-4">Content Controls</h3>
                      <div className="space-y-6">
                        {[
                          { label: 'Registrations', state: registrationsOpen, setter: setRegistrationsOpen },
                          { label: 'Email Notifications', state: emailNotifications, setter: setEmailNotifications },
                          { label: 'Auto Approve', state: autoApprove, setter: setAutoApprove },
                          { label: 'Maintenance Mode', state: maintenanceMode, setter: setMaintenanceMode },
                        ].map((setting: { label: string, state: boolean, setter: (val: boolean) => void }, i: number) => (
                          <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">

                            <span className="font-bold text-sm text-gray-700">{setting.label}</span>
                            <button
                              onClick={() => setting.setter(!setting.state)}
                              className={`w-12 h-6 rounded-full relative transition-colors ${setting.state ? 'bg-indigo-500' : 'bg-gray-300'}`}
                            >
                              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${setting.state ? 'translate-x-6' : ''}`} />
                            </button>
                          </div>
                        ))}
                      </div>


                    </div>
                  </div>
                )}


              {/* CONTENT ENGINE - HERO & FOOTER */}
              {
                activeTab === 'content_engine' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-10">
                    <div className="grid grid-cols-1 gap-16">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg mb-6">Hero Section</h3>
                        <div className="space-y-4">
                          <input type="text" value={heroContent.headingLine1} onChange={e => updateHeroContent({ headingLine1: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold" placeholder="Line 1" />
                          <input type="text" value={heroContent.headingLine2} onChange={e => updateHeroContent({ headingLine2: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold" placeholder="Line 2" />
                          <input type="text" value={heroContent.headingLine3} onChange={e => updateHeroContent({ headingLine3: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold" placeholder="Line 3" />
                          <textarea value={heroContent.description} onChange={e => updateHeroContent({ description: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm h-32" placeholder="Description" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg mb-6">Footer & Links</h3>
                        <div className="space-y-4">
                          <textarea value={footerDescription} onChange={e => setFooterDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm h-32" placeholder="Footer Description" />
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(socialLinks).map(([k, v]) => (
                              <input
                                key={k}
                                type="text"
                                value={v as string}
                                onChange={e => updateSocialLinks({ [k as keyof SocialLinks]: e.target.value })}
                                placeholder={k}
                                className="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg text-xs"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-10 border-t border-gray-100">
                      <h3 className="font-bold text-gray-800 text-lg mb-6">Partner Ecosystem</h3>
                      <div className="max-w-xl space-y-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Section Title</label>
                          <input
                            type="text"
                            value={supportedByText}
                            onChange={e => setSupportedByText(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Partner Names (comma separated)</label>
                          <textarea
                            value={partners.join(', ')}
                            onChange={e => setPartners(e.target.value.split(',').map(s => s.trim()))}
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm h-32"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}


              {/* MISSION LETTER EDITOR */}
              {activeTab === 'mission_letter' && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                      <div>
                        <h3 className="font-bold text-gray-800 text-xl">Founder's Mission Letter</h3>
                        <p className="text-sm text-gray-500 mt-1">Update the message displayed on the home page.</p>
                      </div>
                      <button
                        onClick={async () => {
                          const heading = (document.getElementById('ml-heading') as HTMLInputElement).value;
                          const content = (document.getElementById('ml-content') as HTMLTextAreaElement).value;
                          const signature_name = (document.getElementById('ml-name') as HTMLInputElement).value;
                          const signature_role = (document.getElementById('ml-role') as HTMLInputElement).value;
                          const profile_image_url = (document.getElementById('ml-image') as HTMLInputElement).value;

                          await handleAction(() => updateMissionLetter({
                            heading, content, signature_name, signature_role, profile_image_url
                          }), 'Mission Letter updated successfully');
                        }}
                        className="bg-[#5f33e1] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                      >
                        SAVE CHANGES
                      </button>
                    </div>

                    <div className="space-y-8">
                      {/* Heading Section */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Header Section</h4>
                          <p className="text-xs text-gray-500 mt-2 leading-relaxed">The main headline of your letter. Keep it impactful.</p>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Letter Heading</label>
                            <input
                              type="text"
                              id="ml-heading"
                              defaultValue={missionLetter?.heading || 'Dear Future Innovator,'}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-[#5f33e1] focus:ring-2 focus:ring-indigo-100 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <hr className="border-gray-100" />

                      {/* Content Section */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Letter Content</h4>
                          <p className="text-xs text-gray-500 mt-2 leading-relaxed">The body of your message. HTML tags are supported for formatting.</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message Body (HTML Supported)</label>
                          <textarea
                            id="ml-content"
                            defaultValue={missionLetter?.content || ''}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium h-96 font-mono text-gray-700 focus:outline-none focus:border-[#5f33e1] focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed"
                          />
                          <p className="text-[10px] text-gray-400 mt-2 bg-gray-50 inline-block px-2 py-1 rounded">Tip: Use &lt;p&gt; tags for paragraphs and &lt;strong&gt; for bold text.</p>
                        </div>
                      </div>

                      <hr className="border-gray-100" />

                      {/* Founder Profile */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Founder Profile</h4>
                          <p className="text-xs text-gray-500 mt-2 leading-relaxed">Your signature details and profile photo.</p>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name</label>
                              <input
                                type="text"
                                id="ml-name"
                                defaultValue={missionLetter?.signature_name || 'Aditya Pandey'}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Role/Title</label>
                              <input
                                type="text"
                                id="ml-role"
                                defaultValue={missionLetter?.signature_role || 'Founder'}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Profile Image URL</label>
                            <div className="flex flex-col gap-3">
                              <div className="flex gap-3">
                                <input
                                  type="text"
                                  id="ml-image"
                                  defaultValue={missionLetter?.profile_image_url || ''}
                                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-600 truncate"
                                  placeholder="https://..."
                                />
                                {missionLetter?.profile_image_url && (
                                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                    <img src={missionLetter.profile_image_url} className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>

                              <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-[#5f33e1] hover:text-[#5f33e1] hover:bg-indigo-50 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'mission-assets', 'ml-image')} />
                                {isUploading ? 'UPLOADING...' : 'UPLOAD NEW PHOTO'}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}


            </div>
          </div>
        </main>
      </div>

      {/* --- MODALS (Placed outside main flow for z-indexing) --- */}

      {/* ADD EVENT MODAL */}
      {
        showAddEvent && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-bold mb-6">Add Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title</label>
                  <input id="new-event-title" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Event Title" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Location</label>
                  <input id="new-event-loc" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Location" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Image URL</label>
                  <div className="flex flex-col gap-2">
                    <input id="new-event-img" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                    <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'flagship_events', 'new-event-img')} />
                      {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Registration Link</label>
                  <input id="new-event-reg" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="https://..." />
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={true} id="new-event-public" className="w-4 h-4" />
                    <label htmlFor="new-event-public" className="text-xs font-bold text-gray-500 uppercase">Public</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="new-event-featured" className="w-4 h-4" />
                    <label htmlFor="new-event-featured" className="text-xs font-bold text-gray-500 uppercase">Featured</label>
                  </div>
                </div>
                {/* Stats Editor */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Stats (e.g. Registrations, Attendees)</label>
                    <button
                      type="button"
                      onClick={() => setModalEventStats([...modalEventStats, { label: '', value: '' }])}
                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                    >+ ADD STAT</button>
                  </div>
                  <div className="space-y-2">
                    {modalEventStats.map((stat: { label: string, value: string }, idx: number) => (

                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const next = [...modalEventStats];
                            next[idx].value = e.target.value;
                            setModalEventStats(next);
                          }}
                          className="w-24 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-black"
                          placeholder="e.g. 50"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const next = [...modalEventStats];
                            next[idx].label = e.target.value;
                            setModalEventStats(next);
                          }}
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-medium"
                          placeholder="e.g. Registrations"
                        />
                        <button
                          type="button"
                          onClick={() => setModalEventStats(modalEventStats.filter((_, i: number) => i !== idx))}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    {modalEventStats.length === 0 && (
                      <p className="text-xs text-gray-400 italic">No stats yet. Click + ADD STAT to add one.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowAddEvent(false)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const title = (document.getElementById('new-event-title') as HTMLInputElement).value;
                  const loc = (document.getElementById('new-event-loc') as HTMLInputElement).value;
                  const img = (document.getElementById('new-event-img') as HTMLInputElement).value;
                  const registration_link = (document.getElementById('new-event-reg') as HTMLInputElement).value;
                  const is_public = (document.getElementById('new-event-public') as HTMLInputElement).checked;
                  const is_featured = (document.getElementById('new-event-featured') as HTMLInputElement).checked;

                  if (title) {
                    handleAction(() => addFlagshipEvent({
                      title,
                      location: loc,
                      image: img || 'https://via.placeholder.com/150',
                      description: '',
                      stats: modalEventStats,
                      is_public,
                      is_featured,
                      registration_link: registration_link || undefined
                    }), 'Event created');
                    setShowAddEvent(false);
                    setModalEventStats([]);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>

            </div>
          </div>
        )
      }

      {/* EDIT EVENT MODAL */}
      {
        editingEvent && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Edit Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title</label>
                  <input id="edit-event-title" defaultValue={editingEvent.title} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Event Title" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Location</label>
                  <input id="edit-event-loc" defaultValue={editingEvent.location} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Location" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Image URL</label>
                  <div className="flex flex-col gap-2">
                    <input id="edit-event-img" defaultValue={editingEvent.image} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                    <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'flagship_events', 'edit-event-img')} />
                      {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Registration Link</label>
                  <input id="edit-event-reg" defaultValue={editingEvent.registration_link} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="https://..." />
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={editingEvent.is_public !== false} id="edit-event-public" className="w-4 h-4" />
                    <label htmlFor="edit-event-public" className="text-xs font-bold text-gray-500 uppercase">Public</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={editingEvent.is_featured || false} id="edit-event-featured" className="w-4 h-4" />
                    <label htmlFor="edit-event-featured" className="text-xs font-bold text-gray-500 uppercase">Featured</label>
                  </div>
                </div>
                {/* Stats Editor */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Stats (e.g. Registrations, Attendees)</label>
                    <button
                      type="button"
                      onClick={() => setModalEventStats([...modalEventStats, { label: '', value: '' }])}
                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                    >+ ADD STAT</button>
                  </div>
                  <div className="space-y-2">
                    {modalEventStats.map((stat: { label: string, value: string }, idx: number) => (

                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const next = [...modalEventStats];
                            next[idx].value = e.target.value;
                            setModalEventStats(next);
                          }}
                          className="w-24 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-black"
                          placeholder="e.g. 50"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const next = [...modalEventStats];
                            next[idx].label = e.target.value;
                            setModalEventStats(next);
                          }}
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-medium"
                          placeholder="e.g. Registrations"
                        />
                        <button
                          type="button"
                          onClick={() => setModalEventStats(modalEventStats.filter((_, i: number) => i !== idx))}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    {modalEventStats.length === 0 && (
                      <p className="text-xs text-gray-400 italic">No stats yet. Click + ADD STAT to add one.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setEditingEvent(null)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const title = (document.getElementById('edit-event-title') as HTMLInputElement).value;
                  const loc = (document.getElementById('edit-event-loc') as HTMLInputElement).value;
                  const img = (document.getElementById('edit-event-img') as HTMLInputElement).value;
                  const registration_link = (document.getElementById('edit-event-reg') as HTMLInputElement).value;
                  const is_public = (document.getElementById('edit-event-public') as HTMLInputElement).checked;
                  const is_featured = (document.getElementById('edit-event-featured') as HTMLInputElement).checked;

                  if (title) {
                    handleAction(() => updateFlagshipEvent(editingEvent.id, {
                      title,
                      location: loc,
                      image: img,
                      is_public,
                      is_featured,
                      stats: modalEventStats,
                      registration_link: registration_link || undefined
                    }), 'Event updated');
                    setEditingEvent(null);
                    setModalEventStats([]);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE CHANGES</button>
              </div>
            </div>
          </div>
        )
      }


      {/* ADD CARD MODAL */}
      {
        showAddCard && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Add Card</h3>
              <div className="space-y-4">
                <input id="new-card-title" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Title" />
                <input id="new-card-icon" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Icon (Emoji)" />
                <textarea id="new-card-desc" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-24" placeholder="Description" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowAddCard(false)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const title = (document.getElementById('new-card-title') as HTMLInputElement).value;
                  const icon = (document.getElementById('new-card-icon') as HTMLInputElement).value;
                  const desc = (document.getElementById('new-card-desc') as HTMLTextAreaElement).value;
                  if (title) {
                    addWhatWeDoCard({ title, icon: icon || '🚀', description: desc, stat: '0', statLabel: '', iconBg: '', gradient: '' });
                    setShowAddCard(false);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }

      {/* EDIT CARD MODAL */}
      {
        editingCard && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Edit Card</h3>
              <div className="space-y-4">
                <input id="edit-card-title" defaultValue={editingCard.title} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Title" />
                <input id="edit-card-icon" defaultValue={editingCard.icon} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Icon (Emoji)" />
                <textarea id="edit-card-desc" defaultValue={editingCard.description} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-24" placeholder="Description" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setEditingCard(null)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const title = (document.getElementById('edit-card-title') as HTMLInputElement).value;
                  const icon = (document.getElementById('edit-card-icon') as HTMLInputElement).value;
                  const desc = (document.getElementById('edit-card-desc') as HTMLTextAreaElement).value;
                  if (title) {
                    updateWhatWeDoCard(editingCard.id, { title, icon, description: desc });
                    setEditingCard(null);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }

      {/* ADD PHOTO MODAL */}
      {
        showAddPhoto && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Upload Photo</h3>
              <div className="space-y-4">
                <input id="new-photo-url" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery', 'new-photo-url')} />
                  {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowAddPhoto(false)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const url = (document.getElementById('new-photo-url') as HTMLInputElement).value;
                  if (url) {
                    handleAction(() => addPhotoGalleryItem({ image_url: url, category: 'center' }), 'Photo uploaded');
                    setShowAddPhoto(false);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }


      {/* ADD STORY MODAL */}
      {
        showAddStory && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Add Story</h3>
              <div className="space-y-4">
                <input id="new-story-name" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Name" />
                <input id="new-story-role" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Role" />
                <div className="flex flex-col gap-2">
                  <input id="new-story-img" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                  <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'stories', 'new-story-img')} />
                    {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                  </label>
                </div>
                <textarea id="new-story-content" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-24" placeholder="Content" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowAddStory(false)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const name = (document.getElementById('new-story-name') as HTMLInputElement).value;
                  const role = (document.getElementById('new-story-role') as HTMLInputElement).value;
                  const img = (document.getElementById('new-story-img') as HTMLInputElement).value;
                  const content = (document.getElementById('new-story-content') as HTMLTextAreaElement).value;
                  if (name) {
                    handleAction(() => addSuccessStory({ name, role, image_url: img || 'https://via.placeholder.com/150', content: [content], bg_color: '', column_group: 1, display_order: 0 }), 'Story added');
                    setShowAddStory(false);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }


      {/* EDIT STORY MODAL */}
      {
        editingStory && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Edit Story</h3>
              <div className="space-y-4">
                <input id="edit-story-name" defaultValue={editingStory.name} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Name" />
                <input id="edit-story-role" defaultValue={editingStory.role} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Role" />
                <div className="flex flex-col gap-2">
                  <input id="edit-story-img" defaultValue={editingStory.image_url} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                  <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'stories', 'edit-story-img')} />
                    {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                  </label>
                </div>
                <textarea id="edit-story-content" defaultValue={editingStory.content && editingStory.content[0] ? (typeof editingStory.content[0] === 'string' ? editingStory.content[0] : editingStory.content[0].text) : ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-24" placeholder="Content" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setEditingStory(null)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const name = (document.getElementById('edit-story-name') as HTMLInputElement).value;
                  const role = (document.getElementById('edit-story-role') as HTMLInputElement).value;
                  const img = (document.getElementById('edit-story-img') as HTMLInputElement).value;
                  const content = (document.getElementById('edit-story-content') as HTMLTextAreaElement).value;
                  if (name) {
                    handleAction(() => updateSuccessStory(editingStory.id, { name, role, image_url: img, content: [content] }), 'Story updated');
                    setEditingStory(null);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE CHANGES</button>
              </div>
            </div>
          </div>
        )
      }


      {/* ADD CHAPTER MODAL */}
      {
        showAddChapter && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Add Chapter</h3>
              <div className="space-y-4">
                <input id="new-chapter-name" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Chapter Name" />
                <input id="new-chapter-loc" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Location" />
                <select id="new-chapter-type" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">
                  <option value="city">City Chapter (always public)</option>
                  <option value="campus">Campus Chapter (Private/Live toggle)</option>
                </select>
                <input id="new-chapter-lead" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Lead name" />
                <input id="new-chapter-members" type="number" defaultValue={0} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Member count" />
                <input id="new-chapter-banner" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Banner image URL" />
                <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'chapters', 'new-chapter-banner')} />
                  {isUploading ? 'UPLOADING...' : 'UPLOAD BANNER FROM DEVICE'}
                </label>
                <textarea id="new-chapter-desc" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-20" placeholder="Header tagline / description" />
                <input id="new-chapter-join" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Join Our Chapter link (optional)" />
                <input id="new-chapter-partner" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Partner With Us link (optional)" />
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input id="new-chapter-live" type="checkbox" defaultChecked className="w-4 h-4" />
                  Live (visible on public site) — uncheck for Private
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowAddChapter(false)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const name = (document.getElementById('new-chapter-name') as HTMLInputElement).value;
                  const loc = (document.getElementById('new-chapter-loc') as HTMLInputElement).value;
                  const type = (document.getElementById('new-chapter-type') as HTMLSelectElement).value as 'city' | 'campus';
                  const lead = (document.getElementById('new-chapter-lead') as HTMLInputElement).value;
                  const members = Number((document.getElementById('new-chapter-members') as HTMLInputElement).value || 0);
                  const banner = (document.getElementById('new-chapter-banner') as HTMLInputElement).value;
                  const description = (document.getElementById('new-chapter-desc') as HTMLTextAreaElement).value;
                  const join_link = (document.getElementById('new-chapter-join') as HTMLInputElement).value;
                  const partner_link = (document.getElementById('new-chapter-partner') as HTMLInputElement).value;
                  const live = (document.getElementById('new-chapter-live') as HTMLInputElement).checked;
                  if (name) {
                    addChapter({ name, location: loc, chapter_type: type, lead, member_count: members, banner_url: banner, description, join_link, partner_link, is_live: type === 'campus' ? live : true });
                    setShowAddChapter(false);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }

      {/* EDIT CHAPTER MODAL */}
      {
        editingChapter && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold">Edit Chapter</h3>
                <button onClick={() => setEditingChapter(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
              </div>
              <div className="overflow-y-auto px-8 py-6 space-y-4 scrollbar-thin">
                <input id="edit-chapter-name" defaultValue={editingChapter.name} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Chapter Name" />
                <input id="edit-chapter-loc" defaultValue={editingChapter.location} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Location" />
                <select id="edit-chapter-type" defaultValue={editingChapter.chapter_type || 'city'} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">
                  <option value="city">City Chapter (always public)</option>
                  <option value="campus">Campus Chapter (Private/Live toggle)</option>
                </select>
                <input id="edit-chapter-lead" defaultValue={editingChapter.lead} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Lead name" />
                <input id="edit-chapter-members" type="number" defaultValue={editingChapter.member_count ?? 0} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Member count" />
                <input id="edit-chapter-banner" defaultValue={editingChapter.banner_url} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Banner image URL" />
                <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'chapters', 'edit-chapter-banner')} />
                  {isUploading ? 'UPLOADING...' : 'UPLOAD BANNER FROM DEVICE'}
                </label>
                <textarea id="edit-chapter-desc" defaultValue={editingChapter.description} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-20" placeholder="Header tagline / description" />
                <input id="edit-chapter-join" defaultValue={editingChapter.join_link} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Join Our Chapter link (optional)" />
                <input id="edit-chapter-partner" defaultValue={editingChapter.partner_link} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Partner With Us link (optional)" />
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input id="edit-chapter-live" type="checkbox" defaultChecked={editingChapter.is_live !== false} className="w-4 h-4" />
                  Live (visible on public site) — uncheck for Private
                </label>
              </div>
              <div className="flex justify-end gap-3 px-8 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                <button onClick={() => setEditingChapter(null)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const name = (document.getElementById('edit-chapter-name') as HTMLInputElement).value;
                  const loc = (document.getElementById('edit-chapter-loc') as HTMLInputElement).value;
                  const type = (document.getElementById('edit-chapter-type') as HTMLSelectElement).value as 'city' | 'campus';
                  const lead = (document.getElementById('edit-chapter-lead') as HTMLInputElement).value;
                  const members = Number((document.getElementById('edit-chapter-members') as HTMLInputElement).value || 0);
                  const banner = (document.getElementById('edit-chapter-banner') as HTMLInputElement).value;
                  const description = (document.getElementById('edit-chapter-desc') as HTMLTextAreaElement).value;
                  const join_link = (document.getElementById('edit-chapter-join') as HTMLInputElement).value;
                  const partner_link = (document.getElementById('edit-chapter-partner') as HTMLInputElement).value;
                  const live = (document.getElementById('edit-chapter-live') as HTMLInputElement).checked;
                  if (name) {
                    updateChapter(editingChapter.id, { name, location: loc, chapter_type: type, lead, member_count: members, banner_url: banner, description, join_link, partner_link, is_live: type === 'campus' ? live : true });
                    setEditingChapter(null);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE CHANGES</button>
              </div>
            </div>
          </div>
        )
      }

      {/* ADD/EDIT LEAD MODAL */}
      {
        (showAddLead || editingLead) && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">{editingLead ? 'Edit Lead' : 'Add Lead'}</h3>
              <div className="space-y-4">
                <input id="lead-name" defaultValue={editingLead?.name || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Name" />
                <input id="lead-position" defaultValue={editingLead?.position || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Position (e.g. Community Lead – Delhi)" />
                <input id="lead-avatar" defaultValue={editingLead?.avatar_url || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Avatar image URL" />
                <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'leads', 'lead-avatar')} />
                  {isUploading ? 'UPLOADING...' : 'UPLOAD AVATAR FROM DEVICE'}
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => { setShowAddLead(false); setEditingLead(null); }} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const name = (document.getElementById('lead-name') as HTMLInputElement).value;
                  const position = (document.getElementById('lead-position') as HTMLInputElement).value;
                  const avatar = (document.getElementById('lead-avatar') as HTMLInputElement).value;
                  if (!name || !position) { showToast('Name and position are required', 'error'); return; }
                  if (editingLead) {
                    updateCommunityLead(editingLead.id, { name, position, avatar_url: avatar });
                    setEditingLead(null);
                  } else {
                    addCommunityLead({ name, position, avatar_url: avatar, display_order: communityLeads.length });
                    setShowAddLead(false);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }

      {/* ADD/EDIT CHAPTER EVENT MODAL */}
      {
        (showAddChapterEvent || editingChapterEvent) && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">{editingChapterEvent ? 'Edit Event' : 'Add Event'}</h3>
              <div className="space-y-4">
                <input id="ce-title" defaultValue={editingChapterEvent?.title || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Event title" />
                <div className="grid grid-cols-2 gap-3">
                  <input id="ce-date" defaultValue={editingChapterEvent?.date || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Date" />
                  <input id="ce-location" defaultValue={editingChapterEvent?.location || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Location" />
                </div>
                <input id="ce-banner" defaultValue={editingChapterEvent?.banner_url || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Banner image URL" />
                <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'events', 'ce-banner')} />
                  {isUploading ? 'UPLOADING...' : 'UPLOAD BANNER FROM DEVICE'}
                </label>
                <input id="ce-rsvp" defaultValue={editingChapterEvent?.rsvp_link || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="RSVP link" />
                <select id="ce-chapter" defaultValue={editingChapterEvent?.chapter_id ?? ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">
                  <option value="">— No chapter (global) —</option>
                  {chapters.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select id="ce-subchapter" defaultValue={editingChapterEvent?.subchapter_id ?? ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">
                  <option value="">— No subchapter —</option>
                  {subchapters.map((s: any) => {
                    const parent = chapters.find((c: any) => c.id === s.chapter_id);
                    return (
                      <option key={s.id} value={s.id}>{parent ? parent.name + ' › ' : ''}{s.name}</option>
                    );
                  })}
                </select>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input id="ce-featured" type="checkbox" defaultChecked={editingChapterEvent?.is_featured} className="w-4 h-4" />
                  Featured (shows on Chapters page Featured Events section)
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => { setShowAddChapterEvent(false); setEditingChapterEvent(null); }} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const title = (document.getElementById('ce-title') as HTMLInputElement).value;
                  const date = (document.getElementById('ce-date') as HTMLInputElement).value;
                  const location = (document.getElementById('ce-location') as HTMLInputElement).value;
                  const banner = (document.getElementById('ce-banner') as HTMLInputElement).value;
                  const rsvp = (document.getElementById('ce-rsvp') as HTMLInputElement).value;
                  const chapterId = (document.getElementById('ce-chapter') as HTMLSelectElement).value;
                  const subchapterId = (document.getElementById('ce-subchapter') as HTMLSelectElement).value;
                  const featured = (document.getElementById('ce-featured') as HTMLInputElement).checked;
                  if (!title) { showToast('Title is required', 'error'); return; }
                  const payload: any = { title, date, location, banner_url: banner, rsvp_link: rsvp, is_featured: featured, chapter_id: chapterId ? Number(chapterId) : null, subchapter_id: subchapterId ? Number(subchapterId) : null };
                  if (editingChapterEvent) {
                    updateChapterEvent(editingChapterEvent.id, payload);
                    setEditingChapterEvent(null);
                  } else {
                    addChapterEvent(payload);
                    setShowAddChapterEvent(false);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }

      {/* ADD/EDIT SUBCHAPTER MODAL */}
      {
        (showAddSubchapter || editingSubchapter) && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">{editingSubchapter ? 'Edit Subchapter' : 'Add Subchapter'}</h3>
              <div className="space-y-4">
                <select id="sub-chapter" defaultValue={editingSubchapter?.chapter_id ?? ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">
                  <option value="">— Parent Chapter —</option>
                  {chapters.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input id="sub-name" defaultValue={editingSubchapter?.name || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Subchapter name" />
                <input id="sub-loc" defaultValue={editingSubchapter?.location || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Location" />
                <input id="sub-lead" defaultValue={editingSubchapter?.lead || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Lead name" />
                <input id="sub-members" type="number" defaultValue={editingSubchapter?.member_count ?? 0} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Member count" />
                <input id="sub-banner" defaultValue={editingSubchapter?.banner_url || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Banner image URL" />
                <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'subchapters', 'sub-banner')} />
                  {isUploading ? 'UPLOADING...' : 'UPLOAD BANNER FROM DEVICE'}
                </label>
                <input id="sub-join" defaultValue={editingSubchapter?.join_link || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Join link (optional, per-subchapter)" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => { setShowAddSubchapter(false); setEditingSubchapter(null); }} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const chapter_id = Number((document.getElementById('sub-chapter') as HTMLSelectElement).value);
                  const name = (document.getElementById('sub-name') as HTMLInputElement).value;
                  const location = (document.getElementById('sub-loc') as HTMLInputElement).value;
                  const lead = (document.getElementById('sub-lead') as HTMLInputElement).value;
                  const member_count = Number((document.getElementById('sub-members') as HTMLInputElement).value || 0);
                  const banner_url = (document.getElementById('sub-banner') as HTMLInputElement).value;
                  const join_link = (document.getElementById('sub-join') as HTMLInputElement).value;
                  if (!name || !chapter_id) { showToast('Name and parent chapter are required', 'error'); return; }
                  if (editingSubchapter) {
                    updateSubchapter(editingSubchapter.id, { chapter_id, name, location, lead, member_count, banner_url, join_link });
                    setEditingSubchapter(null);
                  } else {
                    addSubchapter({ chapter_id, name, location, lead, member_count, banner_url, join_link, display_order: subchapters.length });
                    setShowAddSubchapter(false);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }

      {/* EDIT CHAPTER CONTENT MODAL */}
      {
        editingChapterContent && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-2">Edit Page Content</h3>
              <p className="text-sm text-gray-400 mb-6">{editingChapterContent.name}</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">About Us — Title</label>
                  <input id="cc-about-title" defaultValue={chapterContents.find((c: any) => c.chapter_id === editingChapterContent.id)?.about_title || 'About Us'} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">About Us — Text</label>
                  <textarea id="cc-about-text" defaultValue={chapterContents.find((c: any) => c.chapter_id === editingChapterContent.id)?.about_text || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-24" placeholder="About text..." />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">About Us — Image URL</label>
                  <input id="cc-about-image" defaultValue={chapterContents.find((c: any) => c.chapter_id === editingChapterContent.id)?.about_image || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">How We Gather — Title</label>
                  <input id="cc-gather-title" defaultValue={chapterContents.find((c: any) => c.chapter_id === editingChapterContent.id)?.gather_title || 'How We Gather'} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">How We Gather — Text</label>
                  <textarea id="cc-gather-text" defaultValue={chapterContents.find((c: any) => c.chapter_id === editingChapterContent.id)?.gather_text || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-24" placeholder="Gather text..." />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">How We Gather — Image URL</label>
                  <input id="cc-gather-image" defaultValue={chapterContents.find((c: any) => c.chapter_id === editingChapterContent.id)?.gather_image || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Our Values — Title</label>
                  <input id="cc-values-title" defaultValue={chapterContents.find((c: any) => c.chapter_id === editingChapterContent.id)?.values_title || 'Our Values'} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Our Values — Text</label>
                  <textarea id="cc-values-text" defaultValue={chapterContents.find((c: any) => c.chapter_id === editingChapterContent.id)?.values_text || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-24" placeholder="Values text..." />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Our Values — Image URL</label>
                  <input id="cc-values-image" defaultValue={chapterContents.find((c: any) => c.chapter_id === editingChapterContent.id)?.values_image || ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setEditingChapterContent(null)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const payload = {
                    chapter_id: editingChapterContent.id,
                    about_title: (document.getElementById('cc-about-title') as HTMLInputElement).value,
                    about_text: (document.getElementById('cc-about-text') as HTMLTextAreaElement).value,
                    about_image: (document.getElementById('cc-about-image') as HTMLInputElement).value,
                    gather_title: (document.getElementById('cc-gather-title') as HTMLInputElement).value,
                    gather_text: (document.getElementById('cc-gather-text') as HTMLTextAreaElement).value,
                    gather_image: (document.getElementById('cc-gather-image') as HTMLInputElement).value,
                    values_title: (document.getElementById('cc-values-title') as HTMLInputElement).value,
                    values_text: (document.getElementById('cc-values-text') as HTMLTextAreaElement).value,
                    values_image: (document.getElementById('cc-values-image') as HTMLInputElement).value,
                  };
                  upsertChapterContent(payload);
                  setEditingChapterContent(null);
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }

      {/* DELETE CONFIRM Modal */}
      {
        deleteConfirm && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Alert />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Item?</h3>
              <p className="text-sm text-gray-500 mb-6">Are you sure you want to remove this item? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-gray-200">Cancel</button>
                <button onClick={async () => {
                  const { id, type } = deleteConfirm;
                  const numId = Number(id);
                  setDeleteConfirm(null);
                  if (type === 'event') await handleAction(() => deleteFlagshipEvent(numId), 'Event deleted');
                  else if (type === 'card') await handleAction(() => deleteWhatWeDoCard(numId), 'Card deleted');
                  else if (type === 'photo') await handleAction(() => deletePhotoGalleryItem(numId), 'Photo deleted');
                  else if (type === 'story') await handleAction(() => deleteSuccessStory(numId), 'Story deleted');
                  else if (type === 'chapter') await handleAction(() => deleteChapter(numId), 'Chapter deleted');
                  else if (type === 'lead') await handleAction(() => deleteCommunityLead(numId), 'Lead deleted');
                  else if (type === 'chapterEvent') await handleAction(() => deleteChapterEvent(numId), 'Event deleted');
                  else if (type === 'subchapter') await handleAction(() => deleteSubchapter(numId), 'Subchapter deleted');
                  else if (type === 'past_event') await handleAction(() => deletePastEvent(numId), 'Past event deleted');

                }} className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-red-600 shadow-lg shadow-red-200">Delete</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Add/Edit Past Event Modal */}
      {
        (showAddPastEvent || editingPastEvent) && (
          <div key={editingPastEvent?.id || 'new'} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">{editingPastEvent ? 'Edit Past Event' : 'Add Past Event'}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title *</label>
                    <input type="text" defaultValue={editingPastEvent?.title || ''} id="past-title" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="e.g., Web3 Workshop" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date *</label>
                    <input type="text" defaultValue={editingPastEvent?.date || ''} id="past-date" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="e.g., Dec 15, 2025" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Location *</label>
                    <input type="text" defaultValue={editingPastEvent?.location || ''} id="past-location" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="e.g., Delhi" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Event Type</label>
                    <input type="text" defaultValue={editingPastEvent?.event_type || 'workshop'} id="past-type" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="e.g., workshop, meetup" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Attendees Count</label>
                    <input type="number" defaultValue={editingPastEvent?.attendees_count || 0} id="past-attendees" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image URL</label>
                    <div className="flex flex-col gap-2">
                      <input type="text" defaultValue={editingPastEvent?.image_url || ''} id="past-image" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" />
                      <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'past_events', 'past-image')} />
                        {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                  <textarea defaultValue={editingPastEvent?.description || ''} id="past-desc" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm h-24" placeholder="Event description..." />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button onClick={() => { setShowAddPastEvent(false); setEditingPastEvent(null); }} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-gray-200">Cancel</button>
                <button onClick={async () => {
                  const title = (document.getElementById('past-title') as HTMLInputElement).value;
                  const date = (document.getElementById('past-date') as HTMLInputElement).value;
                  const location = (document.getElementById('past-location') as HTMLInputElement).value;
                  const event_type = (document.getElementById('past-type') as HTMLInputElement).value;
                  const attendees_count = parseInt((document.getElementById('past-attendees') as HTMLInputElement).value) || 0;
                  const image_url = (document.getElementById('past-image') as HTMLInputElement).value;
                  const description = (document.getElementById('past-desc') as HTMLTextAreaElement).value;

                  if (!title) { showToast('Title is required', 'error'); return; }

                  const eventData = { title, date, location, event_type, attendees_count, image_url, description, is_public: true };

                  if (editingPastEvent) {
                    await handleAction(() => updatePastEvent(editingPastEvent.id, eventData), 'Event updated');
                  } else {
                    await handleAction(() => addPastEvent(eventData), 'Event created');
                  }
                  setShowAddPastEvent(false);
                  setEditingPastEvent(null);
                }} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-indigo-700 shadow-lg shadow-indigo-200">{editingPastEvent ? 'Update' : 'Add'} Event</button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};


export default AdminPanel;


