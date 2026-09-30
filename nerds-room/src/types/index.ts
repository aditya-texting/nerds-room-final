
export interface Registration {
    id: number;
    name: string;
    role: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    hackathon_id?: number;
    form_responses?: Record<string, any>;
    ticket_token?: string;
}

export interface WhatWeDoCard {
    id: number;
    icon: string;
    title: string;
    description: string;
    stat: string;
    statLabel: string;
    iconBg: string;
    gradient: string;
}

export interface FlagshipEvent {
    id: number;
    title: string;
    description: string;
    image: string;
    location: string;
    stats: {
        label: string;
        value: string;
    }[];
    is_public: boolean;
    is_featured: boolean;
    registration_link?: string;
}

export interface PhotoGalleryItem {
    id: number;
    image_url: string;
    category: string;
    description?: string;
}

export interface SuccessStory {
    id: number;
    name: string;
    role: string;
    image_url: string;
    content: any; // jsonb structure
    bg_color: string;
    column_group: number;
    display_order: number;
}

export interface Chapter {
    id: number;
    name: string;
    location?: string;
    chapter_type?: 'city' | 'campus';
    lead?: string;
    member_count?: number;
    banner_url?: string;
    description?: string;
    partner_link?: string;
    join_link?: string; // per-chapter "Join Our Chapter" link
    display_order?: number;
    is_live?: boolean; // campus chapters: Private(false)/Live(true); city chapters always live
}

export interface CommunityLead {
    id: number;
    name: string;
    position: string;
    avatar_url?: string;
    display_order?: number;
    created_at?: string;
}

export interface ChapterEvent {
    id: number;
    title: string;
    date?: string;
    location?: string;
    banner_url?: string;
    rsvp_link?: string;
    is_featured?: boolean;
    chapter_id?: number | null;
    subchapter_id?: number | null;
    display_order?: number;
    created_at?: string;
}

export interface Subchapter {
    id: number;
    chapter_id: number;
    name: string;
    location?: string;
    lead?: string;
    member_count?: number;
    banner_url?: string;
    join_link?: string;
    display_order?: number;
    created_at?: string;
}

export interface ChapterContent {
    id: number;
    chapter_id: number;
    about_title?: string;
    about_text?: string;
    about_image?: string;
    gather_title?: string;
    gather_text?: string;
    gather_image?: string;
    values_title?: string;
    values_text?: string;
    values_image?: string;
    created_at?: string;
}

export interface UserRole {
    id: number;
    user_id: string;
    role: 'superadmin' | 'chapter_admin';
    chapter_id?: number | null;
    created_at?: string;
}

export interface Organizer {
    name: string;
    role?: string;
    logo_url?: string;
    social_links?: {
        platform: 'twitter' | 'linkedin' | 'github' | 'website' | 'instagram' | 'other';
        url: string;
    }[];
}

export interface FormField {
    id: string;
    type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'multiselect' | 'phone';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[]; // For select
}

export interface RegistrationForm {
    id: string;
    title: string;
    description?: string;
    fields: FormField[];
    created_at: string;
}

export interface Hackathon {
    id: number;
    title: string;
    slug: string;
    organizer: string; // Primary/legacy organizer name
    organizers?: Organizer[];
    time_left?: string;
    mode: 'Online' | 'In-person';
    prize: string;
    participants?: string;
    tags: string[];
    dates?: string;
    end_date?: string;  // ISO date string e.g. '2025-12-31'
    end_time?: string;  // e.g. '23:59'
    logo_url?: string;
    banner_url?: string;
    status: 'upcoming' | 'open' | 'ended';
    description?: string;
    about?: string;
    prizes?: { title: string; amount: string; description: string }[];
    rules?: string[];
    resources?: { name: string; link: string }[];
    registration_link?: string;
    registration_type?: 'external' | 'managed';
    managed_form_id?: string;
    discord_link?: string;
    managed_by_nerds: boolean;
    is_public: boolean;
    is_featured: boolean;
    auto_approve?: boolean;
    allow_comments?: boolean;
    length_category?: 'short' | 'medium' | 'long';
    badge_image_url?: string;
    badge_enabled?: boolean;
    challenges?: { title: string; description: string; icon?: string }[];
    schedule?: { date: string; time: string; title: string; description?: string }[];
    rewards?: { title: string; description: string; image?: string }[];
    partners?: { name: string; logo: string; type: string }[];
    mentors?: { name: string; role: string; bio?: string; image_url?: string; social_links?: any[] }[];
    jury?: { name: string; role: string; bio?: string; image_url?: string; social_links?: any[] }[];
    faq?: { question: string; answer: string }[];
}

export interface Workshop {
    id: number;
    title: string;
    slug: string;
    description: string;
    about?: string;
    image_url: string;
    banner_url?: string;
    date: string;
    location: string;
    registration_link?: string;
    is_public: boolean;
    is_featured: boolean;
    attendees_count: number;
    mentors?: { name: string; role: string; image_url?: string; social_links?: any[] }[];
    schedule?: { time: string; title: string; description?: string }[];
    faq?: { question: string; answer: string }[];
    topics?: string[];
}

export interface PastEvent {
    id: number;
    title: string;
    date: string;
    location: string;
    image_url: string;
    description: string;
    event_type: string;
    attendees_count: number;
    is_public: boolean;
    tags?: string[];
}

export type OtherEventType = 'ideathon' | 'meetup' | 'design-competition' | 'pitch-competition' | 'bootcamp' | 'seminar' | 'networking' | 'other';

export interface OtherEvent {
    id: number | 'new';
    title: string;
    slug: string;
    event_type: OtherEventType;
    mode: 'Online' | 'In-person' | 'Hybrid';
    description?: string;
    about?: string;
    date: string;
    end_date?: string;
    location: string;
    image_url?: string;
    banner_url?: string;
    logo_url?: string;
    registration_link?: string;
    status: 'upcoming' | 'open' | 'ended';
    is_public: boolean;
    is_featured: boolean;
    attendees_count: number;
    prize?: string;
    tags?: string[];
    organizers?: Organizer[];
    eligibilities?: { title: string; description: string }[];
    perks?: { title: string; description: string }[];
    rules?: string[];
    format_process?: { title: string; description: string; step?: number }[];
    created_at?: string;
}

export interface DashboardStats {
    totalRegistrations: number;
    pendingApprovals: number;
}

export interface HeroContent {
    headingLine1: string;
    headingLine2: string;
    headingLine3: string;
    description: string;
    primaryCTA: string;
    primaryCTALink?: string;
    secondaryCTA: string;
    secondaryCTALink?: string;
}

export interface WhoWeAreContent {
    headingLine1: string;
    headingLine2: string;
    description: string;
    description2: string;
    buildersOverride?: number;
}

export interface SocialLinks {
    telegram: string;
    instagram: string;
    linkedin: string;
    discord: string;
    twitter: string;
    youtube: string;
    whatsapp: string;
}

export interface MissionLetterData {
    id: number;
    title?: string;
    subtitle?: string;
    heading: string;
    content: string;
    signature_name: string;
    signature_role: string;
    profile_image_url: string;
}

export interface Tag {
    id: number;
    name: string;
    color?: string;
    created_at?: string;
}

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}
