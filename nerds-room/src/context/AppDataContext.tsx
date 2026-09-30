
import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';
import { compressImage } from '../utils/imageCompression';

// Types moved to src/types/index.ts
import type {
  Registration,
  WhatWeDoCard,
  FlagshipEvent,
  PhotoGalleryItem,
  SuccessStory,
  Chapter,
  CommunityLead,
  ChapterEvent,
  Subchapter,
  ChapterContent,
  UserRole,
  Hackathon,
  Workshop,
  PastEvent,
  OtherEvent,
  DashboardStats,
  HeroContent,
  SocialLinks,
  MissionLetterData,
  RegistrationForm,
  Tag,
  Toast,
  WhoWeAreContent
} from '../types';

interface AppDataContextType {

  // Auth
  session: Session | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;

  // Registrations
  registrations: Registration[];
  totalRegs: number;
  totalApprovedRegs: number;
  addRegistration: (reg: Omit<Registration, 'id' | 'createdAt'>) => Promise<void>;
  updateRegistrationStatus: (id: number, status: 'pending' | 'approved' | 'rejected') => Promise<void>;
  updateRegistration: (id: number, updates: Partial<Registration>) => Promise<void>;
  deleteRegistration: (id: number) => Promise<void>;

  // WhatWeDo Cards
  whatWeDoCards: WhatWeDoCard[];
  addWhatWeDoCard: (card: Omit<WhatWeDoCard, 'id'>) => Promise<void>;
  updateWhatWeDoCard: (id: number, updates: Partial<WhatWeDoCard>) => Promise<void>;
  deleteWhatWeDoCard: (id: number) => Promise<void>;

  // Flagship Events
  flagshipEvents: FlagshipEvent[];
  addFlagshipEvent: (event: Omit<FlagshipEvent, 'id'>) => Promise<void>;
  updateFlagshipEvent: (id: number, updates: Partial<FlagshipEvent>) => Promise<void>;
  deleteFlagshipEvent: (id: number) => Promise<void>;

  // Photo Gallery
  photoGallery: PhotoGalleryItem[];
  addPhotoGalleryItem: (item: Omit<PhotoGalleryItem, 'id'>) => Promise<void>;
  updatePhotoGalleryItem: (id: number, updates: Partial<PhotoGalleryItem>) => Promise<void>;
  deletePhotoGalleryItem: (id: number) => Promise<void>;

  // Success Stories
  successStories: SuccessStory[];
  addSuccessStory: (story: Omit<SuccessStory, 'id'>) => Promise<void>;
  updateSuccessStory: (id: number, updates: Partial<SuccessStory>) => Promise<void>;
  deleteSuccessStory: (id: number) => Promise<void>;

  // Chapters
  chapters: Chapter[];
  addChapter: (chapter: Omit<Chapter, 'id'>) => Promise<void>;
  updateChapter: (id: number, updates: Partial<Chapter>) => Promise<void>;
  deleteChapter: (id: number) => Promise<void>;
  reorderChapter: (id: number, direction: 'up' | 'down') => Promise<void>;

  // Community Leads
  communityLeads: CommunityLead[];
  addCommunityLead: (lead: Omit<CommunityLead, 'id'>) => Promise<void>;
  updateCommunityLead: (id: number, updates: Partial<CommunityLead>) => Promise<void>;
  deleteCommunityLead: (id: number) => Promise<void>;
  reorderCommunityLead: (id: number, direction: 'up' | 'down') => Promise<void>;

  // Chapter Events
  chapterEvents: ChapterEvent[];
  addChapterEvent: (event: Omit<ChapterEvent, 'id'>) => Promise<void>;
  updateChapterEvent: (id: number, updates: Partial<ChapterEvent>) => Promise<void>;
  deleteChapterEvent: (id: number) => Promise<void>;
  reorderChapterEvent: (id: number, direction: 'up' | 'down') => Promise<void>;

  // Subchapters
  subchapters: Subchapter[];
  addSubchapter: (sub: Omit<Subchapter, 'id'>) => Promise<void>;
  updateSubchapter: (id: number, updates: Partial<Subchapter>) => Promise<void>;
  deleteSubchapter: (id: number) => Promise<void>;
  reorderSubchapter: (id: number, direction: 'up' | 'down') => Promise<void>;

  // Chapter Content
  chapterContents: ChapterContent[];
  upsertChapterContent: (content: Omit<ChapterContent, 'id'>) => Promise<void>;

  // Roles
  userRoles: UserRole[];
  isSuperAdmin: boolean;
  adminChapterId: number | null;

  // Hackathons
  hackathons: Hackathon[];
  addHackathon: (hackathon: Omit<Hackathon, 'id'>) => Promise<void>;
  updateHackathon: (id: number, updates: Partial<Hackathon>) => Promise<void>;
  deleteHackathon: (id: number) => Promise<void>;

  // Past Events
  pastEvents: PastEvent[];
  addPastEvent: (event: Omit<PastEvent, 'id'>) => Promise<void>;
  updatePastEvent: (id: number, updates: Partial<PastEvent>) => Promise<void>;
  deletePastEvent: (id: number) => Promise<void>;

  // Other Events
  otherEvents: OtherEvent[];
  addOtherEvent: (event: Omit<OtherEvent, 'id'>) => Promise<void>;
  updateOtherEvent: (id: number, updates: Partial<OtherEvent>) => Promise<void>;
  deleteOtherEvent: (id: number) => Promise<void>;

  // Workshops
  workshops: Workshop[];
  addWorkshop: (workshop: Omit<Workshop, 'id'>) => Promise<void>;
  updateWorkshop: (id: number, updates: Partial<Workshop>) => Promise<void>;
  deleteWorkshop: (id: number) => Promise<void>;

  // Registration Forms
  registrationForms: RegistrationForm[];
  addRegistrationForm: (form: Omit<RegistrationForm, 'id' | 'created_at'>) => Promise<void>;
  updateRegistrationForm: (id: string, updates: Partial<RegistrationForm>) => Promise<void>;
  deleteRegistrationForm: (id: string) => Promise<void>;

