-- ============================================================================
-- Nerds Room — Chapters Platform Schema & RLS
-- Run in Supabase Dashboard -> SQL Editor (or via CLI).
-- Extends the existing `chapters` table and adds community_leads,
-- chapter_events, user_roles, plus a backend-driven "Join Community" link.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Extend existing `chapters` table (id, name, location already exist)
-- ----------------------------------------------------------------------------
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS chapter_type text NOT NULL DEFAULT 'city'; -- 'city' | 'campus'
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS lead text;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS member_count integer NOT NULL DEFAULT 0;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS banner_url text;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS is_live boolean NOT NULL DEFAULT true; -- campus chapters: Private(false)/Live(true)

-- ----------------------------------------------------------------------------
-- 2. community_leads  (name + position, reorderable)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS community_leads (
  id serial PRIMARY KEY,
  name text NOT NULL,
  position text NOT NULL,
  avatar_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. chapter_events  (featured events, chapter-scoped)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chapter_events (
  id serial PRIMARY KEY,
  title text NOT NULL,
  date text,
  location text,
  banner_url text,
  rsvp_link text,
  is_featured boolean NOT NULL DEFAULT false,
  chapter_id integer REFERENCES chapters(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. user_roles  (SuperAdmin manages all; Chapter Admin scoped to own chapter)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_roles (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('superadmin', 'chapter_admin')),
  chapter_id integer REFERENCES chapters(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, chapter_id)
);

-- ----------------------------------------------------------------------------
-- Helper: is the current auth user a SuperAdmin? (SECURITY DEFINER avoids recursion)
-- Defined AFTER user_roles exists so the reference resolves at create time.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'superadmin'
  );
$$;

-- ----------------------------------------------------------------------------
-- 5. Backend-driven "Join Community" link (site_settings key/value store)
-- ----------------------------------------------------------------------------
INSERT INTO site_settings (key, value)
SELECT 'join_community_link', '"https://discord.gg/nerdsroom"'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'join_community_link');

-- ============================================================================
-- ROW LEVEL SECURITY
-- Public = read only. Authenticated (admins) = write.
-- Role scoping (SuperAdmin vs Chapter Admin) is enforced in the app layer
-- (AdminPanel) on top of these policies, consistent with the existing
-- workshops/flagship_events RLS pattern in this repo.
-- ============================================================================

-- community_leads
ALTER TABLE community_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view community leads" ON community_leads FOR SELECT USING (true);
CREATE POLICY "Admins can insert community leads" ON community_leads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update community leads" ON community_leads FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete community leads" ON community_leads FOR DELETE USING (auth.role() = 'authenticated');

-- chapter_events
ALTER TABLE chapter_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view chapter events" ON chapter_events FOR SELECT USING (true);
CREATE POLICY "Admins can insert chapter events" ON chapter_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update chapter events" ON chapter_events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete chapter events" ON chapter_events FOR DELETE USING (auth.role() = 'authenticated');

-- chapters (extended)
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Admins can insert chapters" ON chapters FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update chapters" ON chapters FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete chapters" ON chapters FOR DELETE USING (auth.role() = 'authenticated');

-- user_roles (sensitive: never public; users see own row + supers see all)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own role or supers see all" ON user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_superadmin());
CREATE POLICY "Only supers manage roles" ON user_roles FOR ALL
  USING (public.is_superadmin())
  WITH CHECK (public.is_superadmin());