  // Partners
  partners: string[];
  setPartners: (partners: string[]) => Promise<void>;


  // Site Content
  supportedByText: string;
  setSupportedByText: (text: string) => Promise<void>;
  heroContent: HeroContent;
  updateHeroContent: (updates: Partial<HeroContent>) => Promise<void>;
  socialLinks: SocialLinks;
  updateSocialLinks: (updates: Partial<SocialLinks>) => Promise<void>;
  footerDescription: string;
  setFooterDescription: (text: string) => Promise<void>;
  announcementText: string;
  setAnnouncementText: (text: string) => Promise<void>;
  whoWeAreContent: WhoWeAreContent;
  updateWhoWeAreContent: (updates: Partial<WhoWeAreContent>) => Promise<void>;

  // Mission Letter
  missionLetter: MissionLetterData | null;
  updateMissionLetter: (updates: Partial<MissionLetterData>) => Promise<void>;

  // Tags
  tags: Tag[];
  addTag: (tag: Omit<Tag, 'id'>) => Promise<void>;
  updateTag: (id: number, updates: Partial<Tag>) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;

  // Dashboard Stats
  dashboardStats: DashboardStats;

  // Settings
  joinCommunityLink: string;
  setJoinCommunityLink: (link: string) => Promise<void>;
  chaptersHeaderBanner: string;
  setChaptersHeaderBanner: (url: string) => Promise<void>;
  chaptersHeaderBannerOpacity: number;
  setChaptersHeaderBannerOpacity: (opacity: number) => Promise<void>;
  registrationsOpen: boolean;
  setRegistrationsOpen: (open: boolean) => Promise<void>;
  emailNotifications: boolean;
  setEmailNotifications: (enabled: boolean) => Promise<void>;
  autoApprove: boolean;
  setAutoApprove: (enabled: boolean) => Promise<void>;
  maintenanceMode: boolean;
  setMaintenanceMode: (enabled: boolean) => Promise<void>;

  // Utility
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  uploadFile: (file: File, bucket: string) => Promise<string | null>;
  convertGoogleDriveUrl: (url: string) => string;
  normalizeUrl: (url: string) => string;
  getGrowthData: () => { labels: string[], data: number[] };
  refreshData: () => Promise<void>;
  navigate: (to: string) => void;
}



const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
};

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);


  // Data States
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [totalRegs, setTotalRegs] = useState(0);
  const [totalApprovedRegs, setTotalApprovedRegs] = useState(0);
  const [whatWeDoCards, setWhatWeDoCards] = useState<WhatWeDoCard[]>([]);
  const [flagshipEvents, setFlagshipEvents] = useState<FlagshipEvent[]>([]);
  const [photoGallery, setPhotoGallery] = useState<PhotoGalleryItem[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [communityLeads, setCommunityLeads] = useState<CommunityLead[]>([]);
  const [chapterEvents, setChapterEvents] = useState<ChapterEvent[]>([]);
  const [subchapters, setSubchapters] = useState<Subchapter[]>([]);
  const [chapterContents, setChapterContents] = useState<ChapterContent[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminChapterId, setAdminChapterId] = useState<number | null>(null);
  const [hackathons, setHackathons] = useState<Hackathon[]>(() => {
    try {
      const cached = localStorage.getItem('cache_hackathons');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [otherEvents, setOtherEvents] = useState<OtherEvent[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrationForms, setRegistrationForms] = useState<RegistrationForm[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [missionLetter, setMissionLetter] = useState<MissionLetterData | null>(null);
  const [partners, setPartnersState] = useState<string[]>([]);
  const [supportedByText, setSupportedByTextState] = useState('');
  const [heroContent, setHeroContentState] = useState<HeroContent>({
    headingLine1: 'THINK. CREATE.',
    headingLine2: 'INNOVATE THE',
    headingLine3: 'FUTURE.',
    description: 'Join the premier student community building the future of technology.',
    primaryCTA: 'JOIN US',
    primaryCTALink: '#join',
    secondaryCTA: 'EVENTS',
    secondaryCTALink: '/events',
  });

  const [socialLinks, setSocialLinksState] = useState<SocialLinks>({
    telegram: '', instagram: '', linkedin: '', discord: '', twitter: '', youtube: '', whatsapp: ''
  });
  const [footerDescription, setFooterDescriptionState] = useState('');
  const [announcementText, setAnnouncementTextState] = useState('');
  const [whoWeAreContent, setWhoWeAreContentState] = useState<WhoWeAreContent>({
    headingLine1: 'WHO WE',
    headingLine2: 'ARE',
    description: 'We are tired of boring corporate conferences. We wanted a space where the energy is practical, the people are building, and the ideas are raw.',
    description2: "From 24-hour hackathons to intense ideation jams, we've brought together hundreds of students across NCR to build things that actually matter."
  });

  // Config
  const [registrationsOpen, setRegistrationsOpenState] = useState(true);
  const [emailNotifications, setEmailNotificationsState] = useState(true);
  const [autoApprove, setAutoApproveState] = useState(false);
  const [maintenanceMode, setMaintenanceModeState] = useState(false);
  const [joinCommunityLink, setJoinCommunityLinkState] = useState('https://discord.gg/nerdsroom');
  const [chaptersHeaderBanner, setChaptersHeaderBannerState] = useState('');
  const [chaptersHeaderBannerOpacity, setChaptersHeaderBannerOpacityState] = useState(0.6);

  // Cache timestamps to prevent excessive fetching
  const lastFetchTime = useRef<{ [key: string]: number }>({});
  const CACHE_DURATION = 30000; // 30 seconds cache
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shouldFetch = (key: string): boolean => {
    const now = Date.now();
    const lastFetch = lastFetchTime.current[key] || 0;
    return now - lastFetch > CACHE_DURATION;
  };

  const markFetched = (key: string) => {
    lastFetchTime.current[key] = Date.now();
  };

  const fetchData = async (force: boolean = false) => {
    // Clear any pending debounced fetch
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

    const modules = [
      { key: 'registrations', fn: fetchRegistrations },
      { key: 'whatWeDo', fn: fetchWhatWeDo },
      { key: 'flagshipEvents', fn: fetchFlagshipEvents },
      { key: 'photoGallery', fn: fetchPhotoGallery },
      { key: 'successStories', fn: fetchSuccessStories },
      { key: 'chapters', fn: fetchChapters },
      { key: 'communityLeads', fn: fetchCommunityLeads },
      { key: 'chapterEvents', fn: fetchChapterEvents },
      { key: 'subchapters', fn: fetchSubchapters },
      { key: 'chapterContents', fn: fetchChapterContents },
      { key: 'userRoles', fn: fetchUserRoles },
      { key: 'hackathons', fn: fetchHackathons },
      { key: 'pastEvents', fn: fetchPastEvents },
      { key: 'otherEvents', fn: fetchOtherEvents },
      { key: 'workshops', fn: fetchWorkshops },
      { key: 'registrationForms', fn: fetchRegistrationForms },
      { key: 'tags', fn: fetchTags },
      { key: 'missionLetter', fn: fetchMissionLetter },
      { key: 'partners', fn: fetchPartners },
      { key: 'settings', fn: fetchSettings }
    ];

    const promises: { key: string; fn: () => Promise<void> }[] = [];
    modules.forEach(mod => {
      if (force || shouldFetch(mod.key)) {
        promises.push(mod);
      }
    });

    if (promises.length === 0) return;

    // Only show global loading on forced refreshes or initial load (force = true or first fetch)
    const showGlobalLoading = force || !lastFetchTime.current['hackathons'];
    if (showGlobalLoading) setLoading(true);

    try {
      const startTime = Date.now();

      const fetchPromises = promises.map(mod =>
        mod.fn().then(() => markFetched(mod.key))
      );

      await Promise.all(fetchPromises);
      console.log('[NerdsRoom] Data fetch complete.');

      // Ensure loading lasts at least 0.5 seconds ONLY for initial/forced loads
      if (showGlobalLoading) {
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 500;
        if (elapsedTime < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
        }
      }
    } catch (error) {
      console.error('[NerdsRoom] Global Fetch Error:', error);
    } finally {
      if (showGlobalLoading) setLoading(false);
    }
  };

  // Debounced version for realtime updates
  const debouncedFetchData = () => {
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    fetchTimeoutRef.current = setTimeout(() => {
      fetchData();
    }, 2000); // 2 second debounce for realtime bursts
  };

  // Initialize Auth & Data
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
      }
      fetchData();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session);
        fetchData();
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        // Clear caches on logout
        lastFetchTime.current = {};
      }
    });

    const handleOnline = () => {
      fetchData(true);
    };

    window.addEventListener('online', handleOnline);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('online', handleOnline);
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, []);

  const refreshData = () => fetchData(true);

  // Real-time subscription for changes (Generic listener for all tables)
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          // Invalidate cache for this specific table
          const tableToKeyMap: any = {
            'registrations': 'registrations',
            'photo_gallery': 'photoGallery',
            'hackathons': 'hackathons',
            'registration_forms': 'registrationForms',
            'tags': 'tags',
            'workshops': 'workshops'
          };

          if (tableToKeyMap[payload.table]) {
            delete lastFetchTime.current[tableToKeyMap[payload.table]];
            debouncedFetchData();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- Fetchers ---

  const fetchRegistrations = async () => {
    try {
      const { count: total, error: e1 } = await supabase.from('registrations').select('*', { count: 'exact', head: true });
      if (e1) console.error('[NerdsRoom] fetchRegistrations Count Error:', e1);

      const { count: approved, error: e2 } = await supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'approved');
      if (e2) console.error('[NerdsRoom] fetchRegistrations Approved Count Error:', e2);

      if (total !== null) setTotalRegs(total);
      if (approved !== null) setTotalApprovedRegs(approved);

      const { data, error: e3 } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (e3) console.error('[NerdsRoom] fetchRegistrations Data Error:', e3);
      if (data) setRegistrations(data.map(d => ({ ...d, createdAt: d.created_at })));
    } catch (err) {
      console.error('[NerdsRoom] fetchRegistrations Unexpected Error:', err);
    }
  };

  const fetchWhatWeDo = async () => {
    const { data } = await supabase.from('what_we_do_cards').select('*').order('id', { ascending: true });
    if (data) setWhatWeDoCards(data.map(d => ({ ...d, statLabel: d.stat_label, iconBg: d.icon_bg })));
  };

  const fetchFlagshipEvents = async () => {
    try {
      const { data, error } = await supabase.from('flagship_events').select('*').order('created_at', { ascending: true });
      if (error) {
        console.error('[NerdsRoom] fetchFlagshipEvents Error:', error);
        return;
      }
      if (data) {
        setFlagshipEvents(data.map(d => ({
          ...d,
          // Handle both 'image' and 'image_url' column names
          image: d.image_url || d.image || 'https://via.placeholder.com/800x1000'
        })));
      }
    } catch (err) {
      console.error('[NerdsRoom] fetchFlagshipEvents Unexpected Error:', err);
    }
  };

  const fetchPhotoGallery = async () => {
    const { data } = await supabase.from('photo_gallery').select('*').order('created_at', { ascending: true });
    if (data) setPhotoGallery(data);
  };

  const fetchSuccessStories = async () => {
    const { data } = await supabase.from('success_stories').select('*').order('display_order', { ascending: true });
    if (data) setSuccessStories(data);
  };

  const fetchChapters = async () => {
    const { data } = await supabase.from('chapters').select('*').order('display_order', { ascending: true });
    if (data) setChapters(data);
  };

  const fetchCommunityLeads = async () => {
    const { data } = await supabase.from('community_leads').select('*').order('display_order', { ascending: true });
    if (data) setCommunityLeads(data);
  };

  const fetchSubchapters = async () => {
    const { data } = await supabase.from('subchapters').select('*').order('display_order', { ascending: true });
    if (data) setSubchapters(data);
  };

  const fetchChapterContents = async () => {
    const { data } = await supabase.from('chapter_content').select('*');
    if (data) setChapterContents(data);
  };

  const fetchChapterEvents = async () => {
    const { data } = await supabase.from('chapter_events').select('*').order('display_order', { ascending: true });
    if (data) setChapterEvents(data);
  };

  const fetchUserRoles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsSuperAdmin(false);
      setAdminChapterId(null);
      setUserRoles([]);
      return;
    }
    const { data } = await supabase.from('user_roles').select('*').or(`user_id.eq.${user.id}`);
    if (data) {
      setUserRoles(data);
      const superAdmin = data.some(r => r.role === 'superadmin');
      setIsSuperAdmin(superAdmin);
      const chapterAdmin = data.find(r => r.role === 'chapter_admin');
      setAdminChapterId(superAdmin ? null : (chapterAdmin?.chapter_id ?? null));
    }
  };

  const fetchHackathons = async () => {
    const { data } = await supabase.from('hackathons').select('*').order('created_at', { ascending: false });
    if (data) {
      const mapped = data.map(h => ({
        ...h,
        tags: h.tags || []
      }));
      setHackathons(mapped);
      localStorage.setItem('cache_hackathons', JSON.stringify(mapped));
    }
  };

  const fetchPastEvents = async () => {
    try {
      const { data, error } = await supabase.from('past_events').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('[NerdsRoom] fetchPastEvents Error:', error);
        return;
      }
      if (data) {
        // Ensure image_url is populated even if DB column is named 'image'
        setPastEvents(data.map(d => ({
          ...d,
          date: d.date || d.dates || '',
          image_url: d.image_url || d.image || ''
        })));
      }
    } catch (err) {
      console.error('[NerdsRoom] fetchPastEvents Unexpected Error:', err);
    }
  };

  const fetchOtherEvents = async () => {
    const { data } = await supabase.from('other_events').select('*').order('created_at', { ascending: false });
    if (data) setOtherEvents(data);
  };

  const fetchRegistrationForms = async () => {
    const { data } = await supabase.from('registration_forms').select('*').order('created_at', { ascending: false });
    if (data) setRegistrationForms(data);
  };

  const fetchTags = async () => {
    const { data } = await supabase.from('tags').select('*').order('name', { ascending: true });
    if (data) setTags(data);
  };

  const fetchPartners = async () => {
    const { data } = await supabase.from('partners').select('name').order('created_at', { ascending: true });
    if (data && data.length > 0) setPartnersState(data.map(p => p.name));
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) console.error('[NerdsRoom] fetchSettings Error:', error);
    if (data) {
      data.forEach(setting => {
        const val = setting.value;
        switch (setting.key) {
          case 'hero_content': setHeroContentState(val); break;
          case 'social_links': setSocialLinksState(val); break;
          case 'supported_by_text': if (val) setSupportedByTextState(val); break;
          case 'footer_description': setFooterDescriptionState(val); break;
          case 'announcement_text': setAnnouncementTextState(val); break;
          case 'registrations_open': setRegistrationsOpenState(val); break;
          case 'email_notifications': setEmailNotificationsState(val); break;
          case 'auto_approve': setAutoApproveState(val); break;
          case 'maintenance_mode': setMaintenanceModeState(val); break;
          case 'join_community_link': if (val) setJoinCommunityLinkState(val); break;
          case 'chapters_header_banner': if (val) setChaptersHeaderBannerState(val); break;
          case 'chapters_header_banner_opacity': if (typeof val === 'number') setChaptersHeaderBannerOpacityState(val); break;
          case 'who_we_are_content': if (val) setWhoWeAreContentState(val); break;
        }
      });
    }
  };

  // --- Actions ---

  const signIn = async (email: string, pass: string) => {
    return await supabase.auth.signInWithPassword({ email, password: pass });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Registrations
  const addRegistration = async (reg: Omit<Registration, 'id' | 'createdAt'>) => {
    // Optimistic update
    const dummyId = Date.now();
    const optimisticReg = { ...reg, id: dummyId, createdAt: new Date().toISOString() } as Registration;

    // 1. Update list and count immediately
    setRegistrations(prev => [optimisticReg, ...prev].slice(0, 50));
    setTotalRegs(prev => prev + 1);
    if (reg.status === 'approved') setTotalApprovedRegs(prev => prev + 1);

    try {
      const { data, error } = await supabase.from('registrations').insert([reg]).select().single();
      if (error) throw error;

      // Update with real data if needed (optional since we're using realtime often)
      if (data) {
        setRegistrations(prev => prev.map(r => r.id === dummyId ? { ...data, createdAt: data.created_at } : r));
      }
    } catch (err) {
      // Revert on error
      setRegistrations(prev => prev.filter(r => r.id !== dummyId));
      setTotalRegs(prev => prev - 1);
      if (reg.status === 'approved') setTotalApprovedRegs(prev => prev - 1);
      console.error('Registration failed:', err);
      throw err;
    }
  };

  const updateRegistrationStatus = async (id: number, status: string) => {
    // Optimistic
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r));
    await supabase.from('registrations').update({ status }).eq('id', id);
  };

  const updateRegistration = async (id: number, updates: Partial<Registration>) => {
    // Optimistic
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    const { error } = await supabase.from('registrations').update(updates).eq('id', id);
    if (error) {
      console.error(error);
      fetchRegistrations();
    }
  };

  const deleteRegistration = async (id: number) => {
    setRegistrations(prev => prev.filter(r => r.id !== id));
    await supabase.from('registrations').delete().eq('id', id);
  };

  // What We Do
  const addWhatWeDoCard = async (card: Omit<WhatWeDoCard, 'id'>) => {
    const { error } = await supabase.from('what_we_do_cards').insert([{
      title: card.title,
      description: card.description,
      icon: typeof card.icon === 'string' ? card.icon : '🚀', // Handle react node vs string
      stat: card.stat,
      stat_label: card.statLabel,
      icon_bg: card.iconBg,
      gradient: card.gradient
    }]);
    if (!error) fetchWhatWeDo();
  };

  const updateWhatWeDoCard = async (id: number, updates: Partial<WhatWeDoCard>) => {
    const { error } = await supabase.from('what_we_do_cards').update({
      title: updates.title,
      description: updates.description,
      stat: updates.stat,
      stat_label: updates.statLabel
    }).eq('id', id);
    if (!error) fetchWhatWeDo();
  };

  const deleteWhatWeDoCard = async (id: number) => {
    const { error } = await supabase.from('what_we_do_cards').delete().eq('id', id);
    if (!error) fetchWhatWeDo();
  };

  // Flagship Events
  const addFlagshipEvent = async (event: Omit<FlagshipEvent, 'id'>) => {
    const { error } = await supabase.from('flagship_events').insert([{
      title: event.title,
      description: event.description,
      image_url: event.image,
      location: event.location,
      stats: event.stats,
      is_public: event.is_public ?? true,
      is_featured: event.is_featured ?? false,
      registration_link: event.registration_link ?? null,
    }]);
    if (!error) fetchFlagshipEvents();
  };

  const updateFlagshipEvent = async (id: number, updates: Partial<FlagshipEvent>) => {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.stats !== undefined) payload.stats = updates.stats;
    if (updates.image !== undefined) payload.image_url = updates.image;
    if (updates.is_public !== undefined) payload.is_public = updates.is_public;
    if (updates.is_featured !== undefined) payload.is_featured = updates.is_featured;
    if (updates.registration_link !== undefined) payload.registration_link = updates.registration_link || null;

    const { error } = await supabase.from('flagship_events').update(payload).eq('id', id);
    if (!error) fetchFlagshipEvents();
  };

  const deleteFlagshipEvent = async (id: number) => {
    const { error } = await supabase.from('flagship_events').delete().eq('id', id);
    if (!error) fetchFlagshipEvents();
  };

  // Photo Gallery
  // Helper to rebalance gallery layout to 2-3-4-3-2
  const balanceGallery = async () => {
    // 1. Fetch current list
    const { data: allPhotos } = await supabase.from('photo_gallery').select('*').order('created_at', { ascending: true });

    if (!allPhotos || allPhotos.length === 0) return;

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
            updates.push(supabase.from('photo_gallery').update({ category: dist.cat }).eq('id', photo.id));
          }
          currentIndex++;
        }
      }
    }

    // Handle overflow - put rest in col4 for now
    while (currentIndex < allPhotos.length) {
      const photo = allPhotos[currentIndex];
      if (photo.category !== 'col4') {
        updates.push(supabase.from('photo_gallery').update({ category: 'col4' }).eq('id', photo.id));
      }
      currentIndex++;
    }

    if (updates.length > 0) {
      await Promise.all(updates);
    }

    // Final fetch to update UI
    fetchPhotoGallery();
  };

  const addPhotoGalleryItem = async (item: Omit<PhotoGalleryItem, 'id'>) => {
    // Insert with a placeholder category, we'll fix it immediately
    const { error } = await supabase.from('photo_gallery').insert([{ ...item, category: 'col4' }]);
    if (!error) {
      await balanceGallery();
    }
  };

  const updatePhotoGalleryItem = async (id: number, updates: Partial<PhotoGalleryItem>) => {
    const { error } = await supabase.from('photo_gallery').update(updates).eq('id', id);
    if (!error) fetchPhotoGallery();
  };

  const deletePhotoGalleryItem = async (id: number) => {
    const { error } = await supabase.from('photo_gallery').delete().eq('id', id);
    if (!error) {
      await balanceGallery();
    }
  };

  // Success Stories
  const addSuccessStory = async (story: Omit<SuccessStory, 'id'>) => {
    const { error } = await supabase.from('success_stories').insert([story]);
    if (!error) fetchSuccessStories();
  };

  const updateSuccessStory = async (id: number, updates: Partial<SuccessStory>) => {
    const { error } = await supabase.from('success_stories').update(updates).eq('id', id);
    if (!error) fetchSuccessStories();
  };

  const deleteSuccessStory = async (id: number) => {
    const { error } = await supabase.from('success_stories').delete().eq('id', id);
    if (!error) fetchSuccessStories();
  };

  // Mission Letter
  const fetchMissionLetter = async () => {
    const { data } = await supabase.from('mission_letter').select('*').limit(1).single();
    if (data) setMissionLetter(data);
  };

  const updateMissionLetter = async (updates: Partial<MissionLetterData>) => {
    // Upsert logic for single row table, usually ID 1
    const { error } = await supabase.from('mission_letter').upsert({ id: 1, ...updates });
    if (!error) fetchMissionLetter();
  };

  // Chapters
  const addChapter = async (chapter: Omit<Chapter, 'id'>) => {
    const order = (chapters || []).length;
    const { error } = await supabase.from('chapters').insert([{ ...chapter, display_order: order }]);
    if (!error) fetchChapters();
  };

  const updateChapter = async (id: number, updates: Partial<Chapter>) => {
    const { error } = await supabase.from('chapters').update(updates).eq('id', id);
    if (!error) fetchChapters();
  };

  const deleteChapter = async (id: number) => {
    const { error } = await supabase.from('chapters').delete().eq('id', id);
    if (!error) fetchChapters();
  };

  const reorderChapter = async (id: number, direction: 'up' | 'down') => {
    const sorted = [...chapters].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const idx = sorted.findIndex(c => c.id === id);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const current = sorted[idx];
    const target = sorted[swapIdx];
    const curOrder = current.display_order ?? idx;
    const tgtOrder = target.display_order ?? swapIdx;
    await supabase.from('chapters').update({ display_order: tgtOrder }).eq('id', current.id);
    await supabase.from('chapters').update({ display_order: curOrder }).eq('id', target.id);
    fetchChapters();
  };

  // Subchapters
  const addSubchapter = async (sub: Omit<Subchapter, 'id'>) => {
    const { error } = await supabase.from('subchapters').insert([sub]);
    if (!error) fetchSubchapters();
  };

  const updateSubchapter = async (id: number, updates: Partial<Subchapter>) => {
    const { error } = await supabase.from('subchapters').update(updates).eq('id', id);
    if (!error) fetchSubchapters();
  };

  const deleteSubchapter = async (id: number) => {
    const { error } = await supabase.from('subchapters').delete().eq('id', id);
    if (!error) fetchSubchapters();
  };

  const reorderSubchapter = async (id: number, direction: 'up' | 'down') => {
    const sorted = [...subchapters].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const idx = sorted.findIndex(s => s.id === id);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const current = sorted[idx];
    const target = sorted[swapIdx];
    const curOrder = current.display_order ?? idx;
    const tgtOrder = target.display_order ?? swapIdx;
    await supabase.from('subchapters').update({ display_order: tgtOrder }).eq('id', current.id);
    await supabase.from('subchapters').update({ display_order: curOrder }).eq('id', target.id);
    fetchSubchapters();
  };

  // Chapter Content (upsert one row per chapter)
  const upsertChapterContent = async (content: Omit<ChapterContent, 'id'>) => {
    const { error } = await supabase
      .from('chapter_content')
      .upsert([content], { onConflict: 'chapter_id' });
    if (!error) fetchChapterContents();
  };

  // Community Leads
  const addCommunityLead = async (lead: Omit<CommunityLead, 'id'>) => {
    const { error } = await supabase.from('community_leads').insert([{
      name: lead.name,
      position: lead.position,
      avatar_url: lead.avatar_url ?? null,
      display_order: lead.display_order ?? 0,
    }]);
    if (!error) fetchCommunityLeads();
  };

  const updateCommunityLead = async (id: number, updates: Partial<CommunityLead>) => {
    const { error } = await supabase.from('community_leads').update(updates).eq('id', id);
    if (!error) fetchCommunityLeads();
  };

  const deleteCommunityLead = async (id: number) => {
    const { error } = await supabase.from('community_leads').delete().eq('id', id);
    if (!error) fetchCommunityLeads();
  };

  const reorderCommunityLead = async (id: number, direction: 'up' | 'down') => {
    const sorted = [...communityLeads].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const idx = sorted.findIndex(l => l.id === id);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const current = sorted[idx];
    const target = sorted[swapIdx];
    const curOrder = current.display_order ?? idx;
    const tgtOrder = target.display_order ?? swapIdx;
    // Swap display_order values
    await supabase.from('community_leads').update({ display_order: tgtOrder }).eq('id', current.id);
    await supabase.from('community_leads').update({ display_order: curOrder }).eq('id', target.id);
    fetchCommunityLeads();
  };

  // Chapter Events
  const addChapterEvent = async (event: Omit<ChapterEvent, 'id'>) => {
    const order = (chapterEvents || []).length;
    const { error } = await supabase.from('chapter_events').insert([{
      title: event.title,
      date: event.date ?? null,
      location: event.location ?? null,
      banner_url: event.banner_url ?? null,
      rsvp_link: event.rsvp_link ?? null,
      is_featured: event.is_featured ?? false,
      chapter_id: event.chapter_id ?? null,
      subchapter_id: event.subchapter_id ?? null,
      display_order: order,
    }]);
    if (!error) fetchChapterEvents();
  };

  const updateChapterEvent = async (id: number, updates: Partial<ChapterEvent>) => {
    const { error } = await supabase.from('chapter_events').update(updates).eq('id', id);
    if (!error) fetchChapterEvents();
  };

  const deleteChapterEvent = async (id: number) => {
    const { error } = await supabase.from('chapter_events').delete().eq('id', id);
    if (!error) fetchChapterEvents();
  };

  const reorderChapterEvent = async (id: number, direction: 'up' | 'down') => {
    const sorted = [...chapterEvents].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const idx = sorted.findIndex(e => e.id === id);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const current = sorted[idx];
    const target = sorted[swapIdx];
    const curOrder = current.display_order ?? idx;
    const tgtOrder = target.display_order ?? swapIdx;
    await supabase.from('chapter_events').update({ display_order: tgtOrder }).eq('id', current.id);
    await supabase.from('chapter_events').update({ display_order: curOrder }).eq('id', target.id);
    fetchChapterEvents();
  };

  // Hackathons
  const addHackathon = async (hackathon: Omit<Hackathon, 'id'>) => {
    const { error } = await supabase.from('hackathons').insert([hackathon]);
    if (!error) fetchHackathons();
  };

  const updateHackathon = async (id: number, updates: Partial<Hackathon>) => {
    console.log('Updating hackathon:', id, 'with:', updates);
    const { error } = await supabase.from('hackathons').update(updates).eq('id', id);
    if (error) {
      console.error('Failed to update hackathon:', error);
      showToast('Failed to update: ' + error.message, 'error');
    } else {
      fetchHackathons();
    }
  };

  const deleteHackathon = async (id: number) => {
    const { error } = await supabase.from('hackathons').delete().eq('id', id);
    if (!error) fetchHackathons();
  };

  // Registration Forms
  const addRegistrationForm = async (form: Omit<RegistrationForm, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('registration_forms').insert([form]);
    if (!error) fetchRegistrationForms();
  };

  const updateRegistrationForm = async (id: string, updates: Partial<RegistrationForm>) => {
    const { error } = await supabase.from('registration_forms').update(updates).eq('id', id);
    if (!error) fetchRegistrationForms();
  };

  const deleteRegistrationForm = async (id: string) => {
    const { error } = await supabase.from('registration_forms').delete().eq('id', id);
    if (!error) fetchRegistrationForms();
  };

  // Tags
  const addTag = async (tag: Omit<Tag, 'id'>) => {
    const { error } = await supabase.from('tags').insert([tag]);
    if (error) {
      showToast('Failed to add tag: ' + error.message, 'error');
    } else {
      fetchTags();
    }
  };

  const updateTag = async (id: number, updates: Partial<Tag>) => {
    const { error } = await supabase.from('tags').update(updates).eq('id', id);
    if (error) {
      showToast('Failed to update tag: ' + error.message, 'error');
    } else {
      fetchTags();
    }
  };

  const deleteTag = async (id: number) => {
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) {
      showToast('Failed to delete tag: ' + error.message, 'error');
    } else {
      fetchTags();
    }
  };

  const addPastEvent = async (event: Omit<PastEvent, 'id'>) => {
    const { error } = await supabase.from('past_events').insert([event]);
    if (error) throw error;
    await fetchPastEvents();
  };

  const updatePastEvent = async (id: number, updates: Partial<PastEvent>) => {
    const { error } = await supabase.from('past_events').update(updates).eq('id', id);
    if (error) throw error;
    await fetchPastEvents();
  };

  const deletePastEvent = async (id: number) => {
    const { error } = await supabase.from('past_events').delete().eq('id', id);
    if (error) throw error;
    await fetchPastEvents();
  };

  // Other Events
  const addOtherEvent = async (event: Omit<OtherEvent, 'id'>) => {
    const { error } = await supabase.from('other_events').insert([event]);
    if (error) {
      console.error('Error adding other event:', error);
      showToast('Error adding event: ' + error.message, 'error');
    } else {
      fetchOtherEvents();
    }
  };

  const updateOtherEvent = async (id: number, updates: Partial<OtherEvent>) => {
    const { error } = await supabase.from('other_events').update(updates).eq('id', id);
    if (error) {
      console.error('Error updating other event:', error);
      showToast('Error updating event: ' + error.message, 'error');
    } else {
      fetchOtherEvents();
    }
  };

  const deleteOtherEvent = async (id: number) => {
    const { error } = await supabase.from('other_events').delete().eq('id', id);
    if (!error) fetchOtherEvents();
  };


  // ... (existing helper functions for settings)
  // Partners/Settings (Simplified: update the single row)
  const setPartners = async (p: string[]) => {
    const previousPartners = [...partners];
    setPartnersState(p);
    try {
      // Delete all and re-insert
      await supabase.from('partners').delete().neq('id', 0);
      if (p.length > 0) {
        const inserts = p.map(name => ({ name }));
        const { error } = await supabase.from('partners').insert(inserts);
        if (error) throw error;
      }
    } catch (err: any) {
      // Revert to previous state on failure
      setPartnersState(previousPartners);
      showToast('Failed to update partners: ' + (err.message || 'Unknown error'), 'error');
    }
  };

  const updateSetting = async (key: string, value: any) => {
    // onConflict: 'key' ensures we UPDATE the existing row instead of
    // failing on a duplicate-key insert (site_settings uses `key` as the
    // unique identifier, not the auto-increment id).
    await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
  };

  const setSupportedByText = async (text: string) => {
    setSupportedByTextState(text);
    updateSetting('supported_by_text', text);
  };

  const updateHeroContent = async (updates: Partial<HeroContent>) => {
    const newVal = { ...heroContent, ...updates };
    setHeroContentState(newVal);
    updateSetting('hero_content', newVal);
  };

  const updateSocialLinks = async (updates: Partial<SocialLinks>) => {
    const newVal = { ...socialLinks, ...updates };
    setSocialLinksState(newVal);
    updateSetting('social_links', newVal);
  };

  const updateWhoWeAreContent = async (updates: Partial<WhoWeAreContent>) => {
    const newVal = { ...whoWeAreContent, ...updates };
    setWhoWeAreContentState(newVal);
    updateSetting('who_we_are_content', newVal);
  };

  const setFooterDescription = async (text: string) => {
    setFooterDescriptionState(text);
    updateSetting('footer_description', text);
  };

  const setAnnouncementText = async (text: string) => {
    setAnnouncementTextState(text);
    updateSetting('announcement_text', text);
  };

  const setRegistrationsOpen = async (val: boolean) => {
    setRegistrationsOpenState(val);
    updateSetting('registrations_open', val);
  };
  const setEmailNotifications = async (val: boolean) => {
    setEmailNotificationsState(val);
    updateSetting('email_notifications', val);
  };
  const setAutoApprove = async (val: boolean) => {
    setAutoApproveState(val);
    updateSetting('auto_approve', val);
  };
  const setMaintenanceMode = async (val: boolean) => {
    setMaintenanceModeState(val);
    updateSetting('maintenance_mode', val);
  };
  const setJoinCommunityLink = async (link: string) => {
    setJoinCommunityLinkState(link);
    updateSetting('join_community_link', link);
  };
  const setChaptersHeaderBanner = async (url: string) => {
    setChaptersHeaderBannerState(url);
    updateSetting('chapters_header_banner', url);
  };

  const setChaptersHeaderBannerOpacity = async (opacity: number) => {
    setChaptersHeaderBannerOpacityState(opacity);
    updateSetting('chapters_header_banner_opacity', opacity);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Convert any Google Drive share/view link to a direct image URL
  const convertGoogleDriveUrl = (url: string): string => {
    if (!url) return url;
    // Handle: https://drive.google.com/file/d/FILE_ID/view?...
    const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/\?]+)/);
    if (fileMatch) return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
    // Handle: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
    if (openMatch) return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
    // Already a direct uc link, or not a drive URL — return as-is
    return url;
  };

  // Ensure a URL has a protocol so it isn't treated as a relative path.
  // e.g. "www.google.com" -> "https://www.google.com"
  const normalizeUrl = (url: string): string => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    if (/^mailto:/i.test(url) || /^tel:/i.test(url)) return url;
    return `https://${url}`;
  };

  const uploadFile = async (originalFile: File, _bucket: string): Promise<string | null> => {
    const BUCKET = 'images'; // Create this in Supabase Dashboard -> Storage -> New Bucket (public)

    let file = originalFile;
    try {
      file = await compressImage(originalFile);
    } catch (err) {
      console.warn('Image compression failed, using original.', err);
    }

    // 1. Try Supabase Storage
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });

      if (error) throw error;

      if (data) {
        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
        return publicUrl;
      }
    } catch (err: any) {
      console.warn('Supabase upload failed (likely bucket missing), trying fallbacks...', err.message);
      showToast('Supabase Storage upload failed — using fallback upload method', 'error');
    }

    // 2. Fallback: ImgBB
    try {
      const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;
      if (IMGBB_KEY) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: formData });
        const json = await res.json();
        if (json.success) return json.data.url as string;
      }
    } catch (err) {
      console.warn('ImgBB upload failed', err);
      showToast('Image upload falling back to base64 — check Supabase Storage bucket', 'error');
    }

    // 3. Last Resort: Base64
    try {
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    } catch (error: any) {
      console.error('All upload methods failed:', error);
      showToast('Error uploading file: ' + error.message, 'error');
      return null;
    }
  };


  const fetchWorkshops = async () => {
    const { data, error } = await supabase.from('workshops').select('*').order('created_at', { ascending: false });
    if (!error && data) setWorkshops(data);
  };

  const addWorkshop = async (workshop: Omit<Workshop, 'id'>) => {
    const { error } = await supabase.from('workshops').insert(workshop);
    if (!error) fetchWorkshops();
  };

  const updateWorkshop = async (id: number, updates: Partial<Workshop>) => {
    const { error } = await supabase.from('workshops').update(updates).eq('id', id);
    if (!error) fetchWorkshops();
  };

  const deleteWorkshop = async (id: number) => {
    const { error } = await supabase.from('workshops').delete().eq('id', id);
    if (!error) fetchWorkshops();
  };


  const calculatedStats: DashboardStats = {
    totalRegistrations: totalRegs,
    pendingApprovals: totalRegs - totalApprovedRegs, // Approximation or fetch specific count if needed
  };

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    window.dispatchEvent(new Event('pushstate'));
  };

  const getGrowthData = () => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const now = new Date();
    const resultLabels: string[] = [];
    const monthlyCounts: number[] = Array(7).fill(0);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      resultLabels.push(months[d.getMonth()]);
    }

    registrations.forEach(reg => {
      const regDate = new Date(reg.createdAt);
      const regMonth = regDate.getMonth();
      const regYear = regDate.getFullYear();

      const idx = resultLabels.findIndex((_, index) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (6 - index), 1);
        return months[d.getMonth()] === months[regMonth] && d.getFullYear() === regYear;
      });

      if (idx !== -1) {
        monthlyCounts[idx]++;
      }
    });

    // Make it cumulative growth
    let runningTotal = Math.max(0, totalRegs - registrations.length); // Start with regs that aren't in the recent fetch
    const cumulativeData = monthlyCounts.map(count => {
      runningTotal += count;
      return runningTotal;
    });

    // If data is too low, add a tiny organic curve for visual appeal (only for UI)
    // Actually, let's just use real data but ensure the chart handles 0-1 range well.
    return { labels: resultLabels, data: cumulativeData };
  };

  const value = {
    session,
    loading,
    signIn,
    signOut,
    registrations,
    totalRegs,
    totalApprovedRegs,
    addRegistration,
    updateRegistrationStatus,
    deleteRegistration,
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

    missionLetter,
    updateMissionLetter,

    chapters,
    addChapter,
    updateChapter,
    deleteChapter,
    reorderChapter,
    communityLeads,
    addCommunityLead,
    updateCommunityLead,
    deleteCommunityLead,
    reorderCommunityLead,
    chapterEvents,
    addChapterEvent,
    updateChapterEvent,
    deleteChapterEvent,
    reorderChapterEvent,
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
    hackathons,
    addHackathon,
    updateHackathon,
    deleteHackathon,
    pastEvents,
    addPastEvent,
    updatePastEvent,
    deletePastEvent,
    otherEvents,
    addOtherEvent,
    updateOtherEvent,
    deleteOtherEvent,
    workshops,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop,
    registrationForms,
    addRegistrationForm,
    updateRegistrationForm,
    deleteRegistrationForm,

    // Tags
    tags,
    addTag,
    updateTag,
    deleteTag,

    // Partners
    partners,
    setPartners,
    supportedByText,
    setSupportedByText,
    heroContent,
    updateHeroContent,
    socialLinks,
    updateSocialLinks,
    whoWeAreContent,
    updateWhoWeAreContent,
    footerDescription,
    setFooterDescription,
    announcementText,
    setAnnouncementText,
    dashboardStats: calculatedStats,
    registrationsOpen,
    setRegistrationsOpen,
    emailNotifications,
    setEmailNotifications,
    autoApprove,
    setAutoApprove,
    maintenanceMode,
    setMaintenanceMode,
    joinCommunityLink,
    setJoinCommunityLink,
    chaptersHeaderBanner,
    setChaptersHeaderBanner,
    chaptersHeaderBannerOpacity,
    setChaptersHeaderBannerOpacity,
    showToast,
    uploadFile,
    convertGoogleDriveUrl,
    normalizeUrl,
    getGrowthData,
    updateRegistration,
    refreshData,
    navigate,
  };


  return (
    <AppDataContext.Provider value={value}>
      {children}
      {/* Global Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up transform transition-all duration-300 ${toast.type === 'success' ? 'bg-[#5f33e1] text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
                'bg-gray-800 text-white'
              }`}
          >
            {toast.type === 'success' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span className="text-sm font-bold tracking-tight uppercase">{toast.message}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </AppDataContext.Provider>
  );
};

